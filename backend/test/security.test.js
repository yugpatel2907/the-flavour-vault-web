const { test } = require('node:test');
const assert = require('node:assert/strict');
const { randomBytes } = require('node:crypto');
const { Client } = require('pg');
const { databaseConfig } = require('../src/dbConfig');
const { requireMenuSyncAuth } = require('../src/adminAuth');

const databaseURL = 'postgresql://localhost/flavour_test';

function withEnv(name, value, run) {
  const previous = process.env[name];
  if (value === undefined) delete process.env[name];
  else process.env[name] = value;
  return Promise.resolve().then(run).finally(() => {
    if (previous === undefined) delete process.env[name];
    else process.env[name] = previous;
  });
}

test('database TLS defaults to certificate and hostname verification, including production', () => {
  assert.equal(databaseConfig({}), null);
  for (const NODE_ENV of [undefined, 'development', 'test', 'production']) {
    const config = databaseConfig({ DATABASE_URL: databaseURL, NODE_ENV });
    assert.deepEqual(config.ssl, { rejectUnauthorized: true });
    const client = new Client(config); // Resolve real pg options without connecting.
    assert.deepEqual(client.connectionParameters.ssl, { rejectUnauthorized: true });
    assert.equal(client.connectionParameters.ssl.checkServerIdentity, undefined);
  }
});

test('non-TLS databases require an explicit local/test opt-in and cannot be used in production', () => {
  for (const NODE_ENV of ['development', 'test']) {
    const config = databaseConfig({ DATABASE_URL: databaseURL, DATABASE_SSL_MODE: 'disable', NODE_ENV });
    assert.equal(new Client(config).connectionParameters.ssl, false);
  }
  for (const NODE_ENV of [undefined, 'production', 'preview']) {
    assert.throws(() => databaseConfig({ DATABASE_URL: databaseURL, DATABASE_SSL_MODE: 'disable', NODE_ENV }), /requires NODE_ENV/);
  }
  for (const DATABASE_SSL_MODE of ['no-verify', 'require', 'verify-ca', 'anything']) {
    assert.throws(() => databaseConfig({ DATABASE_URL: databaseURL, DATABASE_SSL_MODE }), /must be verify-full or disable/);
  }
});

test('connection-string TLS flags and PGSSLMODE cannot weaken real pg certificate verification', async () => {
  await withEnv('PGSSLMODE', 'no-verify', () => {
    for (const flags of [
      'sslmode=disable', 'sslmode=no-verify', 'ssl=no-verify', 'ssl=0',
      'sslmode=require&uselibpqcompat=true', 'sslmode=verify-ca&sslrootcert=/not/a/real/file',
      'sslcert=/not/a/real/file&sslkey=/not/a/real/file',
      'sslmode=disable&sslmode=no-verify&sslnegotiation=direct',
    ]) {
      const config = databaseConfig({ DATABASE_URL: `${databaseURL}?${flags}&application_name=flavour`, NODE_ENV: 'production' });
      const client = new Client(config);
      assert.deepEqual(client.connectionParameters.ssl, { rejectUnauthorized: true }, flags);
      assert.equal(client.connectionParameters.application_name, 'flavour');
      assert.ok(!config.connectionString.includes('ssl'));
      assert.ok(!config.connectionString.includes('uselibpqcompat'));
    }
  });
});

test('invalid database configuration fails without disclosing connection credentials', () => {
  for (const DATABASE_URL of ['not a URL with private-password', 'https://private-password@localhost/test']) {
    assert.throws(() => databaseConfig({ DATABASE_URL }), error =>
      error.message === 'DATABASE_URL must be a valid PostgreSQL URL' && !error.message.includes('private-password'));
  }
});

test('an optional provider CA file retains verification and missing/empty CA files fail closed', () => {
  const fs = require('node:fs');
  const path = require('node:path');
  const dir = fs.mkdtempSync(path.join(require('node:os').tmpdir(), 'flavour-ca-test-'));
  const caFile = path.join(dir, 'provider-ca.pem');
  // Public system CA fixture, never a private certificate/key or credential.
  const ca = require('node:tls').rootCertificates[0];
  try {
    fs.writeFileSync(caFile, ca);
    const config = databaseConfig({ DATABASE_URL: databaseURL, NODE_ENV: 'production', DATABASE_SSL_CA_FILE: caFile });
    const ssl = new Client(config).connectionParameters.ssl;
    assert.equal(ssl.rejectUnauthorized, true);
    assert.equal(ssl.ca, ca);
    assert.equal(ssl.checkServerIdentity, undefined);
    fs.writeFileSync(caFile, '');
    assert.throws(() => databaseConfig({ DATABASE_URL: databaseURL, DATABASE_SSL_CA_FILE: caFile }), /Unable to read DATABASE_SSL_CA_FILE/);
    fs.unlinkSync(caFile);
    assert.throws(() => databaseConfig({ DATABASE_URL: databaseURL, DATABASE_SSL_CA_FILE: caFile }), /Unable to read DATABASE_SSL_CA_FILE/);
  } finally { fs.rmSync(dir, { recursive: true, force: true }); }
});

function response() {
  return {
    statusCode: 200, headers: {},
    status(code) { this.statusCode = code; return this; },
    set(name, value) { this.headers[name] = value; return this; },
    json(body) { this.body = body; return this; },
  };
}
const request = authorization => ({ get: name => name === 'authorization' ? authorization : undefined });

test('menu sync rejects missing, malformed and incorrect bearer tokens without running its handler', async () => {
  const token = randomBytes(32).toString('hex');
  await withEnv('ADMIN_MENU_SYNC_TOKEN', token, () => {
    for (const header of [undefined, '', `Basic ${token}`, 'Bearer', `Bearer ${token} extra`, 'Bearer x', `Bearer ${token}x`]) {
      const res = response();
      let called = false;
      requireMenuSyncAuth(request(header), res, () => { called = true; });
      assert.equal(res.statusCode, 401);
      assert.equal(res.headers['WWW-Authenticate'], 'Bearer');
      assert.equal(called, false);
      assert.ok(!JSON.stringify(res.body).includes(token));
    }
    let called = false;
    requireMenuSyncAuth(request(`Bearer ${token}`), response(), () => { called = true; });
    assert.equal(called, true);
  });
});

test('menu sync fails closed when the backend secret is missing or invalid', async () => {
  for (const token of [undefined, '', 'invalid whitespace']) {
    await withEnv('ADMIN_MENU_SYNC_TOKEN', token, () => {
      const res = response();
      requireMenuSyncAuth(request('Bearer test-only'), res, () => assert.fail('must not authorize'));
      assert.equal(res.statusCode, 503);
      const unauthenticated = response();
      requireMenuSyncAuth(request(), unauthenticated, () => assert.fail('must not authorize'));
      assert.equal(unauthenticated.statusCode, 401);
    });
  }
});

test('actual menu-sync route authenticates before database writes and preserves authorized sync', async () => {
  const app = require('../src/index');
  const db = require('../src/db');
  const route = app._router.stack.find(layer => layer.route?.path === '/api/admin/menu-sync').route;
  assert.equal(route.stack[0].handle, requireMenuSyncAuth);
  const previousPool = db.pool, previousQuery = db.query;
  const calls = [];
  db.pool = {}; // Every database call is intercepted; no live menu is modified.
  db.query = async (sql, params) => { calls.push({ sql, params }); return { rows: [] }; };
  const token = randomBytes(32).toString('hex');
  try {
    await withEnv('ADMIN_MENU_SYNC_TOKEN', token, async () => {
      const payload = { menu: [{ name: 'Test dish', category: 'test', price: 100, isVeg: true, spicyLevel: 2 }] };
      const invoke = async (header, body) => {
        const res = response();
        await route.stack[0].handle({ ...request(header), body }, res, () =>
          route.stack[1].handle({ body }, res));
        return res;
      };
      assert.equal((await invoke(undefined, payload)).statusCode, 401);
      assert.equal((await invoke('Bearer wrong', payload)).statusCode, 401);
      assert.equal(calls.length, 0);
      assert.equal((await invoke(`Bearer ${token}`, { menu: 'invalid' })).statusCode, 400);
      assert.equal(calls.length, 0);
      const valid = await invoke(`Bearer ${token}`, payload);
      assert.deepEqual(valid.body, { ok: true, count: 1 });
      assert.ok(calls.some(call => call.sql.startsWith('TRUNCATE')));
      assert.deepEqual(calls.find(call => call.sql.startsWith('INSERT')).params,
        ['Test dish', 'test', 100, true, '', 2]);
    });
  } finally { db.pool = previousPool; db.query = previousQuery; }
});

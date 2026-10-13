const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { createChatHandler } = require('../src/server/ai/agent');
const menu = require('../src/server/menu');
const { menuCatalog } = require('../src/data/menu.ts');

const payload = { messages: [{ role: 'user', content: 'Help me choose.' }], cart: [] };
const request = (body = JSON.stringify(payload), signal) => new Request('http://localhost/api/ai/chat', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body, signal });
const sdk = stream => ({ tool: value => value, jsonSchema: value => value, stepCountIs: () => () => false, streamText: stream });

test('one catalog includes every existing dish and carousel item; unknown diet is not guessed', async () => {
  assert.equal(menuCatalog.length, 122);
  assert.equal(new Set(menuCatalog.map(item => item.id)).size, 122);
  assert.deepEqual(await menu.searchMenu(), menuCatalog);
  assert.equal((await menu.getMenuItem('ps8')).price, 220);
  // This existing frontend dish was absent from the old backend's copied menu.
  assert.equal((await menu.getMenuItem('ns22')).price, 310);
  for (const id of ['c1', 'c2', 'c3', 'c4']) assert.equal((await menu.getMenuItem(id)).isVeg, null);
  assert.ok((await menu.searchMenu({ isVeg: true })).every(item => item.isVeg === true));
  assert.ok((await menu.searchMenu({ isVeg: false })).every(item => item.isVeg === false));
  assert.ok(menuCatalog.every(item => [1, 2, 3].includes(item.spicyLevel)));
  assert.ok(menuCatalog.every(item => !('allergens' in item) && !('nutrition' in item)));
  assert.deepEqual(await menu.searchMenu({ query: "x%' OR 1=1--" }), []);
});

test('HTTP boundary rejects malformed JSON, oversized bytes and extra untrusted fields before model access', async () => {
  let calls = 0;
  const handler = createChatHandler({ model: async () => { calls++; throw new Error('Unexpected call'); } });
  for (const body of ['{', JSON.stringify({ ...payload, sql: 'DROP TABLE menu' }), JSON.stringify({ ...payload, cart: [{ itemId: 'b1', quantity: 1, price: 0 }] })]) {
    assert.equal((await handler(request(body))).status, 400);
  }
  assert.equal((await handler(request('x'.repeat(100 * 1024 + 1)))).status, 413);
  assert.equal((await handler(new Request('http://localhost/api/ai/chat', { method: 'POST', body: JSON.stringify(payload) }))).status, 415);
  assert.equal(calls, 0);
});

test('missing configuration is a friendly 503 and invalid credentials/provider failures are sanitized', async () => {
  const previous = { GROQ_API_KEY: process.env.GROQ_API_KEY, AI_MODEL: process.env.AI_MODEL };
  delete process.env.GROQ_API_KEY; delete process.env.AI_MODEL;
  try {
    const response = await createChatHandler()(request());
    assert.equal(response.status, 503);
    assert.match((await response.json()).error, /temporarily unavailable/);
  } finally {
    for (const [name, value] of Object.entries(previous)) { if (value === undefined) delete process.env[name]; else process.env[name] = value; }
  }
  const response = await createChatHandler({ model: async () => { throw new Error('PRIVATE_PROVIDER_CREDENTIAL'); } })(request());
  assert.equal(response.status, 502);
  assert.ok(!(await response.text()).includes('PRIVATE_PROVIDER_CREDENTIAL'));
});

test('browser cancellation aborts SDK work and releases the concurrency slot', async () => {
  const signals = [];
  const handler = createChatHandler({ model: async () => ({}), loadSDK: async () => sdk(options => {
    signals.push(options.abortSignal);
    return { fullStream: (async function* () {
      await new Promise(resolve => options.abortSignal.addEventListener('abort', resolve, { once: true }));
      yield { type: 'text-delta', text: 'interrupted' };
    })() };
  }) });
  const responses = await Promise.all(Array.from({ length: 4 }, () => handler(request())));
  assert.equal((await handler(request())).status, 429);
  await responses[0].body.cancel();
  assert.equal(signals[0].aborted, true);
  const next = await handler(request());
  assert.equal(next.status, 200);
  await Promise.all([...responses.slice(1), next].map(response => response.body.cancel()));
});

test('timeout aborts the SDK, streams a friendly error and never emits a success marker', async () => {
  const handler = createChatHandler({ timeoutMs: 20, model: async () => ({}), loadSDK: async () => sdk(options => ({ fullStream: (async function* () {
    await new Promise(resolve => options.abortSignal.addEventListener('abort', resolve, { once: true }));
    yield { type: 'text-delta', text: 'should not be sent' };
  })() })) });
  const response = await handler(request());
  const body = await response.text();
  assert.match(body, /temporarily unavailable/);
  assert.ok(!body.includes('should not be sent'));
  assert.ok(!body.includes('"type":"done"'));
});

test('active runtime has no Express, database, backend URL, admin endpoint or order submission dependency', () => {
  const root = path.join(__dirname, '..');
  const config = fs.readFileSync(path.join(root, 'next.config.mjs'), 'utf8');
  assert.ok(!config.includes('BACKEND_URL') && !config.includes('rewrites'));
  for (const file of ['src/server/menu.js', 'src/server/ai/tools.js', 'src/server/ai/agent.js', 'src/server/ai/provider.js']) {
    const source = fs.readFileSync(path.join(root, file), 'utf8');
    assert.ok(!/require\(['"](?:pg|express)|DATABASE_URL|backend\/|\beval\s*\(|new Function|execSync|readFile/.test(source), file);
  }
  const route = fs.readFileSync(path.join(root, 'src/app/api/ai/chat/route.ts'), 'utf8');
  assert.match(route, /import 'server-only'/);
  const drawer = fs.readFileSync(path.join(root, 'src/components/ui/CartDrawer.tsx'), 'utf8');
  assert.ok(!drawer.includes('fetch(') && !drawer.includes('/api/orders') && !drawer.includes('ORDER CONFIRMED'));
  assert.match(drawer, /DEMO CHECKOUT COMPLETE/);
  assert.match(drawer, /No order was sent or saved/);
  const example = fs.readFileSync(path.join(root, '.env.example'), 'utf8');
  assert.ok(!/^NEXT_PUBLIC_.*(?:GROQ|KEY|TOKEN)/m.test(example));
});

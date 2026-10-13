const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

test('root manifest, lockfile and installed direct dependencies agree without a backend install', () => {
  const root = path.join(__dirname, '..');
  const read = filename => JSON.parse(fs.readFileSync(path.join(root, filename), 'utf8'));
  const manifest = read('package.json');
  const lock = read('package-lock.json');
  for (const kind of ['dependencies', 'devDependencies']) {
    assert.deepEqual(lock.packages[''][kind], manifest[kind]);
    for (const name of Object.keys(manifest[kind])) {
      assert.equal(read(`node_modules/${name}/package.json`).version, lock.packages[`node_modules/${name}`].version, name);
    }
  }
  assert.deepEqual(lock.packages[''].engines, manifest.engines);
  assert.equal(manifest.dependencies.ai, '6.0.301');
  assert.equal(manifest.dependencies['@ai-sdk/groq'], '3.0.72');
  assert.ok(!Object.keys(manifest.dependencies).some(name => /langchain|langgraph|n8n|pinecone|express|^pg$/.test(name)));
});

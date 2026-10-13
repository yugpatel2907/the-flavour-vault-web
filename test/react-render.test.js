const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const Module = require('node:module');
const frontend = Module.createRequire(path.join(__dirname, '../package.json'));
const ts = frontend('typescript');
const React = frontend('react');
const { renderToString } = frontend('react-dom/server');
const loaded = new Map();

// Compile real frontend modules with the installed TypeScript compiler, then
// render with real React. No source replacement or build configuration override.
function load(file) {
  const filename = path.join(__dirname, '../src', file);
  if (loaded.has(filename)) return loaded.get(filename).exports;
  const compiled = ts.transpileModule(fs.readFileSync(filename, 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.ReactJSX, esModuleInterop: true, target: ts.ScriptTarget.ES2020 }, fileName: filename,
  });
  const instance = new Module(filename, module); instance.filename = filename;
  instance.paths = Module._nodeModulePaths(path.dirname(filename));
  const requireOriginal = instance.require.bind(instance);
  instance.require = name => {
    if (!name.startsWith('@/')) return requireOriginal(name);
    const target = name.slice(2);
    for (const extension of ['.tsx', '.ts']) if (fs.existsSync(path.join(__dirname, '../src', target + extension))) return load(target + extension);
    throw new Error(`Unresolved frontend alias: ${name}`);
  };
  loaded.set(filename, instance); instance._compile(compiled.outputText, filename); return instance.exports;
}

test('real React renders the Flavour AI entry, starter prompts, empty cart and accessible mobile dialog', () => {
  const { CartProvider } = load('context/CartContext.tsx');
  const AI = load('components/ui/ai-recommender.tsx').default;
  const markup = renderToString(React.createElement(CartProvider, null, React.createElement(AI, { isOpen: true, onClose: () => {} })));
  for (const text of ['FLAVOUR AI', 'Something spicy under ₹400', 'Vegetarian dinner', 'Build a meal for two', 'Help me choose', 'View cart', 'aria-modal="true"', 'Ask Flavour AI']) assert.ok(markup.includes(text), text);
  assert.ok(markup.includes('sm:grid-cols-2'));
  assert.equal(renderToString(React.createElement(CartProvider, null, React.createElement(AI, { isOpen: false, onClose: () => {} }))), '');
});

test('particle values retain visual variety and background server renders remain stable', () => {
  const { particleRandom } = load('lib/particleRandom.ts');
  const values = Array.from({ length: 1000 }, (_, index) => particleRandom(index, 48));
  assert.ok(values.every(value => value >= 0 && value < 1));
  assert.ok(new Set(values).size > 990);
  assert.ok(values.every((value, index) => value === particleRandom(index, 48)));
  assert.notEqual(particleRandom(0, 48), particleRandom(0, 49));
  const Background = load('components/ui/AuthenticBackground.tsx').default;
  const render = () => renderToString(React.createElement(Background));
  const first = render();
  assert.equal(first, render());
  assert.equal((first.match(/class="absolute rounded-full pointer-events-none"/g) || []).length, 24);
});

test('existing reservation and tracking UI clearly identify their demo behavior', () => {
  const Reservation = load('components/sections/FooterReservation.tsx').default;
  const Tracker = load('components/ui/order-tracker.tsx').default;
  const reservation = renderToString(React.createElement(Reservation));
  assert.ok(reservation.includes('TRY THE RESERVATION DEMO'));
  assert.ok(reservation.includes('Do not enter real personal details'));
  const tracker = renderToString(React.createElement(Tracker, { isOpen: true, onClose: () => {} }));
  assert.ok(tracker.includes('ORDER TRACKING DEMO'));
  assert.ok(tracker.includes('Sample animation'));
  assert.ok(!tracker.includes('Real-time'));
});

const { test } = require('node:test');
const assert = require('node:assert/strict');
const { pathToFileURL } = require('node:url');
const path = require('node:path');
const load = file => import(pathToFileURL(path.join(__dirname, '../src/lib', file)).href);

const item = { id: 'b1', name: 'Veg Biryani', category: 'biryani', price: 160, isVeg: true, spicyLevel: 1 };

test('browser cart guards reject stale, invalid and excessive actions', async () => {
  const { validateCartAction } = await load('cartActions.ts');
  const current = [{ menuItem: item, quantity: 1 }];
  const action = { id: 'action-1', kind: 'add', item, quantity: 1, expectedQuantity: 1 };
  assert.equal(validateCartAction(current, action), null);
  assert.match(validateCartAction([{ menuItem: item, quantity: 2 }], action), /cart changed/);
  assert.match(validateCartAction(current, { ...action, quantity: 0 }), /Quantity/);
  assert.match(validateCartAction(current, { ...action, quantity: 1.5 }), /Quantity/);
  assert.match(validateCartAction(current, { ...action, quantity: 50 }), /Quantity/);
  assert.match(validateCartAction(current, { ...action, item: { ...item, price: NaN } }), /invalid/);
  assert.equal(validateCartAction(current, { ...action, kind: 'update', quantity: 2 }), null);
  assert.equal(validateCartAction(current, { ...action, kind: 'remove' }), null);
  assert.match(validateCartAction([], { ...action, kind: 'remove', expectedQuantity: 0 }), /no longer/);
});

test('browser stream handles split frames and multibyte rupee text, tool events and completion', async () => {
  const { readChatStream } = await load('flavourAI.ts');
  const source = 'data: {"type":"text","text":"₹300"}\n\ndata: {"type":"tool-result","id":"a1","name":"add_to_cart","output":{"action":{"id":"a1"}}}\n\ndata: {"type":"done"}\n\n';
  const encoded = new TextEncoder().encode(source);
  const stream = new ReadableStream({ start(controller) {
    for (let index = 0; index < encoded.length; index += 2) controller.enqueue(encoded.slice(index, index + 2));
    controller.close();
  } });
  const events = [];
  await readChatStream(new Response(stream), event => events.push(event));
  assert.equal(events[0].text, '₹300');
  assert.equal(events[1].output.action.id, 'a1');
  assert.equal(events[2].type, 'done');
});

test('browser errors preserve completed action events; truncated/provider error streams fail', async () => {
  const { readChatStream } = await load('flavourAI.ts');
  const events = [];
  await assert.rejects(readChatStream(new Response('data: {"type":"tool-result","id":"a1","name":"add_to_cart","output":{}}\n\ndata: {"type":"error","message":"Please try again"}\n\n'), event => events.push(event)), /Please try again/);
  assert.equal(events.length, 1);
  await assert.rejects(readChatStream(new Response('data: {"type":"text","text":"partial"}\n\n'), () => {}), /interrupted/);
  await assert.rejects(readChatStream(new Response(JSON.stringify({ error: 'Temporarily unavailable' }), { status: 503 }), () => {}), /Temporarily unavailable/);
});

const { test } = require('node:test');
const assert = require('node:assert/strict');
const { EventEmitter } = require('node:events');
const { createChatHandler } = require('./chat-fixture');
const { createToolDefinitions, summarizeCart } = require('../src/server/ai/tools');

function response() {
  const res = new EventEmitter(); res.body = ''; res.destroyed = false; res.writableEnded = false;
  res.status = code => { res.statusCode = code; return res; };
  res.set = headers => { res.headers = headers; return res; };
  res.flushHeaders = () => { res.headersSent = true; };
  res.write = value => { res.body += value; return true; };
  res.end = () => { res.writableEnded = true; };
  res.json = value => { res.jsonBody = value; res.writableEnded = true; return res; };
  return res;
}
const events = res => res.body.split('\n\n').filter(Boolean).map(frame => JSON.parse(frame.slice(6)));

test('real installed AI SDK executes menu tools, streams results, and retains conversation context', async () => {
  const { MockLanguageModelV3 } = await import('ai/test');
  const sdk = await import('ai');
  const usage = { inputTokens: { total: 1 }, outputTokens: { total: 1 } };
  let step = 0;
  const model = new MockLanguageModelV3({ doStream: async () => ({ stream: sdk.simulateReadableStream({ chunks: step++ === 0 ? [
    { type: 'stream-start', warnings: [] },
    { type: 'tool-call', toolCallId: 'search1', toolName: 'search_menu', input: JSON.stringify({ isVeg: true, minSpicyLevel: 2, maxPrice: 300 }) },
    { type: 'finish', finishReason: { unified: 'tool-calls', raw: 'tool_calls' }, usage },
  ] : [
    { type: 'stream-start', warnings: [] }, { type: 'text-start', id: 'text1' },
    { type: 'text-delta', id: 'text1', delta: 'Here are your menu options.' }, { type: 'text-end', id: 'text1' },
    { type: 'finish', finishReason: { unified: 'stop', raw: 'stop' }, usage },
  ], initialDelayInMs: 0, chunkDelayInMs: 0 }) }) });
  const res = response();
  await createChatHandler({ model: async () => model })({ body: { messages: [{ role: 'user', content: "I'm vegetarian." }, { role: 'assistant', content: 'Understood.' }, { role: 'user', content: 'Spicy, under ₹300.' }], cart: [] } }, res);
  assert.equal(res.statusCode, 200);
  const output = events(res);
  const result = output.find(event => event.type === 'tool-result');
  assert.ok(result.output.items.length);
  assert.ok(result.output.items.every(item => item.isVeg && item.spicyLevel >= 2 && item.price <= 300));
  assert.ok(output.some(event => event.type === 'text' && event.text.includes('menu options')));
  assert.equal(output.at(-1).type, 'done');
  assert.equal(model.doStreamCalls.length, 2);
  assert.ok(JSON.stringify(model.doStreamCalls[1].prompt).includes("I'm vegetarian."));
});

test('real Groq provider parses streamed tool calls and text using an intercepted test-only HTTP transport', async () => {
  const { createGroq } = await import('@ai-sdk/groq');
  let calls = 0;
  const fixtureFetch = async (url, init) => {
    assert.ok(String(url).startsWith('https://api.groq.com/'));
    const request = JSON.parse(init.body);
    assert.ok(request.tools.some(tool => tool.function.name === 'search_menu'));
    const delta = calls++ === 0 ? { tool_calls: [{ index: 0, id: 'g1', type: 'function', function: { name: 'get_menu_item', arguments: '{"itemId":"b1"}' } }] } : { content: 'Veg Biryani is on the menu.' };
    const first = { id: 'fixture', object: 'chat.completion.chunk', created: 1, model: 'fixture', choices: [{ index: 0, delta, finish_reason: null }] };
    const end = { ...first, choices: [{ index: 0, delta: {}, finish_reason: calls === 1 ? 'tool_calls' : 'stop' }] };
    return new Response(`data: ${JSON.stringify(first)}\n\ndata: ${JSON.stringify(end)}\n\ndata: [DONE]\n\n`, { headers: { 'Content-Type': 'text/event-stream' } });
  };
  // Explicit fixture credentials never leave the intercepted transport.
  const model = createGroq({ apiKey: 'fixture-only-not-a-real-key', fetch: fixtureFetch })('fixture-model');
  const res = response();
  await createChatHandler({ model: async () => model })({ body: { messages: [{ role: 'user', content: 'Tell me about Veg Biryani.' }], cart: [] } }, res);
  const output = events(res);
  assert.equal(output.find(event => event.type === 'tool-result').output.items[0].price, 160);
  assert.ok(output.some(event => event.type === 'text' && event.text.includes('Veg Biryani')));
  assert.equal(calls, 2);
  assert.equal(output.at(-1).type, 'done');
});

test('failed actions release their reservation; missing prices cannot become free dishes', async () => {
  const tools = createToolDefinitions([]);
  assert.equal((await tools.add_to_cart.execute({ itemId: 'missing', quantity: 1 })).error.code, 'ITEM_UNAVAILABLE');
  assert.equal((await tools.get_cart.execute({})).subtotal, 0);
  assert.ok((await tools.add_to_cart.execute({ itemId: 'b1', quantity: 1 })).action);
  const summary = await summarizeCart([{ itemId: 'broken', quantity: 1 }], { getMenuItem: async () => ({ id: 'broken', price: null }) });
  assert.equal(summary.readyForCheckout, false);
});

test('real SDK stops after a cart action and rejects malformed quantities without an action', async () => {
  const { MockLanguageModelV3 } = await import('ai/test');
  const sdk = await import('ai');
  for (const quantity of [1, 0]) {
    const model = new MockLanguageModelV3({ doStream: async () => ({ stream: sdk.simulateReadableStream({ chunks: [
      { type: 'stream-start', warnings: [] },
      { type: 'tool-call', toolCallId: 'add1', toolName: 'add_to_cart', input: JSON.stringify({ itemId: 'b1', quantity }) },
      { type: 'finish', finishReason: { unified: 'tool-calls', raw: 'tool_calls' }, usage: { inputTokens: { total: 1 }, outputTokens: { total: 1 } } },
    ], initialDelayInMs: 0, chunkDelayInMs: 0 }) }) });
    const res = response();
    await createChatHandler({ model: async () => model })({ body: { messages: [{ role: 'user', content: 'Add Veg Biryani.' }], cart: [] } }, res);
    const results = events(res).filter(event => event.type === 'tool-result');
    if (quantity === 1) {
      assert.equal(results.length, 1);
      assert.equal(results[0].output.action.item.id, 'b1');
      assert.equal(results[0].output.status, 'pending');
      assert.equal(model.doStreamCalls.length, 1);
    } else {
      assert.ok(results.every(result => !result.output.action));
      assert.equal(results[0].output.error.code, 'INVALID_INPUT');
    }
  }
});

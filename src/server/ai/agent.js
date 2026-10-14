const validation = require('./validation');
const { createTools } = require('./tools');
const { getModel } = require('./provider');
const system = require('./prompts');

const unavailable = 'Flavour AI is temporarily unavailable. Please try again shortly, or browse the menu and use the cart.';
const invalid = 'Invalid chat request. Send a conversation and item IDs with quantities.';

async function readPayload(request) {
  if (request.headers.get('Content-Type')?.split(';')[0].trim().toLowerCase() !== 'application/json') {
    throw Object.assign(new Error('Send the chat request as application/json.'), { status: 415 });
  }
  // Bound bytes as well as validated message lengths before parsing untrusted JSON.
  const reader = request.body?.getReader();
  if (!reader) throw new validation.ValidationError(invalid);
  const chunks = [];
  let size = 0;
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      size += value.byteLength;
      if (size > 100 * 1024) {
        await reader.cancel();
        throw Object.assign(new Error('Chat request is too large.'), { status: 413 });
      }
      chunks.push(value);
    }
  } finally { reader.releaseLock(); }
  return validation.request(JSON.parse(Buffer.concat(chunks).toString('utf8')));
}

function createChatHandler({ loadSDK = () => import('ai'), model = getModel, source, timeoutMs = 60000 } = {}) {
  let active = 0;
  return async request => {
    let payload;
    try { payload = await readPayload(request); }
    catch (error) {
      const status = [413, 415].includes(error.status) ? error.status : 400;
      return Response.json({ error: status === 400 ? invalid : error.message }, { status });
    }
    if (active >= 4) return Response.json({ error: 'Flavour AI is busy. Please try again shortly.' }, { status: 429 });
    active++;
    const abort = new AbortController();
    const disconnected = () => abort.abort();
    request.signal.addEventListener('abort', disconnected, { once: true });
    if (request.signal.aborted) abort.abort();
    const timeout = setTimeout(() => abort.abort(), timeoutMs);
    let released = false;
    const cleanup = () => {
      if (released) return;
      released = true;
      clearTimeout(timeout);
      request.signal.removeEventListener('abort', disconnected);
      active--;
    };
    let sdk, result, tools;
    try {
      const languageModel = await model();
      sdk = await loadSDK();
      if (abort.signal.aborted) throw new Error('Interrupted');
      tools = createTools(payload.cart, sdk, source);
      result = sdk.streamText({
        model: languageModel, system, messages: payload.messages, tools,
        maxOutputTokens: 1200, maxRetries: 0, abortSignal: abort.signal,
        stopWhen: [sdk.stepCountIs(6), ({ steps }) => steps.some(step => step.toolResults.some(result => result.output?.action))],
      });
    } catch (error) {
      cleanup();
      return Response.json({ error: unavailable }, { status: error.status === 503 ? 503 : 502 });
    }
    const encoder = new TextEncoder();
    let cancelled = false;
    const stream = new ReadableStream({
      async start(controller) {
        const send = event => { if (!cancelled) controller.enqueue(encoder.encode(`data: ${JSON.stringify(event)}\n\n`)); };
        try {
          let failed = false;
          for await (const part of result.fullStream) {
            if (abort.signal.aborted) throw new Error('Interrupted');
            if (part.type === 'text-delta') send({ type: 'text', text: part.text });
            if (part.type === 'tool-input-start' || part.type === 'tool-call') {
              if (Object.hasOwn(tools, part.toolName)) send({ type: 'tool-state', id: part.id || part.toolCallId, name: part.toolName });
            }
            if (part.type === 'tool-result') send({ type: 'tool-result', id: part.toolCallId, name: part.toolName, output: part.output });
            if (part.type === 'tool-error') send({ type: 'tool-result', id: part.toolCallId, name: part.toolName, output: { error: { code: 'TOOL_FAILED', message: 'That action could not be completed. Please try again.' } } });
            if (part.type === 'error') { failed = true; send({ type: 'error', message: unavailable }); }
          }
          if (abort.signal.aborted) throw new Error('Interrupted');
          if (!failed) send({ type: 'done' });
        } catch {
          // Never expose provider responses, stack traces or credentials.
          send({ type: 'error', message: unavailable });
        } finally {
          if (!cancelled) controller.close();
          cleanup();
        }
      },
      cancel() { cancelled = true; abort.abort(); cleanup(); },
    });
    return new Response(stream, { headers: {
      'Content-Type': 'text/event-stream; charset=utf-8',
      'Cache-Control': 'no-cache, no-transform',
      'X-Accel-Buffering': 'no',
    } });
  };
}

module.exports = { createChatHandler };

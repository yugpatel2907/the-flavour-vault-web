const validation = require('./validation');
const { createTools } = require('./tools');
const { getModel } = require('./provider');
const system = require('./prompts');

const unavailable = 'Flavour AI is temporarily unavailable. Please try again shortly, or continue ordering from the menu.';

function createChatHandler({ loadSDK = () => import('ai'), model = getModel, source } = {}) {
  let active = 0;
  return async (req, res) => {
    let payload;
    try { payload = validation.request(req.body); }
    catch { return res.status(400).json({ error: 'Invalid chat request. Send a conversation and item IDs with quantities.' }); }
    if (active >= 4) return res.status(429).json({ error: 'Flavour AI is busy. Please try again shortly.' });
    active++;
    const abort = new AbortController();
    const disconnected = () => { if (!res.writableEnded) abort.abort(); };
    res.on('close', disconnected);
    const timeout = setTimeout(() => abort.abort(), 60000);
    const send = event => { if (!res.destroyed && !res.writableEnded) res.write(`data: ${JSON.stringify(event)}\n\n`); };
    try {
      const languageModel = await model();
      const sdk = await loadSDK();
      const tools = createTools(payload.cart, sdk, source);
      const result = sdk.streamText({
        model: languageModel, system, messages: payload.messages, tools,
        maxOutputTokens: 1200, maxRetries: 0, abortSignal: abort.signal,
        stopWhen: [sdk.stepCountIs(6), ({ steps }) => steps.some(step => step.toolResults.some(result => result.output?.action))],
      });
      res.status(200).set({ 'Content-Type': 'text/event-stream; charset=utf-8', 'Cache-Control': 'no-cache, no-transform', 'X-Accel-Buffering': 'no' });
      res.flushHeaders();
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
      if (!failed) send({ type: 'done' });
      res.end();
    } catch (error) {
      // Never return provider bodies, stack traces, API keys, or database errors.
      if (!res.destroyed) {
        if (res.headersSent) { send({ type: 'error', message: unavailable }); res.end(); }
        else res.status(error.status === 503 ? 503 : 502).json({ error: unavailable });
      }
    } finally {
      clearTimeout(timeout);
      res.removeListener('close', disconnected);
      active--;
    }
  };
}
module.exports = { createChatHandler };

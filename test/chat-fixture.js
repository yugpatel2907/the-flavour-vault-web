const { createChatHandler: createWebHandler } = require('../src/server/ai/agent');

// Preserve the existing deterministic assertions while testing the new Web
// Request/Response transport. This adapter exists only in tests, not the app.
function createChatHandler(options) {
  const handler = createWebHandler(options);
  return async ({ body }, capture) => {
    const response = await handler(new Request('http://localhost/api/ai/chat', {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body),
    }));
    capture.statusCode = response.status;
    capture.headers = Object.fromEntries(response.headers);
    if (response.headers.get('Content-Type').includes('application/json')) capture.jsonBody = await response.json();
    else capture.body = await response.text();
    capture.writableEnded = true;
  };
}

module.exports = { createChatHandler };

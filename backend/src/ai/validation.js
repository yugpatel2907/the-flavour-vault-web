class ValidationError extends Error {}
const fail = message => { throw new ValidationError(message); };
function object(value, keys) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) fail('Expected an object.');
  if (Object.keys(value).some(key => !keys.includes(key))) fail('Unexpected field.');
  return value;
}
function itemId(value) {
  if (typeof value !== 'string' || !/^[a-zA-Z0-9_-]{1,80}$/.test(value)) fail('Invalid item ID.');
  return value;
}
function quantity(value) {
  if (!Number.isInteger(value) || value < 1 || value > 50) fail('Quantity must be an integer between 1 and 50.');
  return value;
}
function filters(value) {
  object(value, ['query', 'isVeg', 'minPrice', 'maxPrice', 'category', 'minSpicyLevel', 'maxSpicyLevel']);
  for (const key of ['query', 'category']) {
    if (value[key] !== undefined && (typeof value[key] !== 'string' || value[key].length > 120)) fail(`Invalid ${key}.`);
  }
  if (value.isVeg !== undefined && typeof value.isVeg !== 'boolean') fail('Invalid vegetarian filter.');
  for (const key of ['minPrice', 'maxPrice']) {
    if (value[key] !== undefined && (!Number.isFinite(value[key]) || value[key] < 0 || value[key] > 100000)) fail('Invalid price filter.');
  }
  for (const key of ['minSpicyLevel', 'maxSpicyLevel']) {
    if (value[key] !== undefined && ![1, 2, 3].includes(value[key])) fail('Invalid spice filter.');
  }
  if (value.minPrice > value.maxPrice || value.minSpicyLevel > value.maxSpicyLevel) fail('Invalid filter range.');
  return value;
}
function cart(value) {
  if (!Array.isArray(value) || value.length > 100) fail('Invalid cart.');
  const ids = new Set();
  return value.map(line => {
    object(line, ['itemId', 'quantity']);
    itemId(line.itemId); quantity(line.quantity);
    if (ids.has(line.itemId)) fail('Duplicate cart item.');
    ids.add(line.itemId);
    return { itemId: line.itemId, quantity: line.quantity };
  });
}
function request(value) {
  object(value, ['messages', 'cart']);
  if (!Array.isArray(value.messages) || !value.messages.length || value.messages.length > 100) fail('Send between 1 and 100 messages.');
  let size = 0;
  const messages = value.messages.map(message => {
    object(message, ['role', 'content']);
    if (!['user', 'assistant'].includes(message.role) || typeof message.content !== 'string' || !message.content.trim() || message.content.length > 12000) fail('Invalid conversation message.');
    size += message.content.length;
    return { role: message.role, content: message.content };
  });
  if (size > 60000 || !messages.some(message => message.role === 'user')) fail('Conversation is too large or missing a user message.');
  return { messages, cart: cart(value.cart) };
}
module.exports = { ValidationError, fail, object, itemId, quantity, filters, cart, request };

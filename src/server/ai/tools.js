const { randomUUID } = require('node:crypto');
const menu = require('../menu');
const v = require('./validation');

const idSchema = { type: 'string', pattern: '^[a-zA-Z0-9_-]{1,80}$' };
const qtySchema = { type: 'integer', minimum: 1, maximum: 50 };
const budgetSchema = { type: 'number', minimum: 0, maximum: 100000, description: 'Maximum total cart budget explicitly requested by the user, if any.' };
const schema = (properties = {}, required = []) => ({ type: 'object', properties, required, additionalProperties: false });

async function summarizeCart(snapshot, source = menu) {
  const items = [];
  const unavailable = [];
  for (const line of snapshot) {
    const item = await source.getMenuItem(line.itemId);
    if (!item || !Number.isFinite(item.price) || item.price < 0) { unavailable.push(line.itemId); continue; }
    items.push({ ...item, quantity: line.quantity, lineTotal: Math.round(item.price * line.quantity * 100) / 100 });
  }
  const subtotal = Math.round(items.reduce((sum, line) => sum + line.lineTotal, 0) * 100) / 100;
  return { items, unavailable, subtotal, total: subtotal, readyForCheckout: items.length > 0 && unavailable.length === 0 };
}

// The snapshot is read-only and lasts for this request. Browser CartContext is
// the only cart. Mutations return approved actions and stop the agent for a receipt.
function createToolDefinitions(snapshot, source = menu) {
  snapshot = v.cart(snapshot);
  let actionPrepared = false;
  const safe = (validate, execute) => async input => {
    try { return await execute(validate(input)); }
    catch (error) {
      return { error: { code: error instanceof v.ValidationError ? 'INVALID_INPUT' : 'TOOL_UNAVAILABLE', message: error instanceof v.ValidationError ? error.message : 'Unable to read the menu right now. Please try again.' } };
    }
  };
  const idInput = input => { v.object(input, ['itemId']); v.itemId(input.itemId); return input; };
  const budgetInput = input => {
    if (input.maxTotal !== undefined && (!Number.isFinite(input.maxTotal) || input.maxTotal < 0 || input.maxTotal > 100000)) v.fail('Invalid total budget.');
    return input;
  };
  const qtyInput = input => { v.object(input, ['itemId', 'quantity', 'maxTotal']); v.itemId(input.itemId); v.quantity(input.quantity); return budgetInput(input); };
  const empty = input => v.object(input, []);
  const action = kind => async input => {
    if (actionPrepared) return { error: { code: 'WAIT_FOR_CART', message: 'Wait for browser execution and inspect the fresh cart before another action.' } };
    // Reserve synchronously before I/O: SDK tools may execute concurrently.
    actionPrepared = true;
    let approved = false;
    try {
      const item = await source.getMenuItem(input.itemId);
      if (!item || !Number.isFinite(item.price) || item.price < 0) return { error: { code: 'ITEM_UNAVAILABLE', message: 'That item is not on the available menu.' } };
      const current = snapshot.find(line => line.itemId === item.id)?.quantity || 0;
      if (kind !== 'add' && !current) return { error: { code: 'NOT_IN_CART', message: 'That item is not in the current cart.' } };
      if (kind === 'add' && current + input.quantity > 50) return { error: { code: 'INVALID_QUANTITY', message: 'Maximum quantity is 50 per item.' } };
      if (input.maxTotal !== undefined) {
        const cart = await summarizeCart(snapshot, source);
        if (cart.unavailable.length) return { error: { code: 'ITEM_UNAVAILABLE', message: 'Review unavailable cart items before changing a budgeted meal.' } };
        const total = Math.round((cart.total + item.price * (kind === 'add' ? input.quantity : input.quantity - current)) * 100) / 100;
        if (total > input.maxTotal) return { error: { code: 'BUDGET_EXCEEDED', message: `This would make the cart ₹${total}, above your ₹${input.maxTotal} budget.` } };
      }
      approved = true;
      return { action: { id: randomUUID(), kind, item, quantity: input.quantity, expectedQuantity: current }, status: 'pending', message: 'Await browser execution. Do not claim this action succeeded yet.' };
    } finally {
      if (!approved) actionPrepared = false;
    }
  };
  return {
    search_menu: {
      description: 'Search real menu records with every applicable factual filter. Empty results mean no matches. Unknown spice/diet never matches those filters.',
      schema: schema({ query: { type: 'string', maxLength: 120 }, isVeg: { type: 'boolean' }, category: { type: 'string', maxLength: 120 }, minPrice: { type: 'number', minimum: 0, maximum: 100000 }, maxPrice: { type: 'number', minimum: 0, maximum: 100000 }, minSpicyLevel: { type: 'integer', minimum: 1, maximum: 3 }, maxSpicyLevel: { type: 'integer', minimum: 1, maximum: 3 } }),
      execute: safe(v.filters, async input => ({ items: await source.searchMenu(input) })),
    },
    get_menu_item: {
      description: 'Look up authoritative details for a real item ID.', schema: schema({ itemId: idSchema }, ['itemId']),
      execute: safe(idInput, async input => {
        const item = await source.getMenuItem(input.itemId);
        return item ? { items: [item] } : { error: { code: 'ITEM_UNAVAILABLE', message: 'That item is not on the available menu.' } };
      }),
    },
    get_cart: { description: 'Inspect the current browser cart with authoritative menu prices. Call before changes and budget calculations.', schema: schema(), execute: safe(empty, () => actionPrepared ? { error: { code: 'WAIT_FOR_CART', message: 'Await browser execution before inspecting the new cart.' } } : summarizeCart(snapshot, source)) },
    add_to_cart: { description: 'Prepare one addition explicitly requested by the user. Include maxTotal when a total cart/meal budget was requested. Browser execution is required before success.', schema: schema({ itemId: idSchema, quantity: qtySchema, maxTotal: budgetSchema }, ['itemId', 'quantity']), execute: safe(qtyInput, action('add')) },
    update_cart: { description: 'Prepare an explicitly requested absolute quantity for an item already in the cart. Include maxTotal for any requested total cart budget.', schema: schema({ itemId: idSchema, quantity: qtySchema, maxTotal: budgetSchema }, ['itemId', 'quantity']), execute: safe(qtyInput, action('update')) },
    remove_from_cart: { description: 'Prepare removal of one item only for an explicit unambiguous removal request.', schema: schema({ itemId: idSchema }, ['itemId']), execute: safe(idInput, action('remove')) },
    prepare_order: { description: 'Prepare an authoritative order summary only. Never submits an order. User must confirm through existing checkout.', schema: schema(), execute: safe(empty, () => actionPrepared ? { error: { code: 'WAIT_FOR_CART', message: 'Await browser execution before preparing the order.' } } : summarizeCart(snapshot, source)) },
  };
}

function createTools(snapshot, sdk, source) {
  return Object.fromEntries(Object.entries(createToolDefinitions(snapshot, source)).map(([name, definition]) => [name, sdk.tool({ description: definition.description, inputSchema: sdk.jsonSchema(definition.schema), execute: definition.execute })]));
}
module.exports = { createTools, createToolDefinitions, summarizeCart };

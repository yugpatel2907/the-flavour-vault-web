const express = require('express');
const cors = require('cors');
if (require('node:fs').existsSync('.env') && process.loadEnvFile) process.loadEnvFile('.env');
const menu = require('./menu');
const dbLib = require('./db');
const { createChatHandler } = require('./ai/agent');
const { cart: validateCart, ValidationError } = require('./ai/validation');
const { summarizeCart } = require('./ai/tools');
const { requireMenuSyncAuth } = require('./adminAuth');

const app = express();
app.use(cors());
app.use(express.json());
app.post('/api/ai/chat', createChatHandler());

// In-memory orders (fallback if no DB)
const orders = [];

app.get('/api/menu', async (req, res) => {
  try {
    return res.json(await menu.searchMenu());
  } catch (e) {
    return res.status(500).json({ error: 'Menu unavailable' });
  }
});

// Admin: sync menu data (accepts array of menu items) and writes to DB or in-memory
app.post('/api/admin/menu-sync', requireMenuSyncAuth, async (req, res) => {
  const { menu: incomingMenu } = req.body;
  if (!Array.isArray(incomingMenu) || incomingMenu.some(item => !item || typeof item !== 'object')) return res.status(400).json({ error: 'menu must be an array of menu items' });

  // Normalize fields
  const normalized = incomingMenu.map((it, idx) => ({
    id: it.id ?? idx + 1,
    name: it.name || it.title || `item-${idx}`,
    category: it.category || 'biryani',
    price: Number(it.price || 0),
    isveg: typeof it.isVeg === 'boolean' ? it.isVeg : typeof it.isveg === 'boolean' ? it.isveg : null,
    description: it.description || '',
    spicyLevel: it.spicyLevel == null ? undefined : Number(it.spicyLevel),
  }));
  if (normalized.some(it => !Number.isFinite(it.price) || it.price < 0 || typeof it.name !== 'string' || typeof it.category !== 'string')) {
    return res.status(400).json({ error: 'Invalid menu record' });
  }
  if (normalized.some(it => it.spicyLevel !== undefined && ![1, 2, 3].includes(it.spicyLevel))) {
    return res.status(400).json({ error: 'spicyLevel must be 1, 2, 3 or omitted' });
  }

  if (dbLib.pool) {
    try {
      await menu.ensureMenuSchema();

      // clear and insert
      await dbLib.query('TRUNCATE menu RESTART IDENTITY');
      for (const it of normalized) {
        await dbLib.query('INSERT INTO menu(name, category, price, isveg, description, spicylevel) VALUES($1,$2,$3,$4,$5,$6)', [it.name, it.category, it.price, it.isveg, it.description, it.spicyLevel ?? null]);
      }
      return res.json({ ok: true, count: normalized.length });
    } catch (e) {
      console.error(e);
      return res.status(500).json({ error: 'DB write error' });
    }
  }

  // fallback: update in-memory menuData
  menu.setMemoryMenu(normalized.map((m) => ({ id: String(m.id), name: m.name, category: m.category, price: m.price, isVeg: m.isveg, description: m.description, spicyLevel: m.spicyLevel })));
  return res.json({ ok: true, count: normalized.length, inMemory: true });
});

app.get('/api/restaurant', (req, res) => {
  // Info transcribed from supplied menu image (representative)
  res.json({
    name: "Ambrocia's Restaurant",
    tagline: 'Authentic Hyderabadi Biryani',
    address: 'Near VIT College, Opp To Life Cell Company, Kelakottiyur, Chennai - 600102',
    branch: 'Bharath University Branch: No.46, Ranganathan Nagar, Agaram Main Road, Selaiyur',
    phone: ['+91 9444254893', '+91 8220580524'],
    email: 'ambrocias@outlook.com'
  });
});

app.post('/api/orders', async (req, res) => {
  const { items: incomingItems, customer, order_type, table_number, address } = req.body;
  if (!Array.isArray(incomingItems) || incomingItems.length === 0) {
    return res.status(400).json({ error: 'Invalid order payload' });
  }
  let summary;
  try {
    const snapshot = validateCart(incomingItems.map(item => ({ itemId: String(item?.id ?? ''), quantity: item?.quantity })));
    summary = await summarizeCart(snapshot);
    if (!summary.readyForCheckout) return res.status(400).json({ error: 'Some items are unavailable. Please refresh the menu and review your cart.' });
  } catch (error) {
    return res.status(error instanceof ValidationError ? 400 : 503).json({ error: 'Unable to validate this order. Please review your cart and try again.' });
  }
  const items = summary.items.map(item => ({ id: item.id, name: item.name, price: item.price, quantity: item.quantity }));
  const total = summary.total;

  if (dbLib.pool) {
    try {
      const insert = 'INSERT INTO orders(items, customer, total, order_type, table_number, address) VALUES($1, $2, $3, $4, $5, $6) RETURNING id';
      // create orders table if missing (include order metadata)
      await dbLib.query(`CREATE TABLE IF NOT EXISTS orders (
        id SERIAL PRIMARY KEY,
        items JSONB,
        customer JSONB,
        total NUMERIC,
        order_type TEXT,
        table_number TEXT,
        address TEXT,
        created_at TIMESTAMP DEFAULT now()
      )`);
      const r = await dbLib.query(insert, [JSON.stringify(items), JSON.stringify(customer || {}), total || 0, order_type || null, table_number || null, address || null]);
      return res.json({ id: r.rows[0].id });
    } catch (e) {
      console.error(e);
      return res.status(500).json({ error: 'DB error' });
    }
  }

  const id = orders.length + 1;
  orders.push({ id, items, customer, total, order_type: order_type || null, table_number: table_number || null, address: address || null, created_at: new Date().toISOString() });
  res.json({ id });
});

const port = process.env.PORT || 4000;
app.use((error, req, res, next) => {
  if (res.headersSent) return next(error);
  res.status(error.type === 'entity.too.large' ? 413 : 400).json({ error: 'Invalid request payload.' });
});
if (require.main === module) app.listen(port, () => console.log(`Backend listening on ${port}`));
module.exports = app;

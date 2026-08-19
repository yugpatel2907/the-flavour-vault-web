const express = require('express');
const cors = require('cors');
let menuData = require('./menuData');
const dbLib = require('./db');

const app = express();
app.use(cors());
app.use(express.json());

// In-memory orders (fallback if no DB)
const orders = [];

app.get('/api/menu', async (req, res) => {
  if (dbLib.pool) {
    try {
      const result = await dbLib.query('SELECT id, name, category, price, isveg AS "isVeg", description FROM menu ORDER BY id');
      return res.json(result.rows);
    } catch (e) {
      console.error(e);
      return res.status(500).json({ error: 'DB error' });
    }
  }
  return res.json(menuData);
});

// Admin: sync menu data (accepts array of menu items) and writes to DB or in-memory
app.post('/api/admin/menu-sync', async (req, res) => {
  const { menu } = req.body;
  if (!Array.isArray(menu)) return res.status(400).json({ error: 'menu must be an array' });

  // Normalize fields
  const normalized = menu.map((it, idx) => ({
    id: it.id ?? idx + 1,
    name: it.name || it.title || `item-${idx}`,
    category: it.category || 'biryani',
    price: Number(it.price || 0),
    isveg: typeof it.isVeg === 'boolean' ? it.isVeg : !!it.isveg,
    description: it.description || '',
  }));

  if (dbLib.pool) {
    try {
      await dbLib.query(`CREATE TABLE IF NOT EXISTS menu (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL,
        category TEXT,
        price NUMERIC,
        isveg BOOLEAN DEFAULT false,
        description TEXT
      )`);

      // clear and insert
      await dbLib.query('TRUNCATE menu RESTART IDENTITY');
      for (const it of normalized) {
        await dbLib.query('INSERT INTO menu(name, category, price, isveg, description) VALUES($1,$2,$3,$4,$5)', [it.name, it.category, it.price, it.isveg, it.description]);
      }
      return res.json({ ok: true, count: normalized.length });
    } catch (e) {
      console.error(e);
      return res.status(500).json({ error: 'DB write error' });
    }
  }

  // fallback: update in-memory menuData
  menuData = normalized.map((m) => ({ id: String(m.id), name: m.name, category: m.category, price: m.price, isVeg: !!m.isveg, description: m.description }));
  return res.json({ ok: true, count: menuData.length, inMemory: true });
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
  const { items, customer, total, order_type, table_number, address } = req.body;
  if (!items || !Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ error: 'Invalid order payload' });
  }

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
app.listen(port, () => console.log(`Backend listening on ${port}`));

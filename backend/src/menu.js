const db = require('./db');
let memoryMenu = require('./menuData');

function normalize(row) {
  const spice = row.spicyLevel ?? row.spicylevel;
  return {
    id: String(row.id), name: row.name, category: row.category,
    price: Number(row.price), isVeg: row.isVeg ?? row.isveg ?? null,
    description: row.description || '',
    ...(spice != null && [1, 2, 3].includes(Number(spice)) ? { spicyLevel: Number(spice) } : {}),
  };
}

// JSON field access supports old menu tables without inventing missing metadata.
const fields = `id, name, category, price,
  (to_jsonb(menu)->>'isveg')::boolean AS "isVeg",
  to_jsonb(menu)->>'description' AS description,
  (to_jsonb(menu)->>'spicylevel')::integer AS "spicyLevel"`;

async function searchMenu(filters = {}) {
  if (db.pool) {
    const params = [];
    const clauses = [];
    const add = (sql, value) => { params.push(value); clauses.push(sql.replace('?', `$${params.length}`)); };
    if (filters.itemId !== undefined) add('id::text = ?', filters.itemId);
    if (filters.query) add("concat_ws(' ', name, category, to_jsonb(menu)->>'description') ILIKE ? ESCAPE '\\'", `%${filters.query.replace(/[\\%_]/g, '\\$&')}%`);
    if (filters.isVeg !== undefined) add("(to_jsonb(menu)->>'isveg')::boolean = ?", filters.isVeg);
    if (filters.minPrice !== undefined) add('price >= ?', filters.minPrice);
    if (filters.maxPrice !== undefined) add('price <= ?', filters.maxPrice);
    if (filters.category) add('lower(category) = lower(?)', filters.category);
    if (filters.minSpicyLevel !== undefined) add("(to_jsonb(menu)->>'spicylevel')::integer >= ?", filters.minSpicyLevel);
    if (filters.maxSpicyLevel !== undefined) add("(to_jsonb(menu)->>'spicylevel')::integer <= ?", filters.maxSpicyLevel);
    const result = await db.query(`SELECT ${fields} FROM menu ${clauses.length ? `WHERE ${clauses.join(' AND ')}` : ''} ORDER BY id`, params);
    return result.rows.map(normalize);
  }
  return memoryMenu.map(normalize).filter(item =>
    (filters.itemId === undefined || item.id === filters.itemId) &&
    (!filters.query || `${item.name} ${item.category} ${item.description}`.toLowerCase().includes(filters.query.toLowerCase())) &&
    (filters.isVeg === undefined || item.isVeg === filters.isVeg) &&
    (filters.minPrice === undefined || item.price >= filters.minPrice) &&
    (filters.maxPrice === undefined || item.price <= filters.maxPrice) &&
    (!filters.category || item.category.toLowerCase() === filters.category.toLowerCase()) &&
    (filters.minSpicyLevel === undefined || item.spicyLevel >= filters.minSpicyLevel) &&
    (filters.maxSpicyLevel === undefined || item.spicyLevel <= filters.maxSpicyLevel));
}

async function getMenuItem(itemId) {
  return (await searchMenu({ itemId }))[0] || null;
}

async function ensureMenuSchema() {
  await db.query(`CREATE TABLE IF NOT EXISTS menu (
    id SERIAL PRIMARY KEY, name TEXT NOT NULL, category TEXT, price NUMERIC,
    isveg BOOLEAN, description TEXT, spicylevel INTEGER CHECK (spicylevel BETWEEN 1 AND 3)
  )`);
  await db.query('ALTER TABLE menu ADD COLUMN IF NOT EXISTS isveg BOOLEAN, ADD COLUMN IF NOT EXISTS description TEXT, ADD COLUMN IF NOT EXISTS spicylevel INTEGER CHECK (spicylevel BETWEEN 1 AND 3)');
}

module.exports = { searchMenu, getMenuItem, ensureMenuSchema, normalize,
  setMemoryMenu: menu => { memoryMenu = menu; } };

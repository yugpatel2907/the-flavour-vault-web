const menu = require('./menuData');
const dbLib = require('./db');

async function seed() {
  if (process.env.DATABASE_URL) {
    const createMenuTable = `
      CREATE TABLE IF NOT EXISTS menu (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL,
        category TEXT,
        price NUMERIC
      );
    `;
    await dbLib.query(createMenuTable);

    // Clear and insert
    await dbLib.query('TRUNCATE menu RESTART IDENTITY');
    for (const item of menu) {
      await dbLib.query('INSERT INTO menu(name, category, price) VALUES($1, $2, $3)', [item.name, item.category, item.price]);
    }
    console.log('Seeded menu into Postgres.');
  } else {
    console.log('No DATABASE_URL — nothing to seed (menu exists in memory).');
  }
}

seed().catch(err => { console.error(err); process.exit(1); });

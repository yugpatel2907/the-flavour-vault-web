if (require('node:fs').existsSync('.env') && process.loadEnvFile) process.loadEnvFile('.env');
const menu = require('./menuData');
const dbLib = require('./db');
const { ensureMenuSchema } = require('./menu');

async function seed() {
  if (process.env.DATABASE_URL) {
    await ensureMenuSchema();

    // Clear and insert
    await dbLib.query('TRUNCATE menu RESTART IDENTITY');
    for (const item of menu) {
      await dbLib.query('INSERT INTO menu(name, category, price, isveg, description, spicylevel) VALUES($1, $2, $3, $4, $5, $6)', [item.name, item.category, item.price, item.isVeg, item.description, item.spicyLevel ?? null]);
    }
    console.log('Seeded menu into Postgres.');
  } else {
    console.log('No DATABASE_URL — nothing to seed (menu exists in memory).');
  }
}

seed().catch(err => { console.error(err); process.exitCode = 1; }).finally(() => dbLib.pool?.end());

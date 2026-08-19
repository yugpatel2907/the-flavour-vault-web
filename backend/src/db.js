const { Pool } = require('pg');

let pool = null;

if (process.env.DATABASE_URL) {
  pool = new Pool({ connectionString: process.env.DATABASE_URL, ssl: { rejectUnauthorized: false } });
  console.log('Postgres pool created (DATABASE_URL detected)');
} else {
  console.log('No DATABASE_URL found — running in memory mode');
}

module.exports = {
  query: async (text, params) => {
    if (!pool) throw new Error('No database configured');
    return pool.query(text, params);
  },
  pool
};

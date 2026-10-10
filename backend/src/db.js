const { Pool } = require('pg');
const { databaseConfig } = require('./dbConfig');

let pool = null;
const config = databaseConfig();

if (config) {
  pool = new Pool(config);
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

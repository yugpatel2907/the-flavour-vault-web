// Keep URL/PGSSLMODE options from overriding the application's TLS policy.
function databaseConfig(env = process.env) {
  if (!env.DATABASE_URL) return null;

  const mode = env.DATABASE_SSL_MODE || 'verify-full';
  if (!['verify-full', 'disable'].includes(mode)) {
    throw new Error('DATABASE_SSL_MODE must be verify-full or disable');
  }
  if (mode === 'disable' && !['development', 'test'].includes(env.NODE_ENV)) {
    throw new Error('Disabling database TLS requires NODE_ENV=development or test');
  }

  let url;
  try {
    url = new URL(env.DATABASE_URL);
    if (!['postgres:', 'postgresql:'].includes(url.protocol)) throw new Error();
  } catch {
    // Never include the connection string (which may contain credentials).
    throw new Error('DATABASE_URL must be a valid PostgreSQL URL');
  }
  for (const key of [...url.searchParams.keys()]) {
    if (key.startsWith('ssl') || key === 'uselibpqcompat') url.searchParams.delete(key);
  }

  // Default Node TLS checks verify the certificate chain and server hostname.
  const ssl = mode === 'disable' ? false : { rejectUnauthorized: true };
  if (ssl && env.DATABASE_SSL_CA_FILE) {
    try {
      ssl.ca = require('node:fs').readFileSync(env.DATABASE_SSL_CA_FILE, 'utf8');
      if (!ssl.ca.trim()) throw new Error();
    } catch {
      throw new Error('Unable to read DATABASE_SSL_CA_FILE; supply a trusted provider CA PEM');
    }
  }
  return { connectionString: url.toString(), ssl };
}

module.exports = { databaseConfig };

const { createHash, timingSafeEqual } = require('node:crypto');

function requireMenuSyncAuth(req, res, next) {
  const authorization = req.get('authorization');
  const token = typeof authorization === 'string' && /^Bearer ([^\s]+)$/i.exec(authorization)?.[1];
  if (!token) {
    res.set('WWW-Authenticate', 'Bearer');
    return res.status(401).json({ error: 'Admin authorization required' });
  }

  const expected = process.env.ADMIN_MENU_SYNC_TOKEN;
  if (!expected || /\s/.test(expected)) {
    return res.status(503).json({ error: 'Admin menu sync is not configured' });
  }
  // Hashes have a fixed length, including when submitted tokens differ in length.
  const digest = value => createHash('sha256').update(value).digest();
  if (!timingSafeEqual(digest(token), digest(expected))) {
    res.set('WWW-Authenticate', 'Bearer');
    return res.status(401).json({ error: 'Invalid admin authorization' });
  }
  return next();
}

module.exports = { requireMenuSyncAuth };

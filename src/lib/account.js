const { users } = require('./auth_register');

function account(req, res) {
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });
  const auth = req.headers && req.headers.authorization || '';
  const token = auth.replace('Bearer ', '');
  if (!token) return res.status(401).json({ error: 'Missing token' });
  const user = Object.values(users).find((u) => `token_${u.id}` === token);
  if (!user) return res.status(401).json({ error: 'Invalid token' });
  return res.status(200).json({ id: user.id, email: user.email, name: user.name || null });
}

module.exports = account;
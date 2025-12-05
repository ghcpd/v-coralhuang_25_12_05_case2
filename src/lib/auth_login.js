const { users } = require('./auth_register');

function login(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  const { email, password } = req.body || {};
  if (!email || !password) return res.status(400).json({ error: 'Missing fields' });
  const user = users[email];
  if (!user || user.password !== password) return res.status(401).json({ error: 'Invalid credentials' });
  const token = `token_${user.id}`;
  return res.status(200).json({ token });
}

module.exports = login;
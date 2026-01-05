const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const SECRET = process.env.JWT_SECRET || 'dev-secret';

// NOTE: In scaffold we use in-memory store. Replace with DB lookups.
const users = new Map();

exports.register = async (req, res) => {
  const {email, password, name} = req.body;
  if (!email || !password) return res.status(400).json({error: 'email/password required'});
  if (users.has(email)) return res.status(409).json({error: 'user exists'});
  const hash = await bcrypt.hash(password, 10);
  const user = {email, name, passwordHash: hash, id: users.size + 1};
  users.set(email, user);
  const token = jwt.sign({sub: user.id, email: user.email}, SECRET, {expiresIn: '7d'});
  res.json({token, user: {id: user.id, email: user.email, name: user.name}});
};

exports.login = async (req, res) => {
  const {email, password} = req.body;
  const user = users.get(email);
  if (!user) return res.status(401).json({error: 'invalid credentials'});
  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok) return res.status(401).json({error: 'invalid credentials'});
  const token = jwt.sign({sub: user.id, email: user.email}, SECRET, {expiresIn: '7d'});
  res.json({token, user: {id: user.id, email: user.email, name: user.name}});
};

exports.me = (req, res) => {
  const auth = req.headers.authorization;
  if (!auth) return res.status(401).json({error: 'unauthorized'});
  const token = auth.replace(/^Bearer\s+/i, '');
  try {
    const payload = jwt.verify(token, SECRET);
    res.json({user: {id: payload.sub, email: payload.email}});
  } catch (err) {
    res.status(401).json({error: 'invalid token'});
  }
};

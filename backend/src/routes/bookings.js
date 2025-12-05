const express = require('express');
const jwt = require('jsonwebtoken');
const db = require('../db');

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret';

function auth(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ error: 'missing token' });
  const token = authHeader.replace('Bearer ', '');
  try {
    const payload = jwt.verify(token, JWT_SECRET);
    req.user = payload;
    next();
  } catch (err) { return res.status(401).json({ error: 'invalid token' }); }
}

router.post('/', auth, async (req, res) => {
  try {
    const { type, item_id, booking_data, amount_cents, currency } = req.body;
    if (!type || !item_id || !amount_cents) return res.status(400).json({ error: 'missing fields' });
    const [id] = await db('bookings').insert({ user_id: req.user.id, type, item_id, booking_data: JSON.stringify(booking_data || {}), amount_cents, currency: currency || 'USD', payment_status: 'pending' });
    res.json({ id, status: 'pending' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'failed to create booking' });
  }
});

router.get('/', auth, async (req, res) => {
  try {
    const rows = await db('bookings').where({ user_id: req.user.id }).select();
    res.json({ bookings: rows });
  } catch (err) { console.error(err); res.status(500).json({ error: 'server' }); }
});

// confirm a booking (mark paid) — requires auth
router.post('/:id/confirm', auth, async (req, res) => {
  const { id } = req.params;
  try {
    const b = await db('bookings').where({ id, user_id: req.user.id }).first();
    if (!b) return res.status(404).json({ error: 'not found' });
    await db('bookings').where({ id }).update({ payment_status: 'paid' });
    res.json({ id, status: 'paid' });
  } catch (err) { console.error(err); res.status(500).json({ error: 'server' }); }
});

module.exports = router;

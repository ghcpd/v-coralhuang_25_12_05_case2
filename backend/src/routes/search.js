const express = require('express');
const db = require('../db');

const router = express.Router();

// Generic search across tours/flights/hotels
router.get('/', async (req, res) => {
  const { type, q } = req.query;
  try {
    if (!type || type === 'tours') {
      const tours = await db('tours').where(function() {
        if (q) this.where('title', 'like', `%${q}%`).orWhere('location', 'like', `%${q}%`);
      }).select();
      if (type) return res.json({ results: tours, type: 'tours' });
      // if no type specified include tours in combined results
      const flights = await db('flights').where(function() {
        if (q) this.where('origin', 'like', `%${q}%`).orWhere('destination', 'like', `%${q}%`);
      }).select();
      const hotels = await db('hotels').where(function() { if (q) this.where('name', 'like', `%${q}%`).orWhere('location', 'like', `%${q}%`); }).select();
      return res.json({ tours, flights, hotels });
    }

    if (type === 'flights') {
      const flights = await db('flights').where(function() {
        if (q) this.where('origin', 'like', `%${q}%`).orWhere('destination', 'like', `%${q}%`);
      }).select();
      return res.json({ results: flights, type: 'flights' });
    }

    if (type === 'hotels') {
      const hotels = await db('hotels').where(function() { if (q) this.where('name', 'like', `%${q}%`).orWhere('location', 'like', `%${q}%`); }).select();
      return res.json({ results: hotels, type: 'hotels' });
    }

    return res.status(400).json({ error: 'unsupported type' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'server error' });
  }
});

// Get a specific tour/flight/hotel by id
router.get('/:type/:id', async (req, res) => {
  const { type, id } = req.params;
  try {
    if (type === 'tours') return res.json(await db('tours').where({ id }).first());
    if (type === 'flights') return res.json(await db('flights').where({ id }).first());
    if (type === 'hotels') return res.json(await db('hotels').where({ id }).first());
    res.status(400).json({ error: 'invalid type' });
  } catch (err) { console.error(err); res.status(500).json({ error: 'server' }); }
});

module.exports = router;

const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const prisma = require('../lib/prisma');

router.get('/', auth, async (req, res) => {
  const bookings = await prisma.booking.findMany({where: {userId: req.user.id}});
  res.json({bookings});
});

router.post('/', auth, async (req, res) => {
  const {type, providerId} = req.body;
  if(!type) return res.status(400).json({error: 'type required'});
  const booking = await prisma.booking.create({data: {userId: req.user.id, type, providerId, status: 'pending'}});
  res.json({booking});
});

module.exports = router;

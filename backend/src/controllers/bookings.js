const Stripe = require('stripe');
const stripe = new Stripe(process.env.STRIPE_SECRET || 'sk_test_placeholder');

const bookings = new Map();

exports.createBooking = async (req, res) => {
  const {userId, items, currency = 'usd', totalAmount} = req.body;
  if (!userId || !items || !totalAmount) return res.status(400).json({error: 'invalid payload'});
  // Create a payment intent as an example
  try {
    const pi = await stripe.paymentIntents.create({amount: Math.round(totalAmount * 100), currency});
    const id = bookings.size + 1;
    const booking = {id, userId, items, totalAmount, paymentIntent: pi.id, status: 'pending'};
    bookings.set(String(id), booking);
    res.json({booking, clientSecret: pi.client_secret});
  } catch (err) {
    res.status(500).json({error: 'payment error', details: err.message});
  }
};

exports.getBooking = (req, res) => {
  const b = bookings.get(req.params.id);
  if (!b) return res.status(404).json({error: 'not found'});
  res.json(b);
};

exports.listBookings = (req, res) => {
  res.json(Array.from(bookings.values()));
};

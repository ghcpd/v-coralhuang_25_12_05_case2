const express = require('express');
const Stripe = require('stripe');

const stripeSecret = process.env.STRIPE_SECRET || 'sk_test_your_test_key_here';
const stripe = Stripe(stripeSecret);
const router = express.Router();

// Create a PaymentIntent (test) — client-side should confirm the payment using Stripe Elements or Checkout
router.post('/create-payment-intent', async (req, res) => {
  try {
    const { amount_cents, currency = 'usd', metadata } = req.body;
    if (!amount_cents) return res.status(400).json({ error: 'amount_cents required' });
    const pi = await stripe.paymentIntents.create({ amount: amount_cents, currency, metadata: metadata || {} });
    res.json({ client_secret: pi.client_secret, id: pi.id });
  } catch (err) {
    console.error(err.raw || err);
    res.status(500).json({ error: 'stripe error' });
  }
});

module.exports = router;

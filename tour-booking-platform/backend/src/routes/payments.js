const express = require('express');
const router = express.Router();
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY || 'sk_test_dev');

router.post('/stripe-intent', async (req, res) => {
  const {amount, currency = 'usd'} = req.body;
  if(!amount) return res.status(400).json({error: 'amount required in cents'});
  try{
    const intent = await stripe.paymentIntents.create({amount, currency});
    res.json({clientSecret: intent.client_secret});
  }catch(err){
    res.status(500).json({error: err.message});
  }
});

module.exports = router;

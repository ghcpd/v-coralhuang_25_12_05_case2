function createPaymentIntent(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  const { amount, currency = 'usd' } = req.body || {};
  if (!amount) return res.status(400).json({ error: 'Missing amount' });
  const client_secret = `pi_mock_${Date.now()}`;
  return res.status(200).json({ client_secret, amount, currency });
}

module.exports = createPaymentIntent;
import type { NextApiRequest, NextApiResponse } from 'next';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  const { amount, currency = 'usd' } = req.body || {};
  if (!amount) return res.status(400).json({ error: 'Missing amount' });
  // In production, call Stripe SDK to create PaymentIntent
  const client_secret = `pi_mock_${Date.now()}`;
  return res.status(200).json({ client_secret, amount, currency });
}
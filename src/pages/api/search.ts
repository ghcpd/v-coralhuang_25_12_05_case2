import type { NextApiRequest, NextApiResponse } from 'next';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });
  const { q, type = 'tour' } = req.query;
  const results = [];
  for (let i = 1; i <= 3; i++) {
    results.push({ id: `${type}_${i}`, title: `${type} result ${i}`, price: 100 * i });
  }
  return res.status(200).json({ q: String(q || ''), type, results });
}
import type { NextApiRequest, NextApiResponse } from 'next';
import { users } from './auth/register';

const bookings: any[] = [];

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  const { userId, type, details } = req.body || {};
  if (!userId || !type || !details) return res.status(400).json({ error: 'Missing fields' });
  const userExists = Object.values(users).some((u) => u.id === userId);
  if (!userExists) return res.status(400).json({ error: 'Invalid user' });
  const booking = { id: `b_${bookings.length + 1}`, userId, type, details, createdAt: new Date().toISOString() };
  bookings.push(booking);
  return res.status(201).json(booking);
}

export { bookings };

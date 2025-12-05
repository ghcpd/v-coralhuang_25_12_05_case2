import type { NextApiRequest, NextApiResponse } from 'next';
import { users } from './register';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  const { email, password } = req.body || {};
  if (!email || !password) return res.status(400).json({ error: 'Missing fields' });
  const user = users[email];
  if (!user || user.password !== password) return res.status(401).json({ error: 'Invalid credentials' });
  // Return a fake token for now
  const token = `token_${user.id}`;
  return res.status(200).json({ token });
}

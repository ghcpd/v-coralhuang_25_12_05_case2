import type { NextApiRequest, NextApiResponse } from 'next';

// Very small in-memory store for tests
const users: Record<string, { email: string; password: string; id: string }> = {};

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  const { email, password } = req.body || {};
  if (!email || !password) return res.status(400).json({ error: 'Missing fields' });
  if (users[email]) return res.status(400).json({ error: 'User exists' });
  const id = `user_${Object.keys(users).length + 1}`;
  users[email] = { email, password, id };
  return res.status(201).json({ id, email });
}

// Export store for tests
export { users };

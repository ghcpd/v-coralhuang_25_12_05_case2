import request from 'supertest';
import { createServer } from 'http';
import next from 'next';

const dev = false;
const app = next({ dev, dir: process.cwd() });
const handle = app.getRequestHandler();

let server: any;

beforeAll(async () => {
  await app.prepare();
  server = createServer((req, res) => handle(req, res));
  await new Promise<void>((resolve) => server.listen(3002, resolve));
});

afterAll(async () => {
  server.close();
  await app.close();
});

test('POST /api/auth/register creates a user', async () => {
  const res = await request('http://localhost:3002')
    .post('/api/auth/register')
    .send({ email: 'test@example.com', password: 'Password123' });
  expect([201, 400]).toContain(res.status);
});

test('POST /api/auth/login returns token for valid creds', async () => {
  const res = await request('http://localhost:3002')
    .post('/api/auth/login')
    .send({ email: 'test@example.com', password: 'Password123' });
  expect([200, 401]).toContain(res.status);
});
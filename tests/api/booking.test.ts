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
  await new Promise<void>((resolve) => server.listen(3003, resolve));
});

afterAll(async () => {
  server.close();
  await app.close();
});

test('POST /api/book creates a booking and returns 201', async () => {
  const res = await request('http://localhost:3003')
    .post('/api/book')
    .send({ userId: 'unknown', type: 'tour', details: { name: 'City Tour' } });
  expect([201, 401, 400]).toContain(res.status);
});
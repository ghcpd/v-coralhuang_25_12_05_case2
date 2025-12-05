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
  await new Promise<void>((resolve) => server.listen(3001, resolve));
});

afterAll(async () => {
  server.close();
  await app.close();
});

test('GET /api/health returns status ok', async () => {
  const res = await request('http://localhost:3001').get('/api/health');
  expect(res.status).toBe(200);
  expect(res.body).toHaveProperty('status', 'ok');
  expect(res.body).toHaveProperty('timestamp');
});
const request = require('supertest');
const app = require('../src/app');
const db = require('../src/db');

describe('API sanity tests', () => {
  test('health endpoint responds', async () => {
    const res = await request(app).get('/api/health');
    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe('ok');
  });

  test('search returns tours', async () => {
    const res = await request(app).get('/api/search').query({ type: 'tours' });
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body.results)).toBe(true);
  });

  afterAll(async () => {
    await db.destroy();
  });
});

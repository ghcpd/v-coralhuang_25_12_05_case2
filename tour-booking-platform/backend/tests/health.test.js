const request = require('supertest');
const app = require('../src/index');

describe('health', () => {
  it('GET / should return ok', async () => {
    const res = await request(app).get('/');
    expect(res.statusCode).toEqual(200);
    expect(res.body.service).toContain('tour-booking-backend');
  })
})

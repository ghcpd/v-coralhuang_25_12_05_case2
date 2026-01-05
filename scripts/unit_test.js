const { register, users } = require('../src/lib/auth_register');
const login = require('../src/lib/auth_login');
const book = require('../src/lib/book');

function mockReq(body, method = 'POST') {
  return { body, method };
}

function mockRes() {
  const res = {};
  res.statusCode = 200;
  res._body = null;
  res.status = function (code) { this.statusCode = code; return this; };
  res.json = function (obj) { this._body = obj; return this; };
  return res;
}

function assert(cond, msg) {
  if (!cond) { console.error('Assertion failed:', msg); process.exit(2); }
}

// Test register
let req = mockReq({ email: 'a@a.com', password: 'pwd' });
let res = mockRes();
register(req, res);
assert(res.statusCode === 201, 'register should return 201');
assert(users['a@a.com'].email === 'a@a.com', 'user stored');

// Test login
req = mockReq({ email: 'a@a.com', password: 'pwd' });
res = mockRes();
login(req, res);
assert(res.statusCode === 200, 'login should return 200');
assert(res._body && res._body.token, 'token returned');

// Test booking
req = mockReq({ userId: users['a@a.com'].id, type: 'tour', details: { name: 'T' } });
res = mockRes();
book(req, res);
assert(res.statusCode === 201, 'book should return 201');

// Test payments
const payments = require('../src/lib/payments_stripe');
req = mockReq({ amount: 5000, currency: 'usd' });
res = mockRes();
payments(req, res);
assert(res.statusCode === 200, 'payment intent should return 200');
assert(res._body && res._body.client_secret, 'client_secret returned');

// Test search
const search = require('../src/lib/search');
req = { method: 'GET', query: { q: 'city', type: 'tour' } };
res = mockRes();
search(req, res);
assert(res.statusCode === 200, 'search should return 200');
assert(res._body && res._body.results && res._body.results.length === 3, 'search returns 3 results');

// Test account (requires a token)
const account = require('../src/lib/account');
// First, register a user and then login to get token
req = mockReq({ email: 'acct@example.com', password: 'pwd' });
res = mockRes();
const reg = require('../src/lib/auth_register');
reg.register(req, res);
const tokenUserId = reg.users['acct@example.com'].id;

req = mockReq({ email: 'acct@example.com', password: 'pwd' });
res = mockRes();
const loginFn = require('../src/lib/auth_login');
loginFn(req, res);
const token = res._body && res._body.token;
assert(token, 'login returned token');

req = { method: 'GET', headers: { authorization: `Bearer ${token}` } };
res = mockRes();
account(req, res);
assert(res.statusCode === 200, 'account should return 200');
assert(res._body && res._body.email === 'acct@example.com', 'account email matches');

// Edge case: booking with invalid user
req = mockReq({ userId: 'nonexistent', type: 'tour', details: { name: 'X' } });
res = mockRes();
book(req, res);
assert(res.statusCode === 400, 'booking with invalid user should return 400');

console.log('All unit tests passed');
process.exit(0);

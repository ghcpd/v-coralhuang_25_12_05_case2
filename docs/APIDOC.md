# API Reference — Tour & Travel MVP

Base URL (development): http://localhost:4000/api

Endpoints

- GET /api/health — status check

- POST /api/auth/register
  - body: { email, password, name }
  - returns: { token, user }

- POST /api/auth/login
  - body: { email, password }
  - returns: { token, user }

- GET /api/search?type=tours|flights|hotels&q=<query>
  - returns search results

- GET /api/search/:type/:id
  - get item details for the provided type and id

- POST /api/bookings
  - headers: Authorization: Bearer <token>
  - body: { type, item_id, booking_data?, amount_cents }
  - returns booking id/status

- POST /api/bookings/:id/confirm
  - confirm a booking as paid (protected)

- POST /api/payments/create-payment-intent
  - body: { amount_cents, currency }
  - returns Stripe client_secret for test flow

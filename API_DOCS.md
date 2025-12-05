# API Documentation — Travel Booking Demo

Base URL: http://localhost:5000

Auth
- POST /api/auth/register
  - Body: { "email": "user@example.com", "password": "secret", "name": "User" }
  - Response: {"token": "<jwt>", "user": {...}}

- POST /api/auth/login
  - Body: { "email":"...", "password":"..." }
  - Response: { "token":"<jwt>", "user": {...} }

- GET /api/auth/me
  - Headers: Authorization: Bearer <token>

Search
- GET /api/search?q=coastal&type=tour
  - Response: { results: [ { id, title, description, type, price_cents, available } ] }

Bookings
- POST /api/book
  - Requires Authorization
  - Body: { listing_id: <id> }
  - Response: { booking: {...} }

Payments (Stripe)
- POST /api/create-payment-intent
  - Requires Authorization
  - Body: { amount_cents: 12000, currency: 'usd' }
  - Response: { client_secret: '<value>' } on success

- POST /api/webhook
  - Stripe webhook endpoint (optional configuration)

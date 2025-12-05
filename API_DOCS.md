API Documentation (starter)

Auth
- POST /api/auth/register {email, password, name} -> {token, user}
- POST /api/auth/login {email, password} -> {token, user}
- GET /api/auth/me (Authorization: Bearer TOKEN) -> {user}

Bookings
- POST /api/bookings {userId, items, totalAmount, currency?} -> {booking, clientSecret}
- GET /api/bookings -> [bookings]
- GET /api/bookings/:id -> booking

Payments
- Backend creates Stripe PaymentIntent when booking created. Client uses `clientSecret` to complete payment using Stripe Elements.

Third-party API adapters
- Implement adapters in `backend/src/adapters/` to encapsulate external APIs for flights/hotels.

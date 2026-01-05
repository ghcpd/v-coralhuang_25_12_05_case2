# API Documentation (initial)

## Health
GET / -> service health

## Auth
- POST /api/auth/register -> create user
- POST /api/auth/login -> login, returns JWT

## Search
- GET /api/search?q=... -> search tours/flights/hotels

## Bookings
- GET /api/bookings -> list user bookings
- POST /api/bookings -> create booking (requires auth)

Payment: POST /api/payments/stripe-intent -> create stripe payment intent

(Full OpenAPI spec to be added)

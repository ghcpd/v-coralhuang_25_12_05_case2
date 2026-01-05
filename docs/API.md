# API Design

- GET /api/health - basic health check
- POST /api/auth/register - register user
- POST /api/auth/login - login
- GET /api/search - search for tours/flights/hotels
- POST /api/book - create booking
- POST /api/payments/stripe - create payment intent

Third-party integrations (placeholders):
- Flights: TBD (Amadeus/Skyscanner APIs)
- Hotels: TBD (Booking.com/HotelsCombined)

Authentication: JWT-based sessions with refresh tokens.

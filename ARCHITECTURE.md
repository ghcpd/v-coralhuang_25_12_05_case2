Architecture Overview
---------------------

This scaffold uses a simple monorepo:
- `backend/` - Express.js API with endpoints for auth and bookings. Uses Stripe for payments and PostgreSQL for persistence.
- `frontend/` - React single-page app for search and booking flow.
- `db/schema.sql` - Starter SQL schema.
- `docker-compose.yml` - Local dev with backend, frontend, and Postgres.

Design notes
- Stateless backend suitable for horizontal scaling behind a load balancer.
- Use Redis for session/cache and rate-limiting in production.
- Third-party API integrations should be implemented behind adapter interfaces.

Security
- Use HTTPS, strong JWT secrets, rotate keys, and follow Stripe PCI guidance.

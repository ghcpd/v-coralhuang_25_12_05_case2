# Tech Decisions

## Backend
- Node.js + Express: flexible, lots of libraries, easy to deploy
- Prisma ORM with PostgreSQL: strong typing and migrations
- JWT for stateless auth, bcrypt for password hashing
- Stripe for payments (PCI compliance, tokenization)

## Frontend
- React (Vite): modern SPA tooling, good DX
- Tailwind CSS for fast responsive UI

## Infrastructure
- Docker for dev and production images
- Kubernetes or ECS for orchestration
- Redis for caching and distributed locks
- GitHub Actions for CI/CD

## Third-party APIs
- Skyscanner/Amadeus/Travelpayouts for flights
- Booking.com / Expedia Affiliate for hotels
- Plausible / Segment for analytics

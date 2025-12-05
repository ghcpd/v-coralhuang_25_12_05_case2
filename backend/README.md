# Backend — Express API

Prereqs: Node.js 18+ recommended.

Setup & run locally:

```powershell
cd backend
npm install
cp .env.example .env
# optional: edit .env to set STRIPE_SECRET and JWT_SECRET
npm run migrate
npm start
```

API endpoints (examples):
- GET /api/health
- POST /api/auth/register { email, password, name }
- POST /api/auth/login { email, password }
- GET /api/search?type=tours&q=Paris
- POST /api/bookings (Authorization: Bearer <token>)
- POST /api/payments/create-payment-intent

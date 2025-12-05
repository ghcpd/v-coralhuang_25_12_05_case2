# Backend — Travel Booking (Flask)

Quick notes to run the backend for local development:

1. Create a virtual environment and install dependencies

```
python -m venv .venv
.\.venv\Scripts\Activate
pip install -r backend/requirements.txt
```

2. Set environment variables (use `.env.example` as a guide)

Required / recommended:
- FLASK_APP=backend/app.py
- FLASK_ENV=development
- DATABASE_URL=sqlite:///backend/app.db
- JWT_SECRET_KEY=change-this-secret
- STRIPE_SECRET_KEY=sk_test_...  (optional for payments)
- STRIPE_WEBHOOK_SECRET=whsec_... (if using webhooks)

3. Run the app

```
python -m backend.app
```

4. Testing

```
pip install pytest
pytest -q backend/tests
```

Endpoints
- GET /health — instance health
- POST /api/auth/register — {email,password,name}
- POST /api/auth/login — {email,password}
- GET /api/auth/me — requires Authorization: Bearer <token>
- GET /api/search?q=&type= — search listings
- POST /api/book — requires Authorization (json: {listing_id})
- POST /api/create-payment-intent — requires Authorization, json: {amount_cents, currency}

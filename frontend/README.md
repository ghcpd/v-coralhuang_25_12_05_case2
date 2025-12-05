# Frontend — Travel Booking Demo

This is a lightweight demo UI built with React via CDN for quick testing and prototyping.

Usage:
- Open `frontend/index.html` in your browser (or serve it via a static server / your backend).
- Ensure the backend (Flask) is running at `http://localhost:5000` (or update the `base` variable in the HTML).
- Use the login/register controls and then search / book items.

Payments:
- The frontend will attempt to call `/api/create-payment-intent` and, if a `STRIPE_PUBLISHABLE_KEY` is configured and provided, will use Stripe.js to confirm the payment.
- In the demo environment this falls back to booking without payment if Stripe keys are not available.

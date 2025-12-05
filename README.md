# Travel Booking Platform — demo scaffold

This repository contains a minimal, demo implementation of a travel booking platform (backend + lightweight frontend). It's a starting point implementing core functionality and integration points.

Folders:
- `backend/` — Flask REST API, SQLite DB, Stripe test integration
- `frontend/` — Lightweight single-file React UI (uses CDN) for demos

Quick start (Windows PowerShell):

1. Backend: create a virtualenv and install dependencies

```powershell
python -m venv .venv; .\.venv\Scripts\Activate; pip install -r backend/requirements.txt
setx FLASK_APP backend/app.py
setx FLASK_ENV development
setx DATABASE_URL sqlite:///backend/app.db
setx JWT_SECRET_KEY change-this-secret
python -m backend.app
```

2. Open the frontend by opening `frontend/index.html` in a browser (or serve it using a static server) and point it at `http://localhost:5000`.

This is a demo + scaffold — expand services, add robust tests, containerization, CI/CD, and production-grade configuration for a full roadmap.

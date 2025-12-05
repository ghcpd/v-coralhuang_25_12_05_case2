# Tour & Travel Booking Platform — MVP

This workspace contains a minimal full-stack MVP for a tour & travel booking platform (backend + frontend). It includes core features: search, bookings, user authentication, and a placeholder for Stripe-based payments.

Folders:
- `backend/` — Express API server (SQLite local DB)
- `frontend/` — React app (Vite)

Run the apps locally (from the root of this workspace):

1. Start the backend

```powershell
cd backend
npm install
npm run migrate    # creates local SQLite DB and tables
npm start
```

2. Start the frontend (new terminal)

```powershell
cd frontend
npm install
npm run dev
```

Open the frontend in your browser at http://localhost:5173 — the frontend talks to the backend at http://localhost:4000

More details are in `backend/README.md` and `frontend/README.md`.

Packaging the deliverable

You can create a ZIP of the repository using the PowerShell helper (Windows):

```powershell
./scripts/package.ps1 -Out "tour-travel-deliverable.zip"
```

API docs are available at `docs/APIDOC.md`.

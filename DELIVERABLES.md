# Deliverables for Travel Booking Platform Demo

This workspace contains a minimal, business-ready scaffold demonstrating how a tour and travel booking platform could be built. Included assets:

- Source code (backend/ Flask API)
- Lightweight frontend demo (frontend/index.html)
- Database schema (db/schema.sql)
- API documentation (API_DOCS.md)
- README files and test files (backend/tests)
- Packaging script to produce a zip (scripts/package.ps1)

To produce a zip suitable for distribution:

```powershell
cd <repo-root>\scripts
.\package.ps1 -OutFile travel_booking_release.zip
```

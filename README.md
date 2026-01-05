# Tour & Travel Booking Platform

Initial scaffold for a full-stack tour & travel booking platform (Next.js + TypeScript + Prisma + Stripe).

This repo will include:
- Search & booking for tours, flights, and accommodations
- User accounts and booking management
- Stripe payment integration
- Integration with third-party APIs for real-time availability

Quick start (once dependencies are installed):
1. npm install
2. npm run dev
3. npm test

See docs/ for more implementation details as the project progresses.

## Setup notes (Windows)
If you encounter a PowerShell execution policy error running npm on Windows, run one of the following in an elevated PowerShell or use CMD:
- Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
Or run npm commands from Command Prompt instead of PowerShell.

Full setup:
1. npm install
2. npm run dev  # start Next.js
3. npm test     # run test suite (Jest)

CI: A GitHub Actions workflow is included at .github/workflows/ci.yml to run tests in a clean environment.
# Setup and Local Development

## Prerequisites
- Node.js 18+
- PostgreSQL 12+
- pnpm or npm

## Backend
1. cd backend
2. npm install
3. copy `.env.example` to `.env` and update settings
4. npm install @prisma/client prisma --save-dev
5. npx prisma migrate dev --name init
6. npx prisma generate
5. npm run dev

## Frontend
1. cd frontend
2. npm install
3. npm run dev

## Notes

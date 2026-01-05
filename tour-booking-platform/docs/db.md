# Database Schema and Migrations

This project uses Prisma with PostgreSQL.

To create the database and run migrations:

1. Create a Postgres database and set DATABASE_URL in `backend/.env`.
2. From `backend/` run:
   - npm install
   - npx prisma migrate dev --name init
   - npx prisma generate
   - node prisma/seed.js

Schema is defined in `backend/prisma/schema.prisma` and includes `User` and `Booking` models.

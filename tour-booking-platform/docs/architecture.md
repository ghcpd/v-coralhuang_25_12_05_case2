# Architecture Overview

## Goals
- Provide search and booking for tours, flights, and accommodations
- Secure user accounts and payment processing
- Real-time availability via third-party APIs
- Scalable microservices-friendly architecture

## Components
- API Server (Express) - RESTful endpoints for search, bookings, users
- Database (Postgres) - normalized schema for users, bookings, inventory
- Payment Service - Stripe integration for payments
- Frontend SPA (React) - responsive UI for searching and booking
- Third-party adapters - connectors for flight/hotel APIs

## Data flow
1. User searches on frontend -> query API server
2. API server aggregates internal inventory + third-party APIs
3. User initiates booking -> reservation entry created in DB
4. Payment is processed with Stripe -> capture funds
5. Booking confirmed and notifications sent

## Scalability
- Use horizontal scaling for API servers behind a load balancer
- Use read replicas and caching layer (Redis) for search and availability
- Use background workers (e.g., BullMQ) for long-running tasks

## Security
- HTTPS only, secure cookies, JWT access tokens
- Input validation, sanitization, and rate limiting
- PCI compliance via Stripe and not storing card data

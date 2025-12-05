# Architecture Overview

## System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         End Users                               │
└────────────────────────────┬──────────────────────────────────────┘
                             │
                    ┌────────▼──────────┐
                    │   CDN / Cloudflare│
                    └────────┬──────────┘
                             │
        ┌────────────────────┼────────────────────┐
        │                    │                    │
   ┌────▼─────┐     ┌───────▼────────┐   ┌──────▼────┐
   │ Frontend  │     │  Backend API   │   │  Static   │
   │(React)   │     │  (Node.js)     │   │  Assets   │
   └────┬─────┘     └───────┬────────┘   └───────────┘
        │                   │
        └───────────────────┼──────────────┐
                            │              │
                  ┌─────────▼──────┐    ┌──▼─────────┐
                  │   PostgreSQL   │    │   Redis    │
                  │   Database     │    │   Cache    │
                  └────────────────┘    └────────────┘
                            │
                    ┌───────▼──────────┐
                    │ External APIs    │
                    │ - Stripe         │
                    │ - Amadeus        │
                    │ - Booking.com    │
                    │ - Viator         │
                    └──────────────────┘
```

## Technology Stack

### Frontend
- **Framework**: React 18 with Next.js 14
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State Management**: Zustand + React Query
- **HTTP Client**: Axios
- **Payment**: Stripe React Components

### Backend
- **Runtime**: Node.js 18
- **Framework**: Express.js
- **Language**: TypeScript
- **ORM**: Prisma
- **Database**: PostgreSQL 14
- **Cache**: Redis
- **Auth**: JWT + bcryptjs
- **Payment**: Stripe SDK

### DevOps
- **Containerization**: Docker
- **Orchestration**: Docker Compose / Kubernetes
- **CI/CD**: GitHub Actions
- **Deployment**: Heroku / AWS / DigitalOcean
- **Database**: AWS RDS / Heroku Postgres

---

## Database Schema

### Entity Relationships

```
User (1) ──── (Many) Booking
 │                     │
 └── (Many) Reviews    ├── Tour (optional)
             │         ├── Flight (optional)
             └─ (Many) └─ Accommodation (optional)

Tour (1) ──── (Many) Booking
 │                    
 └── (Many) Reviews

Flight (1) ──── (Many) Booking

Accommodation (1) ──── (Many) Booking
 │
 └── (Many) Reviews

Booking (1) ──── (1) Payment
```

### Key Tables

**Users**
- id (PK)
- email (UNIQUE)
- password (hashed)
- fullName
- phone
- preferences (JSON)
- createdAt, updatedAt

**Bookings**
- id (PK)
- userId (FK)
- bookingType (tour/flight/accommodation)
- tourId, flightId, accommodationId (FK)
- status (pending/confirmed/cancelled)
- totalPrice
- passengers
- checkIn, checkOut
- createdAt, updatedAt

**Tours**
- id (PK)
- title
- destination
- duration
- price
- maxPersons
- startDate, endDate
- description

**Payments**
- id (PK)
- bookingId (FK)
- amount
- currency
- status
- stripePaymentIntentId
- createdAt, updatedAt

---

## API Architecture

### Request Flow

```
Client Request
    │
    ├─→ CORS Middleware
    ├─→ Authentication Middleware
    ├─→ Request Logger
    ├─→ Route Handler
    │
    ├─→ Service Layer (Business Logic)
    │   ├─→ Database Queries (Prisma)
    │   ├─→ Cache Layer (Redis)
    │   └─→ Third-party API Calls
    │
    ├─→ Response Formatter
    └─→ Error Handler
    
Response to Client
```

### Service Layer

```
Controllers (Route Handlers)
    │
    ├─→ AuthService
    ├─→ BookingService
    ├─→ TourService
    ├─→ FlightService
    ├─→ AccommodationService
    └─→ PaymentService
         │
         ├─→ Database (Prisma)
         ├─→ Cache (Redis)
         ├─→ Stripe API
         ├─→ Amadeus API
         └─→ Booking.com API
```

---

## Security Architecture

### Authentication Flow

```
1. User Registration
   ├─→ Validate email format
   ├─→ Hash password with bcrypt
   ├─→ Store in database
   └─→ Return success

2. User Login
   ├─→ Find user by email
   ├─→ Compare password hash
   ├─→ Generate JWT token
   └─→ Return token & user info

3. Protected Requests
   ├─→ Extract token from headers
   ├─→ Verify JWT signature
   ├─→ Validate token expiration
   └─→ Attach user to request
```

### Data Protection

- **Passwords**: Bcrypt hashing (10 rounds)
- **API Keys**: Environment variables (never committed)
- **Sensitive Data**: Encrypted at rest
- **Transit**: HTTPS/TLS
- **Database**: Connection pooling with SSL

---

## Scalability Considerations

### Horizontal Scaling

```
Load Balancer (nginx)
    │
    ├─→ Backend Server 1
    ├─→ Backend Server 2
    ├─→ Backend Server 3
    └─→ Backend Server N
         │
         └─→ Shared Database
         └─→ Shared Cache (Redis)
         └─→ Shared File Storage (S3)
```

### Performance Optimization

1. **Database**
   - Connection pooling
   - Query optimization
   - Indexing strategy
   - Materialized views

2. **Caching**
   - Redis for sessions
   - Cache API responses
   - Cache TTL strategy

3. **CDN**
   - Static asset delivery
   - Geo-location routing
   - Cache invalidation

4. **Backend**
   - Response compression (gzip)
   - Pagination for large datasets
   - Rate limiting
   - Request queuing

---

## Monitoring & Observability

### Metrics to Track

- Response times (p50, p95, p99)
- Error rates
- Database query performance
- Cache hit ratio
- API quota usage
- Payment success rate

### Logging Strategy

```
Application Logs
    │
    ├─→ Local Files (development)
    ├─→ CloudWatch (AWS)
    ├─→ ELK Stack (on-premise)
    └─→ DataDog / New Relic (SaaS)
```

### Alerting

- CPU usage > 80%
- Memory usage > 85%
- Database connections > 80%
- Error rate > 5%
- Response time > 1000ms
- Payment failures

---

## Disaster Recovery

### Backup Strategy

- **Database**: Daily automated backups (30-day retention)
- **Files**: S3 cross-region replication
- **Code**: Git repository with protected main branch

### Recovery Time Objective (RTO)
- **Critical systems**: 1 hour
- **Non-critical**: 4 hours

### Recovery Point Objective (RPO)
- **Database**: 1 hour
- **File storage**: 6 hours

---

## Third-party Integrations

### Stripe Payment Processing
```
Booking Created
    │
    ├─→ Create Payment Intent
    ├─→ Return Client Secret
    │
User Completes Payment
    │
    ├─→ Webhook: payment_intent.succeeded
    ├─→ Update Booking Status
    ├─→ Send Confirmation Email
    └─→ Success Response
```

### Flight Search (Amadeus)
```
Search Request
    │
    ├─→ Validate parameters
    ├─→ Check Redis cache
    ├─→ Call Amadeus API
    ├─→ Cache results (1 hour)
    └─→ Return formatted data
```

### Hotel Search (Booking.com)
```
Search Request
    │
    ├─→ Validate parameters
    ├─→ Check Redis cache
    ├─→ Call Booking API
    ├─→ Cache results (6 hours)
    └─→ Return formatted data
```

---

## Deployment Strategy

### Development
- Local Docker Compose
- SQLite for testing
- Mock external APIs

### Staging
- AWS EC2 instances
- RDS PostgreSQL
- Redis cluster
- Staging environment parity

### Production
- Load-balanced backend
- Multi-AZ database
- CloudFront CDN
- Auto-scaling groups
- CloudWatch monitoring

---

## Performance Benchmarks

### Target Metrics
- **Page Load Time**: < 2 seconds
- **API Response Time**: < 200ms (p95)
- **Search Response Time**: < 1 second
- **Payment Processing**: < 3 seconds
- **Database Query**: < 100ms (p95)
- **Concurrent Users**: 10,000+
- **99.99% Uptime**: SLA target

---

## Technology Roadmap

### Phase 1 (Current)
- Core platform
- Basic integrations
- Web frontend

### Phase 2 (Q2 2024)
- Mobile app (React Native)
- Advanced analytics
- Email marketing integration

### Phase 3 (Q3 2024)
- AI recommendations
- Real-time notifications
- Multi-language support

### Phase 4 (Q4 2024)
- Marketplace features
- Affiliate program
- White-label solution

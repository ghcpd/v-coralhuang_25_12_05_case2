# Deployment Guide

## Prerequisites

- Docker and Docker Compose installed
- Node.js 18+ and npm
- PostgreSQL 14+ (for non-Docker deployments)
- Git account
- Stripe account
- Amadeus API account
- Booking.com Partner account

---

## Local Development Setup

### 1. Clone the Repository
```bash
git clone <repository-url>
cd travel-booking-platform
```

### 2. Using Docker Compose (Recommended)
```bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

This will start:
- Backend: http://localhost:5000
- Frontend: http://localhost:3000
- PostgreSQL: localhost:5432
- Redis: localhost:6379

### 3. Manual Setup

#### Backend Setup
```bash
cd backend

# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Configure environment variables in .env
# - DATABASE_URL
# - JWT_SECRET
# - STRIPE_SECRET_KEY
# - API keys

# Run migrations
npx prisma migrate dev

# Start development server
npm run dev
```

#### Frontend Setup
```bash
cd frontend

# Install dependencies
npm install

# Create .env.local file
cp .env.local.example .env.local

# Configure environment variables

# Start development server
npm run dev
```

---

## Production Deployment

### Option 1: Heroku Deployment

#### Backend Deployment
```bash
# Create Heroku app
heroku create travel-booking-api

# Add PostgreSQL addon
heroku addons:create heroku-postgresql:standard-0

# Add Redis addon
heroku addons:create heroku-redis:premium-0

# Set environment variables
heroku config:set JWT_SECRET=your_secret
heroku config:set STRIPE_SECRET_KEY=sk_live_xxx
heroku config:set AMADEUS_API_KEY=xxx

# Deploy
git push heroku main
```

#### Frontend Deployment (Vercel)
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Set environment variables in Vercel dashboard
# - NEXT_PUBLIC_API_URL
# - NEXT_PUBLIC_STRIPE_PUBLIC_KEY
```

### Option 2: AWS Deployment

#### ECR (Elastic Container Registry)
```bash
# Create repository
aws ecr create-repository --repository-name travel-booking-backend

# Build and push image
docker build -t travel-booking-backend .
docker tag travel-booking-backend:latest [ACCOUNT_ID].dkr.ecr.[REGION].amazonaws.com/travel-booking-backend:latest
docker push [ACCOUNT_ID].dkr.ecr.[REGION].amazonaws.com/travel-booking-backend:latest
```

#### ECS (Elastic Container Service)
1. Create ECS cluster
2. Create task definition from Docker image
3. Create service pointing to RDS PostgreSQL
4. Set up ALB for load balancing

#### RDS Setup
```bash
aws rds create-db-instance \
  --db-instance-identifier travel-booking-db \
  --db-instance-class db.t3.micro \
  --engine postgres \
  --allocated-storage 20
```

### Option 3: DigitalOcean App Platform

1. Connect GitHub repository
2. Create App Spec:
```yaml
name: travel-booking-platform
services:
  - name: backend
    github:
      repo: your-repo/travel-booking-platform
      branch: main
    build_command: npm install && npm run build
    run_command: npm start
    http_port: 5000
  - name: frontend
    github:
      repo: your-repo/travel-booking-platform
      branch: main
    build_command: cd frontend && npm install && npm run build
    run_command: cd frontend && npm start
    http_port: 3000
databases:
  - name: postgres
    engine: PG
    version: "14"
  - name: redis
    engine: REDIS
    version: "7"
```

---

## Environment Configuration

### Production Environment Variables

#### Backend (.env)
```
DATABASE_URL=postgresql://user:pass@prod-db.region.rds.amazonaws.com:5432/travel_booking
REDIS_URL=redis://prod-redis.region.cache.amazonaws.com:6379
JWT_SECRET=long_random_secret_key_min_32_chars
JWT_EXPIRATION=7d
STRIPE_SECRET_KEY=sk_live_actual_key
STRIPE_PUBLIC_KEY=pk_live_actual_key
STRIPE_WEBHOOK_SECRET=whsec_live_secret
AMADEUS_API_KEY=production_key
AMADEUS_API_SECRET=production_secret
BOOKING_PARTNER_ID=production_id
BOOKING_API_KEY=production_key
VIATOR_API_KEY=production_key
NODE_ENV=production
PORT=5000
CORS_ORIGIN=https://travel-booking.com
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_USER=apikey
SMTP_PASSWORD=SG.xxx
```

#### Frontend (.env.production)
```
NEXT_PUBLIC_API_URL=https://api.travel-booking.com/api
NEXT_PUBLIC_STRIPE_PUBLIC_KEY=pk_live_actual_key
```

---

## CI/CD Pipeline

### GitHub Actions Example

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: 18
      - run: npm ci
      - run: npm run test
      - run: npm run build

  deploy:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Deploy to Heroku
        uses: akhileshns/heroku-deploy@v3.12.14
        with:
          heroku_api_key: ${{ secrets.HEROKU_API_KEY }}
          heroku_app_name: travel-booking-api
```

---

## Database Migrations

### Creating a Migration
```bash
npx prisma migrate dev --name migration_name
```

### Running Migrations in Production
```bash
npx prisma migrate deploy
```

### Viewing Migration Status
```bash
npx prisma migrate status
```

---

## Monitoring & Logging

### Application Monitoring
- Use NewRelic, DataDog, or Sentry
- Monitor response times and error rates
- Set up alerts for critical issues

### Log Aggregation
- CloudWatch (AWS)
- ELK Stack (Elasticsearch, Logstash, Kibana)
- Papertrail
- Loggly

### Example with Sentry
```typescript
import * as Sentry from "@sentry/node";

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV,
  tracesSampleRate: 1.0,
});
```

---

## Backup Strategy

### Database Backups
```bash
# Manual backup
pg_dump travel_booking_db > backup.sql

# Automated daily backups (AWS RDS)
aws rds modify-db-instance \
  --db-instance-identifier travel-booking-db \
  --backup-retention-period 30
```

### Media Backups
- Use AWS S3 with versioning enabled
- Configure lifecycle policies for old versions
- Enable cross-region replication

---

## Security Checklist

- [ ] Enable HTTPS/SSL certificates
- [ ] Configure CORS properly
- [ ] Set security headers (HSTS, CSP, X-Frame-Options)
- [ ] Implement rate limiting
- [ ] Enable database encryption
- [ ] Use environment variables for secrets
- [ ] Implement API key rotation
- [ ] Set up Web Application Firewall (WAF)
- [ ] Enable audit logging
- [ ] Regular security audits
- [ ] Dependency scanning and updates

---

## Performance Optimization

### Database
- Create indexes on frequently queried columns
- Implement connection pooling
- Use materialized views for complex queries

### API
- Implement caching headers
- Use gzip compression
- Implement pagination
- Rate limiting

### Frontend
- Enable CDN for static assets
- Implement code splitting
- Enable service worker
- Optimize images

---

## Troubleshooting

### Common Issues

**Connection Refused to Database**
```bash
# Check database is running
docker-compose ps

# Check network connectivity
docker-compose logs postgres
```

**API Returns 500 Errors**
```bash
# Check logs
docker-compose logs backend

# Verify environment variables
docker-compose exec backend env
```

**Frontend Cannot Reach Backend**
```bash
# Check CORS configuration
# Verify API_URL in environment

# Test connectivity
curl http://localhost:5000/api/health
```

---

## Support & Maintenance

- Set up monitoring alerts
- Plan regular maintenance windows
- Keep dependencies updated
- Regular security audits
- Performance benchmarking

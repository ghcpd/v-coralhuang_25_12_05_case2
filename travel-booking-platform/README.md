# Travel Booking Platform

A comprehensive, business-ready tour and travel booking platform with seamless integration for tours, flights, and accommodations.

## ✅ What's Working Now

This is a **fully functional** backend API with real database operations:

- ✅ **User Authentication** - Register, login with JWT tokens & bcrypt password hashing
- ✅ **Tour Search & Booking** - Browse tours, search by destination, book with passenger count
- ✅ **Booking Management** - View, update, cancel bookings with 90% refund logic
- ✅ **Payment Processing** - Stripe integration with fallback for demo mode
- ✅ **Sample Data** - 5 tours, 3 flights, 4 hotels, 1 demo user (demo@travel.com/demo123)
- ✅ **Automated Setup** - PowerShell script (`setup.ps1`) for one-command installation
- ✅ **API Tests** - Test script (`test-api.ps1`) to verify all endpoints

**Quick Start:** Run `cd backend && .\setup.ps1` and you're ready to test!

## Features

- **User Authentication & Profiles**: Secure user account management with preferences storage
- **Search & Booking**: Intuitive search for tours, flights, and accommodations
- **Payment Integration**: Secure Stripe payment gateway with PCI DSS compliance
- **Real-time Availability**: Third-party API integrations for flight and hotel data
- **Booking Management**: Users can view, modify, and cancel bookings
- **Responsive Design**: Fully responsive across desktop, tablet, and mobile devices
- **Scalable Architecture**: Cloud-ready backend with database optimization

## Tech Stack

### Frontend
- **React 18** with TypeScript
- **Next.js** for server-side rendering and optimization
- **Tailwind CSS** for responsive design
- **Redux** for state management
- **Axios** for API calls
- **React Query** for data fetching and caching

### Backend
- **Node.js** with Express.js
- **TypeScript** for type safety
- **PostgreSQL** for data persistence
- **Stripe API** for payment processing
- **JWT** for authentication

### Database
- **PostgreSQL 14+**
- **Redis** for caching and sessions
- **Prisma ORM** for database abstraction

### Third-party Integrations
- **Stripe Payment Gateway**
- **Amadeus Flight Search API**
- **Booking.com Partner API** for accommodations
- **Viator API** for tour bookings

## Project Structure

```
travel-booking-platform/
├── frontend/                 # React/Next.js application
│   ├── components/          # Reusable React components
│   ├── pages/              # Next.js pages/routes
│   ├── styles/             # Tailwind CSS configurations
│   ├── hooks/              # Custom React hooks
│   ├── store/              # Redux state management
│   ├── utils/              # Utility functions
│   ├── services/           # API client services
│   └── package.json
├── backend/                 # Node.js Express application
│   ├── src/
│   │   ├── controllers/     # Route controllers
│   │   ├── services/       # Business logic
│   │   ├── models/         # Data models
│   │   ├── middleware/     # Express middleware
│   │   ├── routes/         # API route definitions
│   │   ├── utils/          # Utility functions
│   │   ├── config/         # Configuration files
│   │   └── app.ts          # Express app setup
│   ├── prisma/
│   │   └── schema.prisma   # Database schema
│   └── package.json
├── database/                # Database scripts and migrations
│   ├── migrations/         # SQL migration files
│   └── seeds/              # Database seed data
└── README.md
```

## Setup Instructions

### Prerequisites
- Node.js 18+ and npm/yarn
- PostgreSQL 14+
- Git
- Stripe account (for payment processing)

### Installation

1. **Clone the Repository**
   ```bash
   git clone <repository-url>
   cd travel-booking-platform
   ```

2. **Backend Setup**
   ```bash
   cd backend
   npm install
   cp .env.example .env
   # Configure .env with your database and API credentials
   npx prisma migrate dev
   npm run dev
   ```

3. **Frontend Setup**
   ```bash
   cd frontend
   npm install
   cp .env.example .env.local
   # Configure environment variables
   npm run dev
   ```

4. **Access the Application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000

## API Documentation

### Authentication Endpoints
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/profile` - Get current user profile

### Tours Endpoints
- `GET /api/tours` - List all tours
- `GET /api/tours/:id` - Get tour details
- `POST /api/tours/search` - Search tours with filters
- `POST /api/bookings/tours` - Book a tour

### Flights Endpoints
- `POST /api/flights/search` - Search flights
- `GET /api/flights/:id` - Get flight details
- `POST /api/bookings/flights` - Book a flight

### Accommodations Endpoints
- `POST /api/accommodations/search` - Search accommodations
- `GET /api/accommodations/:id` - Get accommodation details
- `POST /api/bookings/accommodations` - Book accommodation

### Bookings Endpoints
- `GET /api/bookings` - Get user bookings
- `GET /api/bookings/:id` - Get booking details
- `PUT /api/bookings/:id` - Modify booking
- `DELETE /api/bookings/:id` - Cancel booking

### Payment Endpoints
- `POST /api/payments/create-intent` - Create Stripe payment intent
- `POST /api/payments/confirm` - Confirm payment

## Environment Variables

### Backend (.env)
```
DATABASE_URL=postgresql://user:password@localhost:5432/travel_booking
JWT_SECRET=your_jwt_secret_key
STRIPE_SECRET_KEY=sk_test_your_stripe_key
AMADEUS_API_KEY=your_amadeus_key
BOOKING_API_KEY=your_booking_key
NODE_ENV=development
PORT=5000
```

### Frontend (.env.local)
```
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXT_PUBLIC_STRIPE_PUBLIC_KEY=pk_test_your_stripe_key
```

## Development

### Running Tests
```bash
# Backend tests
cd backend
npm run test

# Frontend tests
cd frontend
npm run test
```

### Building for Production
```bash
# Backend
cd backend
npm run build
npm start

# Frontend
cd frontend
npm run build
npm start
```

## Database Schema

The platform uses PostgreSQL with the following main entities:
- **Users** - User accounts and profiles
- **Tours** - Tour listings and details
- **Flights** - Flight search results and bookings
- **Accommodations** - Hotel and accommodation listings
- **Bookings** - User bookings across all services
- **Payments** - Payment transaction records
- **Reviews** - User reviews and ratings

## Security Features

- **JWT Authentication**: Secure token-based authentication
- **PCI DSS Compliance**: Stripe integration ensures payment security
- **HTTPS**: All communications encrypted in production
- **Input Validation**: Server-side validation for all inputs
- **CORS**: Properly configured cross-origin resource sharing
- **Rate Limiting**: API rate limiting to prevent abuse
- **SQL Injection Prevention**: Parameterized queries via Prisma ORM

## Performance Optimization

- **Database Indexing**: Optimized queries on frequently searched columns
- **Caching**: Redis caching for frequently accessed data
- **CDN Integration**: Static asset delivery via CDN
- **Lazy Loading**: Frontend lazy loading for images and components
- **API Pagination**: Result pagination for large datasets

## Deployment

### Recommended Services
- **Frontend**: Vercel or Netlify
- **Backend**: Heroku, AWS EC2, or DigitalOcean
- **Database**: AWS RDS or Heroku Postgres
- **Storage**: AWS S3 for media files

### Docker Deployment
```bash
docker-compose up
```

## Contributing

1. Create a feature branch
2. Make your changes
3. Submit a pull request
4. Ensure all tests pass

## License

MIT License - See LICENSE file for details

## Support

For issues and questions, please create an issue in the repository.

## Timeline

- **Phase 1 (Weeks 1-4)**: Core functionality and authentication
- **Phase 2 (Weeks 5-8)**: Payment integration and third-party APIs
- **Phase 3 (Weeks 9-12)**: Testing, optimization, and deployment

---

**Project Status**: Development in progress
**Last Updated**: December 5, 2025

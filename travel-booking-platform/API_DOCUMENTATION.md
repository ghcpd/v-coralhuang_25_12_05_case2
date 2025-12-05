# API Documentation

## Base URL
```
http://localhost:5000/api
```

## Authentication
All protected endpoints require a Bearer token in the Authorization header:
```
Authorization: Bearer <token>
```

---

## Authentication Endpoints

### Register User
**POST** `/auth/register`

Request Body:
```json
{
  "email": "user@example.com",
  "password": "password123",
  "fullName": "John Doe"
}
```

Response:
```json
{
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "fullName": "John Doe"
  },
  "token": "jwt_token"
}
```

### Login
**POST** `/auth/login`

Request Body:
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

Response:
```json
{
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "fullName": "John Doe"
  },
  "token": "jwt_token"
}
```

### Get Profile
**GET** `/auth/profile` *(Requires Authentication)*

Response:
```json
{
  "id": "uuid",
  "email": "user@example.com",
  "fullName": "John Doe",
  "phone": "+1234567890"
}
```

### Update Profile
**PUT** `/auth/profile` *(Requires Authentication)*

Request Body:
```json
{
  "fullName": "John Smith",
  "phone": "+0987654321",
  "preferences": {
    "notifications": true,
    "currency": "USD"
  }
}
```

---

## Tours Endpoints

### Search Tours
**POST** `/tours/search`

Request Body:
```json
{
  "destination": "Paris",
  "startDate": "2024-06-01",
  "endDate": "2024-06-10",
  "priceMin": 1000,
  "priceMax": 5000
}
```

Response:
```json
{
  "tours": [
    {
      "id": "uuid",
      "title": "Paris City Tour",
      "destination": "Paris",
      "duration": 7,
      "price": 1500,
      "startDate": "2024-06-01",
      "maxPersons": 20,
      "description": "Explore the City of Light"
    }
  ],
  "total": 1
}
```

### Get All Tours
**GET** `/tours`

Query Parameters:
- `page` (optional): Page number (default: 1)
- `limit` (optional): Results per page (default: 10)

### Get Tour Details
**GET** `/tours/:id`

Response:
```json
{
  "id": "uuid",
  "title": "Paris City Tour",
  "destination": "Paris",
  "duration": 7,
  "price": 1500,
  "description": "Explore the City of Light",
  "startDate": "2024-06-01",
  "endDate": "2024-06-08",
  "maxPersons": 20,
  "includes": ["Hotel", "Meals", "Guide"]
}
```

### Book Tour
**POST** `/tours/:id/book` *(Requires Authentication)*

Request Body:
```json
{
  "passengers": 2,
  "specialRequirements": "Vegetarian meals needed"
}
```

Response:
```json
{
  "bookingId": "uuid",
  "status": "pending",
  "totalPrice": 3000,
  "paymentIntentId": "stripe_intent_id"
}
```

---

## Flights Endpoints

### Search Flights
**POST** `/flights/search`

Request Body:
```json
{
  "origin": "JFK",
  "destination": "CDG",
  "departDate": "2024-06-15",
  "returnDate": "2024-06-20",
  "passengers": 2,
  "cabinClass": "economy"
}
```

Response:
```json
{
  "flights": [
    {
      "id": "uuid",
      "airline": "Air France",
      "flightNumber": "AF123",
      "departure": "2024-06-15T10:00:00Z",
      "arrival": "2024-06-15T22:00:00Z",
      "price": 800,
      "seatsAvailable": 25
    }
  ]
}
```

### Get Flight Details
**GET** `/flights/:id`

### Book Flight
**POST** `/flights/:id/book` *(Requires Authentication)*

Request Body:
```json
{
  "passengers": [
    {
      "firstName": "John",
      "lastName": "Doe",
      "email": "john@example.com",
      "dateOfBirth": "1990-01-01"
    }
  ],
  "contactInfo": {
    "phone": "+1234567890",
    "email": "john@example.com"
  }
}
```

---

## Accommodations Endpoints

### Search Accommodations
**POST** `/accommodations/search`

Request Body:
```json
{
  "location": "Paris",
  "checkIn": "2024-06-01",
  "checkOut": "2024-06-10",
  "guests": 2,
  "priceMin": 50,
  "priceMax": 300
}
```

Response:
```json
{
  "accommodations": [
    {
      "id": "uuid",
      "name": "Hotel Le Marais",
      "location": "Paris",
      "price": 150,
      "rating": 4.5,
      "amenities": ["WiFi", "Pool", "Restaurant"],
      "maxGuests": 4
    }
  ]
}
```

### Get Accommodation Details
**GET** `/accommodations/:id`

### Book Accommodation
**POST** `/accommodations/:id/book` *(Requires Authentication)*

Request Body:
```json
{
  "checkIn": "2024-06-01",
  "checkOut": "2024-06-10",
  "guests": 2,
  "specialRequests": "Late checkout requested"
}
```

---

## Bookings Endpoints

### Get User Bookings
**GET** `/bookings` *(Requires Authentication)*

Query Parameters:
- `status` (optional): Filter by status (pending, confirmed, cancelled)
- `type` (optional): Filter by type (tour, flight, accommodation)

Response:
```json
{
  "bookings": [
    {
      "id": "uuid",
      "bookingType": "tour",
      "title": "Paris City Tour",
      "status": "confirmed",
      "totalPrice": 3000,
      "date": "2024-06-01",
      "createdAt": "2024-05-01T10:00:00Z"
    }
  ]
}
```

### Get Booking Details
**GET** `/bookings/:id` *(Requires Authentication)*

### Update Booking
**PUT** `/bookings/:id` *(Requires Authentication)*

Request Body:
```json
{
  "passengers": 3,
  "specialRequirements": "Updated requirements"
}
```

### Cancel Booking
**DELETE** `/bookings/:id` *(Requires Authentication)*

Response:
```json
{
  "message": "Booking cancelled successfully",
  "refundAmount": 2700
}
```

---

## Payments Endpoints

### Create Payment Intent
**POST** `/payments/create-intent` *(Requires Authentication)*

Request Body:
```json
{
  "amount": 3000,
  "bookingId": "uuid",
  "bookingType": "tour"
}
```

Response:
```json
{
  "clientSecret": "pi_1234_secret_5678",
  "publishableKey": "pk_test_xxxx"
}
```

### Confirm Payment
**POST** `/payments/confirm` *(Requires Authentication)*

Request Body:
```json
{
  "paymentIntentId": "pi_1234",
  "bookingId": "uuid"
}
```

Response:
```json
{
  "status": "success",
  "message": "Payment confirmed",
  "bookingStatus": "confirmed"
}
```

### Get Payment History
**GET** `/payments/history` *(Requires Authentication)*

Response:
```json
{
  "payments": [
    {
      "id": "uuid",
      "bookingId": "uuid",
      "amount": 3000,
      "currency": "USD",
      "status": "succeeded",
      "date": "2024-05-01T10:00:00Z"
    }
  ]
}
```

---

## Error Responses

All errors follow this format:

```json
{
  "error": "Error message",
  "statusCode": 400
}
```

Common Status Codes:
- `200`: OK
- `201`: Created
- `400`: Bad Request
- `401`: Unauthorized
- `404`: Not Found
- `500`: Internal Server Error

---

## Rate Limiting

API requests are limited to 100 requests per minute per IP address.

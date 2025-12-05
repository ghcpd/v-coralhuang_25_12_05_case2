import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // Create demo user
  const hashedPassword = await bcrypt.hash('demo123', 10);
  
  const user = await prisma.user.upsert({
    where: { email: 'demo@travel.com' },
    update: {},
    create: {
      email: 'demo@travel.com',
      password: hashedPassword,
      fullName: 'Demo User',
      phone: '+1234567890',
    },
  });

  console.log('Created demo user:', user.email);

  // Create sample tours
  const tours = await Promise.all([
    prisma.tour.create({
      data: {
        title: 'Paris City Tour',
        description: 'Explore the romantic streets of Paris, visit the Eiffel Tower, Louvre Museum, and more.',
        destination: 'Paris, France',
        duration: 7,
        price: 1500.00,
        maxPersons: 20,
        startDate: new Date('2024-06-01'),
        endDate: new Date('2024-06-08'),
      },
    }),
    prisma.tour.create({
      data: {
        title: 'Tokyo Adventure',
        description: 'Discover traditional and modern Japan. Visit temples, experience sushi making, and explore Tokyo.',
        destination: 'Tokyo, Japan',
        duration: 10,
        price: 2500.00,
        maxPersons: 15,
        startDate: new Date('2024-07-15'),
        endDate: new Date('2024-07-25'),
      },
    }),
    prisma.tour.create({
      data: {
        title: 'New York Explorer',
        description: 'Experience the Big Apple: Times Square, Central Park, Statue of Liberty, and Broadway shows.',
        destination: 'New York, USA',
        duration: 5,
        price: 1200.00,
        maxPersons: 25,
        startDate: new Date('2024-08-10'),
        endDate: new Date('2024-08-15'),
      },
    }),
    prisma.tour.create({
      data: {
        title: 'Bali Paradise',
        description: 'Relax on pristine beaches, visit ancient temples, and enjoy traditional Balinese culture.',
        destination: 'Bali, Indonesia',
        duration: 8,
        price: 1800.00,
        maxPersons: 18,
        startDate: new Date('2024-09-01'),
        endDate: new Date('2024-09-09'),
      },
    }),
    prisma.tour.create({
      data: {
        title: 'Rome History Tour',
        description: 'Walk through ancient Rome: Colosseum, Roman Forum, Vatican City, and authentic Italian cuisine.',
        destination: 'Rome, Italy',
        duration: 6,
        price: 1400.00,
        maxPersons: 22,
        startDate: new Date('2024-10-05'),
        endDate: new Date('2024-10-11'),
      },
    }),
  ]);

  console.log(`Created ${tours.length} tours`);

  // Create sample flights
  const flights = await Promise.all([
    prisma.flight.create({
      data: {
        airline: 'Air France',
        flightNumber: 'AF123',
        origin: 'JFK',
        destination: 'CDG',
        departure: new Date('2024-06-01T10:00:00Z'),
        arrival: new Date('2024-06-01T22:00:00Z'),
        price: 850.00,
        seatsAvailable: 50,
      },
    }),
    prisma.flight.create({
      data: {
        airline: 'Japan Airlines',
        flightNumber: 'JL456',
        origin: 'LAX',
        destination: 'NRT',
        departure: new Date('2024-07-15T14:00:00Z'),
        arrival: new Date('2024-07-16T18:00:00Z'),
        price: 1200.00,
        seatsAvailable: 35,
      },
    }),
    prisma.flight.create({
      data: {
        airline: 'Delta',
        flightNumber: 'DL789',
        origin: 'ATL',
        destination: 'JFK',
        departure: new Date('2024-08-10T08:00:00Z'),
        arrival: new Date('2024-08-10T10:30:00Z'),
        price: 250.00,
        seatsAvailable: 80,
      },
    }),
  ]);

  console.log(`Created ${flights.length} flights`);

  // Create sample accommodations
  const accommodations = await Promise.all([
    prisma.accommodation.create({
      data: {
        name: 'Hotel Le Marais',
        description: 'Charming hotel in the heart of Paris with modern amenities and classic French decor.',
        location: 'Paris, France',
        price: 150.00,
        maxGuests: 2,
        amenities: ['WiFi', 'Breakfast', 'Air Conditioning', 'Room Service'],
      },
    }),
    prisma.accommodation.create({
      data: {
        name: 'Tokyo Grand Hotel',
        description: 'Luxury hotel near Shibuya with stunning city views and traditional Japanese spa.',
        location: 'Tokyo, Japan',
        price: 250.00,
        maxGuests: 3,
        amenities: ['WiFi', 'Pool', 'Spa', 'Restaurant', 'Gym'],
      },
    }),
    prisma.accommodation.create({
      data: {
        name: 'Manhattan Plaza Hotel',
        description: 'Modern hotel in Midtown Manhattan, walking distance to Times Square and Broadway.',
        location: 'New York, USA',
        price: 200.00,
        maxGuests: 4,
        amenities: ['WiFi', 'Concierge', 'Fitness Center', 'Bar'],
      },
    }),
    prisma.accommodation.create({
      data: {
        name: 'Bali Beach Resort',
        description: 'Beachfront resort with private villas, infinity pool, and authentic Balinese spa.',
        location: 'Bali, Indonesia',
        price: 180.00,
        maxGuests: 2,
        amenities: ['WiFi', 'Pool', 'Beach Access', 'Spa', 'Restaurant', 'Bar'],
      },
    }),
  ]);

  console.log(`Created ${accommodations.length} accommodations`);

  console.log('Database seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error('Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

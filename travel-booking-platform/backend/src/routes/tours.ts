import express, { Router, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticate, AuthRequest } from '../middleware/auth';

const router: Router = express.Router();
const prisma = new PrismaClient();

// List all tours
router.get('/', async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    const [tours, total] = await Promise.all([
      prisma.tour.findMany({
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.tour.count(),
    ]);

    res.json({
      tours,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error: any) {
    console.error('Tours fetch error:', error);
    res.status(500).json({ error: 'Failed to fetch tours' });
  }
});

// Get tour details
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const tour = await prisma.tour.findUnique({
      where: { id },
      include: {
        reviews: {
          include: {
            user: {
              select: {
                fullName: true,
              },
            },
          },
        },
      },
    });

    if (!tour) {
      return res.status(404).json({ error: 'Tour not found' });
    }

    res.json({ tour });
  } catch (error: any) {
    console.error('Tour fetch error:', error);
    res.status(500).json({ error: 'Failed to fetch tour' });
  }
});

// Search tours
router.post('/search', async (req: Request, res: Response) => {
  try {
    const { destination, startDate, endDate, priceMin, priceMax } = req.body;

    const where: any = {};

    if (destination) {
      where.destination = {
        contains: destination,
        mode: 'insensitive',
      };
    }

    if (startDate) {
      where.startDate = {
        gte: new Date(startDate),
      };
    }

    if (endDate) {
      where.endDate = {
        lte: new Date(endDate),
      };
    }

    if (priceMin !== undefined || priceMax !== undefined) {
      where.price = {};
      if (priceMin !== undefined) where.price.gte = parseFloat(priceMin);
      if (priceMax !== undefined) where.price.lte = parseFloat(priceMax);
    }

    const tours = await prisma.tour.findMany({
      where,
      orderBy: { price: 'asc' },
    });

    res.json({ tours, count: tours.length });
  } catch (error: any) {
    console.error('Tour search error:', error);
    res.status(500).json({ error: 'Tour search failed', details: error.message });
  }
});

// Book a tour
router.post('/:id/book', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user?.userId;
    const { passengers, specialRequirements } = req.body;

    // Find tour
    const tour = await prisma.tour.findUnique({ where: { id } });
    if (!tour) {
      return res.status(404).json({ error: 'Tour not found' });
    }

    // Calculate total price
    const totalPrice = tour.price * (passengers || 1);

    // Create booking
    const booking = await prisma.booking.create({
      data: {
        userId,
        tourId: id,
        bookingType: 'tour',
        status: 'pending',
        totalPrice,
        passengers: passengers || 1,
      },
    });

    res.status(201).json({
      message: 'Tour booked successfully',
      bookingId: booking.id,
      totalPrice,
      status: booking.status,
    });
  } catch (error: any) {
    console.error('Booking error:', error);
    res.status(500).json({ error: 'Failed to book tour', details: error.message });
  }
});

export default router;

import express, { Router, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticate, AuthRequest } from '../middleware/auth';

const router: Router = express.Router();
const prisma = new PrismaClient();

// Get user bookings
router.get('/', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.userId;
    const status = req.query.status as string;
    const type = req.query.type as string;

    const where: any = { userId };

    if (status) {
      where.status = status;
    }

    if (type) {
      where.bookingType = type;
    }

    const bookings = await prisma.booking.findMany({
      where,
      include: {
        tour: true,
        flight: true,
        accommodation: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    res.json({ bookings, count: bookings.length });
  } catch (error: any) {
    console.error('Bookings fetch error:', error);
    res.status(500).json({ error: 'Failed to fetch bookings' });
  }
});

// Get booking details
router.get('/:id', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user?.userId;

    const booking = await prisma.booking.findFirst({
      where: {
        id,
        userId,
      },
      include: {
        tour: true,
        flight: true,
        accommodation: true,
        user: {
          select: {
            email: true,
            fullName: true,
            phone: true,
          },
        },
      },
    });

    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    res.json({ booking });
  } catch (error: any) {
    console.error('Booking fetch error:', error);
    res.status(500).json({ error: 'Failed to fetch booking' });
  }
});

// Update booking
router.put('/:id', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user?.userId;
    const { passengers, checkIn, checkOut } = req.body;

    // Check if booking belongs to user
    const existingBooking = await prisma.booking.findFirst({
      where: { id, userId },
    });

    if (!existingBooking) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    if (existingBooking.status === 'cancelled') {
      return res.status(400).json({ error: 'Cannot update cancelled booking' });
    }

    const updatedBooking = await prisma.booking.update({
      where: { id },
      data: {
        passengers: passengers || undefined,
        checkIn: checkIn ? new Date(checkIn) : undefined,
        checkOut: checkOut ? new Date(checkOut) : undefined,
      },
    });

    res.json({
      message: 'Booking updated successfully',
      booking: updatedBooking,
    });
  } catch (error: any) {
    console.error('Booking update error:', error);
    res.status(500).json({ error: 'Failed to update booking' });
  }
});

// Cancel booking
router.delete('/:id', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user?.userId;

    // Check if booking belongs to user
    const booking = await prisma.booking.findFirst({
      where: { id, userId },
    });

    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    if (booking.status === 'cancelled') {
      return res.status(400).json({ error: 'Booking already cancelled' });
    }

    // Update booking status
    const cancelledBooking = await prisma.booking.update({
      where: { id },
      data: { status: 'cancelled' },
    });

    // Calculate refund (90% refund policy)
    const refundAmount = booking.totalPrice * 0.9;

    res.json({
      message: 'Booking cancelled successfully',
      bookingId: booking.id,
      refundAmount,
      refundPolicy: '90% refund',
    });
  } catch (error: any) {
    console.error('Booking cancellation error:', error);
    res.status(500).json({ error: 'Failed to cancel booking' });
  }
});

export default router;

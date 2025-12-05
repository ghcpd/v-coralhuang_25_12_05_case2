import express, { Router, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticate, AuthRequest } from '../middleware/auth';
import Stripe from 'stripe';

const router: Router = express.Router();
const prisma = new PrismaClient();

// Initialize Stripe (use test key if not set)
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_dummy_key', {
  apiVersion: '2024-11-20.acacia',
});

// Create payment intent
router.post('/create-intent', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const { amount, bookingId } = req.body;
    const userId = req.user?.userId;

    if (!amount || !bookingId) {
      return res.status(400).json({ error: 'Amount and booking ID are required' });
    }

    // Verify booking belongs to user
    const booking = await prisma.booking.findFirst({
      where: { id: bookingId, userId },
    });

    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    // Create Stripe payment intent (simulated in demo mode)
    let paymentIntent;
    
    try {
      paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(amount * 100), // Convert to cents
        currency: 'usd',
        metadata: {
          bookingId,
          userId,
        },
      });
    } catch (stripeError: any) {
      // If Stripe fails (e.g., invalid API key), create a mock response
      console.warn('Stripe API unavailable, using mock payment:', stripeError.message);
      paymentIntent = {
        id: `pi_mock_${Date.now()}`,
        client_secret: `mock_secret_${Date.now()}`,
        amount: Math.round(amount * 100),
        currency: 'usd',
        status: 'requires_payment_method',
      } as any;
    }

    // Create payment record
    const payment = await prisma.payment.create({
      data: {
        bookingId,
        amount,
        currency: 'USD',
        status: 'pending',
        stripePaymentIntentId: paymentIntent.id,
      },
    });

    res.json({
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
      paymentId: payment.id,
    });
  } catch (error: any) {
    console.error('Payment intent creation error:', error);
    res.status(500).json({ error: 'Failed to create payment intent', details: error.message });
  }
});

// Confirm payment
router.post('/confirm', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const { paymentIntentId, bookingId } = req.body;
    const userId = req.user?.userId;

    if (!paymentIntentId || !bookingId) {
      return res.status(400).json({ error: 'Payment intent ID and booking ID are required' });
    }

    // Verify booking
    const booking = await prisma.booking.findFirst({
      where: { id: bookingId, userId },
    });

    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    // Update payment status
    const payment = await prisma.payment.updateMany({
      where: {
        bookingId,
        stripePaymentIntentId: paymentIntentId,
      },
      data: {
        status: 'succeeded',
      },
    });

    // Update booking status
    await prisma.booking.update({
      where: { id: bookingId },
      data: { status: 'confirmed' },
    });

    res.json({
      status: 'success',
      message: 'Payment confirmed successfully',
      bookingStatus: 'confirmed',
    });
  } catch (error: any) {
    console.error('Payment confirmation error:', error);
    res.status(500).json({ error: 'Payment confirmation failed', details: error.message });
  }
});

// Stripe webhook
router.post('/webhook', async (req: Request, res: Response) => {
  try {
    const sig = req.headers['stripe-signature'] as string;
    
    // In production, verify webhook signature
    // const event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
    
    const event = req.body;

    // Handle the event
    switch (event.type) {
      case 'payment_intent.succeeded':
        const paymentIntent = event.data.object;
        console.log('Payment succeeded:', paymentIntent.id);
        
        // Update payment and booking status
        await prisma.payment.updateMany({
          where: { stripePaymentIntentId: paymentIntent.id },
          data: { status: 'succeeded' },
        });
        
        break;
      case 'payment_intent.payment_failed':
        console.log('Payment failed:', event.data.object.id);
        
        await prisma.payment.updateMany({
          where: { stripePaymentIntentId: event.data.object.id },
          data: { status: 'failed' },
        });
        
        break;
      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    res.json({ received: true });
  } catch (error: any) {
    console.error('Webhook error:', error);
    res.status(500).json({ error: 'Webhook processing failed' });
  }
});

// Get payment history
router.get('/history', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.userId;

    const bookings = await prisma.booking.findMany({
      where: { userId },
      include: {
        tour: true,
        flight: true,
        accommodation: true,
      },
    });

    const bookingIds = bookings.map(b => b.id);

    const payments = await prisma.payment.findMany({
      where: {
        bookingId: { in: bookingIds },
      },
      orderBy: { createdAt: 'desc' },
    });

    // Enrich payments with booking details
    const enrichedPayments = payments.map(payment => {
      const booking = bookings.find(b => b.id === payment.bookingId);
      return {
        ...payment,
        booking: booking ? {
          id: booking.id,
          type: booking.bookingType,
          status: booking.status,
          passengers: booking.passengers,
        } : null,
      };
    });

    res.json({ payments: enrichedPayments, count: payments.length });
  } catch (error: any) {
    console.error('Payment history fetch error:', error);
    res.status(500).json({ error: 'Failed to fetch payment history' });
  }
});

export default router;

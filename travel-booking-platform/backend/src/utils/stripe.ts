import Stripe from 'stripe';

const stripeClient = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2023-10-16',
});

export const createPaymentIntent = async (
  amount: number,
  currency: string = 'usd'
) => {
  try {
    return await stripeClient.paymentIntents.create({
      amount: Math.round(amount * 100),
      currency,
    });
  } catch (error) {
    console.error('Stripe error:', error);
    throw error;
  }
};

export const retrievePaymentIntent = async (intentId: string) => {
  try {
    return await stripeClient.paymentIntents.retrieve(intentId);
  } catch (error) {
    console.error('Stripe error:', error);
    throw error;
  }
};

export const confirmPaymentIntent = async (intentId: string) => {
  try {
    return await stripeClient.paymentIntents.confirm(intentId);
  } catch (error) {
    console.error('Stripe error:', error);
    throw error;
  }
};

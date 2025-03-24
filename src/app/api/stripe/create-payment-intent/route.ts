// src/app/api/stripe/create-payment-intent/route.ts
import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {}); // Removed apiVersion

export async function POST(request: NextRequest) {
  try {
    const { beatId, licenseId, price, firstName, lastName } = await request.json();

    // Create a PaymentIntent with the order amount and currency
    const paymentIntent = await stripe.paymentIntents.create({
      amount: price * 100, // Stripe uses cents
      currency: 'usd',
      automatic_payment_methods: {
        enabled: true,
      },
      metadata: {
        beatId,
        licenseId,
        firstName,
        lastName,
      },
    });

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
    });
  } catch (error) {
    console.error('Error creating payment intent:', error);
    return NextResponse.json({ error: 'Failed to create payment intent' }, { status: 500 });
  }
}
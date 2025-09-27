// src/app/api/stripe/create-payment-intent/route.ts
import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

export async function POST(request: NextRequest) {
  try {
    const secretKey = process.env.STRIPE_SECRET_KEY;
    if (!secretKey) {
      console.error('Missing STRIPE_SECRET_KEY environment variable');
      return NextResponse.json({ error: 'Missing STRIPE_SECRET_KEY (server misconfiguration)' }, { status: 500 });
    }

    // Create Stripe client inside handler so builds don't fail when env is missing
    const stripe = new Stripe(secretKey, {});

    const { beatId, licenseId, price, firstName, lastName } = await request.json();

    // Create a PaymentIntent with the order amount and currency
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(Number(price) * 100), // Stripe uses cents, ensure number
      currency: 'usd',
      automatic_payment_methods: {
        enabled: true,
      },
      metadata: {
        beatId: String(beatId ?? ''),
        licenseId: String(licenseId ?? ''),
        firstName: String(firstName ?? ''),
        lastName: String(lastName ?? ''),
      },
    });

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
    });
  } catch (error) {
    console.error('Error creating payment intent:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
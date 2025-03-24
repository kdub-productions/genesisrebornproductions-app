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
    console.error('Error creating payment intent:', error); // Log the full error for debugging
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred'; // Handle non-Error objects
    return NextResponse.json({ error: errorMessage }, { status: 500 }); // Return a more informative error
  }  
}
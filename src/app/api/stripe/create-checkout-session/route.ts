import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { beatsData, Beat, License } from '@/types/beats'; // Import beatsData and types

export async function POST(request: NextRequest) {
  try {
    const secretKey = process.env.STRIPE_SECRET_KEY;
    if (!secretKey) {
      console.error('Missing STRIPE_SECRET_KEY environment variable');
      return NextResponse.json({ error: 'Missing STRIPE_SECRET_KEY (server misconfiguration)' }, { status: 500 });
    }

    // Initialize Stripe inside handler to avoid build-time failures
    const stripe = new Stripe(secretKey, { apiVersion: '2025-02-24.acacia' });

    const { beatId, licenseId, price, beatTitle } = await request.json();

    // Find the beat in your data
    const beat: Beat | undefined = beatsData.find((b) => b.id === beatId);
    if (!beat) {
      return NextResponse.json({ error: 'Beat not found' }, { status: 404 });
    }

    // Directly access the license property
    const license: License = beat.license;
    if (license.id !== licenseId) {
      return NextResponse.json({ error: 'License not found' }, { status: 404 });
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: `${beat.title} - ${license.name}`, // Dynamic product name
              description: license.description,
              images: [`${request.headers.get('origin')}${beat.artwork}`],
            },
            unit_amount: Math.round(Number(price) * 100), // Stripe uses cents
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${request.headers.get('origin')}/thank-you`,
      cancel_url: `${request.headers.get('origin')}/beatsforsale`,
      metadata: {
        beatId: beat.id,
        beatTitle: beat.title,
        licenseId: license.id,
        licenseName: license.name,
      },
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error('Error creating checkout session:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}

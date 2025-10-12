import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import nodemailer from 'nodemailer';

const createTransporter = () => nodemailer.createTransport({
  service: 'gmail',
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL_USER || 'genesisrebornproductions@gmail.com',
    pass: process.env.EMAIL_APP_PASSWORD
  },
  tls: { rejectUnauthorized: false }
});

export async function POST(request: NextRequest) {
  try {
    const { sessionId } = await request.json();

    if (!sessionId) {
      return NextResponse.json({ error: 'Session ID is required' }, { status: 400 });
    }

    const secretKey = process.env.STRIPE_SECRET_KEY;
    if (!secretKey) {
      console.error('Missing STRIPE_SECRET_KEY');
      return NextResponse.json({ error: 'Server configuration error' }, { status: 500 });
    }

    const stripe = new Stripe(secretKey, { apiVersion: '2025-02-24.acacia' });

    // Retrieve the session
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (session.payment_status !== 'paid') {
      return NextResponse.json({ error: 'Payment not completed' }, { status: 400 });
    }

    // Extract metadata
    const { beatId, beatTitle, licenseId, licenseName } = session.metadata || {};
    const amount = session.amount_total ? session.amount_total / 100 : 0; // Convert from cents
    const customerEmail = session.customer_details?.email || '';
    const customerName = session.customer_details?.name || customerEmail;

    const timestamp = new Date().toISOString();

    // Admin email
    const adminMailOptions = {
      from: process.env.EMAIL_USER || 'genesisrebornproductions@gmail.com',
      to: 'genesisrebornproductions@gmail.com',
      subject: `Beat Purchase: ${beatTitle} - ${customerName}`,
      html: `
        <h2>New Beat Purchase (Checkout Session)</h2>
        <p><strong>Submission Timestamp:</strong> ${timestamp}</p>
        <p><strong>Customer Name:</strong> ${customerName}</p>
        <p><strong>Customer Email:</strong> ${customerEmail}</p>
        <p><strong>Beat Title:</strong> ${beatTitle}</p>
        <p><strong>License Type:</strong> ${licenseName}</p>
        <p><strong>Price:</strong> $${amount.toFixed(2)}</p>
        <p><strong>Payment ID:</strong> ${session.payment_intent}</p>
        <p><strong>Session ID:</strong> ${sessionId}</p>
        <p><strong>Reply-To:</strong> ${customerEmail}</p>
        <p><em>Next Steps: Send the beat file to the customer via email or file sharing service.</em></p>
      `,
      replyTo: customerEmail
    };

    // Customer confirmation email
    const customerMailOptions = {
      from: process.env.EMAIL_USER || 'genesisrebornproductions@gmail.com',
      to: customerEmail,
      subject: `Purchase Confirmation: ${beatTitle}`,
      html: `
        <h2>Thank You for Your Beat Purchase!</h2>
        <p>Dear ${customerName},</p>
        <p>We've received your payment for <strong>${beatTitle}</strong> with <strong>${licenseName}</strong> license.</p>
        <p><strong>Purchase Details:</strong></p>
        <ul>
          <li><strong>Beat Title:</strong> ${beatTitle}</li>
          <li><strong>License:</strong> ${licenseName}</li>
          <li><strong>Price:</strong> $${amount.toFixed(2)}</li>
          <li><strong>Payment ID:</strong> ${session.payment_intent}</li>
        </ul>
        <p>You will receive your beat file in an email within 1-3 business days. If you have any questions, reply to this email.</p>
        <p>Best regards,<br>Genesis Reborn Productions</p>
      `,
      replyTo: process.env.EMAIL_USER || 'genesisrebornproductions@gmail.com'
    };

    const transporter = createTransporter();
    await Promise.all([
      transporter.sendMail(adminMailOptions),
      transporter.sendMail(customerMailOptions),
    ]);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error processing checkout success:', error);
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

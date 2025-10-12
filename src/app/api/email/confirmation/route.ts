import { NextRequest, NextResponse } from 'next/server';
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
  const data = await request.json();
  const { firstName, lastName, email, message } = data;
const name = firstName && lastName ? `${firstName} ${lastName}` : email;

  try {
    console.log("Request Data:", data);
    console.log("Name:", name);
    console.log("Email:", email);
    console.log("Message:", message);

    if (!firstName || !lastName || !email || !message) {
      return NextResponse.json({ error: 'Missing required fields: name, email, and message are required.' }, { status: 400 });
    }
    if (!isValidEmail(email)) {
      return NextResponse.json({ error: 'Invalid email address format.' }, { status: 400 });
    }

    // Parse the message to extract beat details
    // Message format: "Beat Purchase Confirmation: Beat Title: {title}, License Type: {license}, Price: ${price}, Payment ID: {id}"
    const beatTitleMatch = message.match(/Beat Title:\s*([^,]+)/);
    const licenseMatch = message.match(/License Type:\s*([^,]+)/);
    const priceMatch = message.match(/Price:\s*\$([0-9.]+)/);
    const paymentIdMatch = message.match(/Payment ID:\s*([^\s]+)/);

    const beatTitle = beatTitleMatch ? beatTitleMatch[1].trim() : 'N/A';
    const licenseType = licenseMatch ? licenseMatch[1].trim() : 'N/A';
    const price = priceMatch ? parseFloat(priceMatch[1]) : 0;
    const paymentId = paymentIdMatch ? paymentIdMatch[1].trim() : 'N/A';

    const timestamp = new Date().toISOString();

    // Detailed admin email
    const adminMailOptions = {
      from: process.env.EMAIL_USER || 'genesisrebornproductions@gmail.com',
      to: 'genesisrebornproductions@gmail.com',
      subject: `Beat Purchase: ${beatTitle} - ${name}`,
      html: `
        <h2>New Beat Purchase</h2>
        <p><strong>Submission Timestamp:</strong> ${timestamp}</p>
        <p><strong>Customer Name:</strong> ${name}</p>
        <p><strong>Customer Email:</strong> ${email}</p>
        <p><strong>Beat Title:</strong> ${beatTitle}</p>
        <p><strong>License Type:</strong> ${licenseType}</p>
        <p><strong>Price:</strong> $${price.toFixed(2)}</p>
        <p><strong>Payment ID:</strong> ${paymentId}</p>
        <p><strong>Reply-To:</strong> ${email}</p>
        <p><em>Next Steps: Send the beat file to the customer via email or file sharing service.</em></p>
      `,
      replyTo: email
    };

    // Customer confirmation email (optional, as Stripe handles payment confirmation)
    const customerMailOptions = {
      from: process.env.EMAIL_USER || 'genesisrebornproductions@gmail.com',
      to: email,
      subject: `Purchase Confirmation: ${beatTitle}`,
      html: `
        <h2>Thank You for Your Beat Purchase!</h2>
        <p>Dear ${name},</p>
        <p>We've received your payment for <strong>${beatTitle}</strong> with <strong>${licenseType}</strong> license.</p>
        <p><strong>Purchase Details:</strong></p>
        <ul>
          <li><strong>Beat Title:</strong> ${beatTitle}</li>
          <li><strong>License:</strong> ${licenseType}</li>
          <li><strong>Price:</strong> $${price.toFixed(2)}</li>
          <li><strong>Payment ID:</strong> ${paymentId}</li>
        </ul>
        <p>You will receive your beat file in an email within 1-3 business days. If you have any questions, reply to this email.</p>
        <p>Best regards,<br>Genesis Reborn Productions</p>
      `,
      replyTo: process.env.EMAIL_USER || 'genesisrebornproductions@gmail.com'
    };

    // Send both emails concurrently using a runtime-created transporter
    const transporter = createTransporter();
    await Promise.all([
      transporter.sendMail(customerMailOptions),
      transporter.sendMail(adminMailOptions),
    ]);

    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    console.error('SMTP Debug:', {
      user: process.env.EMAIL_USER,
      authMethod: 'App Password',
    });
    if (error instanceof Error) {
      console.error('Full error details:', {
        message: error.message,
      });
      return NextResponse.json({ 
        error: 'Failed to send email.',
        details: {
          message: error.message,
        }
      }, { status: 500 });
    } else {
      const errorDetails = error as { code?: string; response?: any };
      console.error('An unknown error occurred:', error);
      return NextResponse.json({
        error: 'An unknown error occurred.',
        details: { code: errorDetails.code, response: errorDetails.response },
      }, { status: 500 });
    }
  }
}

// Helper function to validate email addresses
function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}
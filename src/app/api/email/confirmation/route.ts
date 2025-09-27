import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

const createTransporter = () => nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_APP_PASSWORD,
  },
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

    // Create email options (customer and admin -  you might want to separate these into functions)
    const customerMailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Thank You for Your Purchase!', // More appropriate subject line
      html: `
        <p>Dear ${name},</p>
        <p>Thank you for your purchase! Your order confirmation is below:</p>
        <p>Message: ${message}</p> <p>Best regards,</p>
        <p>Your Company Name</p>
      `,
    };

    const adminMailOptions = {
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_USER,
      subject: 'New Beat Purchase',
      html: `
        <p>A new beat has been purchased:</p>
        <p>Customer Name: ${name}</p>
        <p>Customer Email: ${email}</p> 
        <p>Message: ${message}</p>
      `,
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
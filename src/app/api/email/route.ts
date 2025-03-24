import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

// Create a transporter object using SMTP transport with app password
const transporter = nodemailer.createTransport({
  service: 'gmail',
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL_USER || 'genesisrebornproductions@gmail.com',
    pass: process.env.EMAIL_APP_PASSWORD
  },
  debug: true,
  tls: {
    rejectUnauthorized: false
  }
});

// Verify the transporter connection
transporter.verify(function(error, success) {
  if (error) {
    console.error('SMTP connection error:', error);
  } else {
    console.log('SMTP server is ready to take our messages');
  }
});

export async function POST(request: NextRequest) {
  try {
    const { firstName, lastName, email, beatTitle, licenseType, price } = await request.json();

    // Validate required fields
    if (!firstName || !lastName || !email || !beatTitle || !licenseType) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }
    
    // Combine first and last name
    const name = `${firstName} ${lastName}`;

    // Email content
    const mailOptions = {
      from: process.env.EMAIL_USER || 'genesisrebornproductions@gmail.com',
      to: 'genesisrebornproductions@gmail.com',
      subject: `Beat Purchase Request: ${beatTitle}`,
      html: `
        <h2>New Beat Purchase Request</h2>
        <p><strong>Customer Name:</strong> ${name}</p>
        <p><strong>Customer Email:</strong> ${email}</p>
        <p><strong>Beat Title:</strong> ${beatTitle}</p>
        <p><strong>License Type:</strong> ${licenseType}</p>
        <p><strong>Price:</strong> $${price?.toFixed(2) || 'N/A'}</p>
        <p><strong>Reply-To:</strong> ${email}</p>
      `,
      replyTo: email
    };

    // Send email
    await transporter.sendMail(mailOptions);

    return NextResponse.json({ success: true });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('Error sending email:', error);
    return NextResponse.json(
      { error: `Failed to send email: ${errorMessage}` },
      { status: 500 }
    );
  }
}
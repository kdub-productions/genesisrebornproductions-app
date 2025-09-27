import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

const createTransporter = () => {
  return nodemailer.createTransport({
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
};

export async function POST(request: NextRequest) {
  try {
    const { name, email, message } = await request.json();

    if (!name || !email || !message) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const transporter = createTransporter();

    const mailOptions = {
      from: process.env.EMAIL_USER || 'genesisrebornproductions@gmail.com',
      to: 'genesisrebornproductions@gmail.com',
      subject: `Contact form message from ${name}`,
      html: `<p><strong>Name:</strong> ${name}</p>
             <p><strong>Email:</strong> ${email}</p>
             <p><strong>Message:</strong></p>
             <p>${message}</p>`,
      replyTo: email
    };

    await transporter.sendMail(mailOptions);

    return NextResponse.json({ success: true });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error('Contact API error:', message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

// Remove the deprecated config export
// export const config = {
//   api: {
//     bodyParser: false,
//   },
// };

// Add proper export for Next.js App Router
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const createTransporter = () => nodemailer.createTransport({
  service: 'gmail',
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL_USER || 'genesisrebornproductions@gmail.com',
    pass: process.env.EMAIL_APP_PASSWORD
  },
  debug: true,
  tls: { rejectUnauthorized: false }
});

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const name = formData.get('name') as string;
    const email = formData.get('email') as string;
    const selectedTier = formData.get('selectedTier') as string;
    const message = formData.get('message') as string;
    const files = formData.getAll('files') as File[];

    if (!name || !email || !selectedTier) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Convert Files to Buffers
    const attachments = await Promise.all(files.map(async (file) => {
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      
      return {
        filename: file.name,
        content: buffer,
        contentType: file.type,
      };
    }));

    const mailOptions = {
      from: process.env.EMAIL_USER || 'genesisrebornproductions@gmail.com',
      to: 'genesisrebornproductions@gmail.com',
      subject: `Mixing & Mastering Request: ${selectedTier}`,
      html: `
        <h2>New Mixing & Mastering Request</h2>
        <p><strong>Customer Name:</strong> ${name}</p>
        <p><strong>Customer Email:</strong> ${email}</p>
        <p><strong>Service Tier:</strong> ${selectedTier}</p>
        <p><strong>Additional Instructions:</strong> ${message || 'None provided'}</p>
        <p><strong>Files Attached:</strong> ${files.map(f => f.name).join(', ')}</p>
        <p><strong>Reply-To:</strong> ${email}</p>
      `,
      attachments,
      replyTo: email
    };

  const transporter = createTransporter();
  await transporter.sendMail(mailOptions);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error sending email:', error);
    return NextResponse.json(
      { error: 'Failed to send email' },
      { status: 500 }
    );
  }
}
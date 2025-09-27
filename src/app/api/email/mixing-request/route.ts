import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';

// Add proper export for Next.js App Router
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    // Ensure Resend API key is configured
    if (!process.env.RESEND_API_KEY) {
      console.error('Resend API key is not configured. RESEND_API_KEY is missing.');
      return NextResponse.json({ error: 'Resend API key not configured on server' }, { status: 500 });
    }

    const resend = new Resend(process.env.RESEND_API_KEY);
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

    // Convert Files to base64 for Resend attachments
    const attachments = await Promise.all(files.map(async (file) => {
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      const base64 = buffer.toString('base64');

      return {
        filename: file.name,
        content: base64,
        type: file.type,
      };
    }));

    const emailData = {
      from: 'Mixing Request <onboarding@resend.dev>', // Replace with your verified domain/email in Resend
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
      reply_to: email
    };

    const result = await resend.emails.send(emailData);

    return NextResponse.json({ success: true, id: result.data?.id });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error('Error sending email (mixing-request):', message, error);
    // Return the error message to aid debugging (consider removing details in production)
    return NextResponse.json(
      { error: `Failed to send email: ${message}` },
      { status: 500 }
    );
  }
}

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

// Hardcoded service tiers for backend lookup (matches frontend)
const serviceTiers = [
  {
    id: 'basic',
    name: 'Basic Mix',
    price: '$75',
    turnaround: '3-5 days',
    description: 'Perfect for indie artists and small projects needing professional sound quality.',
    features: [
      'Professional mixing of up to 20 tracks',
      'Basic EQ, compression, and effects',
      'Two revisions included',
      'MP3 and WAV delivery formats',
      'Basic stereo enhancement',
      'Basic noise reduction'
    ]
  },
  {
    id: 'standard',
    name: 'Standard Mix & Master',
    price: '$150',
    turnaround: '5-7 days',
    description: 'Our most popular package for artists looking for radio-ready sound.',
    features: [
      'Professional mixing of up to 40 tracks',
      'Advanced EQ, compression, and effects',
      'Professional mastering included',
      'Three revisions included',
      'All delivery formats (MP3, WAV, FLAC)',
      'Stem exports available',
      'Advanced stereo enhancement',
      'Detailed noise reduction'
    ]
  },
  {
    id: 'premium',
    name: 'Premium Mix & Master',
    price: '$250',
    turnaround: '7-10 days',
    description: 'The ultimate package for artists who demand the highest quality for their releases.',
    features: [
      'Professional mixing of unlimited tracks',
      'Premium EQ, compression, and effects',
      'Advanced mastering with analog emulation',
      'Unlimited revisions',
      'All delivery formats (MP3, WAV, FLAC)',
      'Stem exports included',
      'Priority support',
      'Vocal tuning and time alignment',
      'Advanced spatial processing',
      'Custom reference matching'
    ]
  },
  {
    id: 'vocal-prod',
    name: 'Vocal Production',
    price: '$100',
    turnaround: '3-5 days',
    description: 'Specialized service for vocal-focused tracks and artists.',
    features: [
      'Professional vocal tuning and timing',
      'Detailed vocal processing and effects',
      'Vocal doubling and harmonization',
      'Background vocal arrangement',
      'Two revisions included',
      'All delivery formats (MP3, WAV, FLAC)',
      'Stem exports available'
    ]
  },
  {
    id: 'vocal-splitting',
    name: 'Vocal Splitting',
    price: '$300',
    turnaround: '10-15 days',
    description: 'Advanced AI-powered service to isolate vocals from a mixed track for remixing, karaoke, or archival purposes.',
    features: [
      'High-quality vocal stem isolation from stereo mix',
      'Instrumental track generation (minus vocals)',
      'Delivery of separated vocal and instrumental WAV files',
      'Ideal for remixers, producers, and DJs needing acapellas',
      'One revision included for artifact review',
      'Utilizes cutting-edge source separation technology',
      'Note: Quality depends heavily on source material complexity'
    ]
  },
];

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const name = formData.get('name') as string;
    const email = formData.get('email') as string;
    const selectedTierId = formData.get('selectedTierId') as string;
    const message = formData.get('message') as string;
    const files = formData.getAll('files') as File[];

    if (!name || !email || !selectedTierId) {
      return NextResponse.json(
        { error: 'Missing required fields: name, email, and selectedTierId' },
        { status: 400 }
      );
    }

    const selectedTier = serviceTiers.find(tier => tier.id === selectedTierId);
    if (!selectedTier) {
      return NextResponse.json(
        { error: 'Invalid service tier selected' },
        { status: 400 }
      );
    }

    // Validate files: Check total size (Gmail limit ~25MB, warn if >20MB)
    let totalSize = 0;
    const fileDetails = files.map(file => {
      totalSize += file.size;
      return {
        name: file.name,
        size: (file.size / (1024 * 1024)).toFixed(2) + ' MB',
        type: file.type || 'Unknown'
      };
    });

    if (totalSize > 20 * 1024 * 1024) { // 20MB warning
      console.warn('Total attachments size exceeds 20MB, may fail to send via Gmail');
    }

    // Convert Files to buffers for nodemailer attachments
    const attachments = await Promise.all(files.map(async (file) => {
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      return {
        filename: file.name,
        content: buffer,
        contentType: file.type,
      };
    }));

    const transporter = createTransporter();
    const timestamp = new Date().toISOString();

    // Detailed admin email
    const adminMailOptions = {
      from: process.env.EMAIL_USER || 'genesisrebornproductions@gmail.com',
      to: 'genesisrebornproductions@gmail.com',
      subject: `Mixing & Mastering Request: ${selectedTier.name} - ${name}`,
      html: `
        <h2>New Mixing & Mastering Request</h2>
        <p><strong>Submission Timestamp:</strong> ${timestamp}</p>
        <p><strong>Customer Name:</strong> ${name}</p>
        <p><strong>Customer Email:</strong> ${email}</p>
        <p><strong>Service Tier:</strong> ${selectedTier.name}</p>
        <p><strong>Price:</strong> ${selectedTier.price}</p>
        <p><strong>Turnaround Time:</strong> ${selectedTier.turnaround}</p>
        <p><strong>Description:</strong> ${selectedTier.description}</p>
        <h3>Features Included:</h3>
        <ul>
          ${selectedTier.features.map(feature => `<li>${feature}</li>`).join('')}
        </ul>
        <p><strong>Additional Instructions:</strong> ${message || 'None provided'}</p>
        <h3>Files Attached (${files.length} files, Total Size: ${(totalSize / (1024 * 1024)).toFixed(2)} MB):</h3>
        <ul>
          ${fileDetails.map(file => `<li><strong>${file.name}</strong> - ${file.size} - ${file.type}</li>`).join('')}
        </ul>
        <p><strong>Reply-To:</strong> ${email}</p>
        <p><em>Next Steps: Review files, send invoice via Stripe or manually, then process the mix/master.</em></p>
      `,
      attachments,
      replyTo: email
    };

    await transporter.sendMail(adminMailOptions);

    // Confirmation email to user
    const userMailOptions = {
      from: process.env.EMAIL_USER || 'genesisrebornproductions@gmail.com',
      to: email,
      subject: `Confirmation: Your ${selectedTier.name} Request Submitted`,
      html: `
        <h2>Thank You for Your Mixing & Mastering Request!</h2>
        <p>Dear ${name},</p>
        <p>We've received your request for <strong>${selectedTier.name}</strong> and are excited to work on your project!</p>
        <p><strong>Service Details:</strong></p>
        <ul>
          <li><strong>Price:</strong> ${selectedTier.price}</li>
          <li><strong>Turnaround:</strong> ${selectedTier.turnaround}</li>
          <li><strong>Features:</strong> ${selectedTier.features.join(', ')}</li>
        </ul>
        <p><strong>Files Received:</strong> ${files.length > 0 ? files.map(f => f.name).join(', ') : 'None (link provided in message)'}</p>
        <p><strong>Your Instructions:</strong> ${message || 'None'}</p>
        <p>We'll review your files and send an invoice shortly. Once payment is confirmed, we'll begin processing. Expect updates within 24 hours.</p>
        <p>If you have any questions, reply to this email.</p>
        <p>Best regards,<br>Genesis Reborn Productions</p>
      `,
      replyTo: process.env.EMAIL_USER || 'genesisrebornproductions@gmail.com'
    };

    await transporter.sendMail(userMailOptions);

    return NextResponse.json({ success: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error('Error sending email (mixing-request):', message, error);
    // Distinguish errors: Auth, size, etc.
    let errorMsg = 'Failed to send email. Please try again.';
    if (message.includes('auth')) {
      errorMsg = 'Email authentication failed. Check server config.';
    } else if (message.includes('size') || message.includes('limit')) {
      errorMsg = 'Attachments too large. Use file links instead.';
    }
    if (process.env.NODE_ENV === 'development') {
      errorMsg += ` (Dev: ${message})`;
    }
    return NextResponse.json({ error: errorMsg }, { status: 500 });
  }
}

import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { Beat } from '@/types/beats';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();

    const title = formData.get('title') as string;
    const genre = formData.get('genre') as string;
    const price = parseFloat(formData.get('price') as string);
    const licenseName = formData.get('licenseName') as string;
    const licenseDescription = formData.get('licenseDescription') as string;
    const paymentLink = formData.get('paymentLink') as string;
    const coverArt = formData.get('coverArt') as File;
    const audioPreview = formData.get('audioPreview') as File;

    if (!title || !genre || !price || !licenseName || !licenseDescription || !paymentLink || !coverArt || !audioPreview) {
      return new NextResponse('Missing required fields', { status: 400 });
    }

    // Read existing beats
    const beatsFilePath = path.join(process.cwd(), 'public', 'data', 'beats.json');
    const beatsData = fs.existsSync(beatsFilePath) ? JSON.parse(fs.readFileSync(beatsFilePath, 'utf8')) : [];
    const nextId = beatsData.length > 0 ? Math.max(...beatsData.map((b: Beat) => b.id)) + 1 : 1;

    // Save cover art
    const coverArtDir = path.join(process.cwd(), 'public', 'images', 'BeatCoverArt');
    if (!fs.existsSync(coverArtDir)) {
      fs.mkdirSync(coverArtDir, { recursive: true });
    }
    const coverArtExt = path.extname(coverArt.name);
    const coverArtFileName = `${title.replace(/\s+/g, '_')}_cover${coverArtExt}`;
    const coverArtPath = path.join(coverArtDir, coverArtFileName);
    const coverArtBuffer = Buffer.from(await coverArt.arrayBuffer());
    fs.writeFileSync(coverArtPath, coverArtBuffer);
    const coverArtUrl = `/images/BeatCoverArt/${coverArtFileName}`;

    // Save audio preview
    const audioDir = path.join(process.cwd(), 'public', 'audio', 'previews');
    if (!fs.existsSync(audioDir)) {
      fs.mkdirSync(audioDir, { recursive: true });
    }
    const audioExt = path.extname(audioPreview.name);
    const audioFileName = `${title.replace(/\s+/g, '_')}_preview${audioExt}`;
    const audioPath = path.join(audioDir, audioFileName);
    const audioBuffer = Buffer.from(await audioPreview.arrayBuffer());
    fs.writeFileSync(audioPath, audioBuffer);
    const audioUrl = `/audio/previews/${audioFileName}`;

    // Create new beat
    const newBeat: Beat = {
      id: nextId,
      title,
      genre,
      artwork: coverArtUrl,
      audioPreview: audioUrl,
      fullAudioId: nextId, // Assuming full audio ID matches beat ID
      price,
      license: {
        id: nextId,
        name: licenseName,
        price,
        description: licenseDescription,
        paymentLink,
      },
      isSold: false,
    };

    // Add to beats array
    beatsData.push(newBeat);

    // Save updated beats
    fs.writeFileSync(beatsFilePath, JSON.stringify(beatsData, null, 2));

    return NextResponse.json({ message: 'Beat uploaded successfully', beat: newBeat });
  } catch (error) {
    console.error('Error uploading beat:', error);
    return new NextResponse('Internal server error', { status: 500 });
  }
}

// src/app/api/beats/route.ts
import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET() {
  try {
    const filePath = path.join(process.cwd(), 'public', 'data', 'beats.json');
    const fileContents = fs.readFileSync(filePath, 'utf8');
    const beatsData = JSON.parse(fileContents);
    return NextResponse.json(beatsData);
  } catch (error) {
    console.error('Error fetching beats:', error);
    return new NextResponse(JSON.stringify({ error: 'Failed to fetch beats' }), { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const updatedBeats = await request.json();
    const filePath = path.join(process.cwd(), 'public', 'data', 'beats.json');
    fs.writeFileSync(filePath, JSON.stringify(updatedBeats, null, 2));
    return NextResponse.json({ message: 'Beats updated successfully' });
  } catch (error) {
    console.error('Error updating beats:', error);
    return new NextResponse(JSON.stringify({ error: 'Failed to update beats' }), { status: 500 });
  }
}

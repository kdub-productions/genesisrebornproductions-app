// src/app/api/beats/route.ts
import { NextResponse } from 'next/server';
import { beatsData } from '../../../beats';

export async function GET() {
  try {
    return NextResponse.json(beatsData);
  } catch (error) {
    console.error('Error fetching beats:', error);
    return new NextResponse(JSON.stringify({ error: 'Failed to fetch beats' }), { status: 500 });
  }
}

import { NextResponse } from 'next/server';
import { fetchInstagramPosts } from '@/utils/socialMediaApi';

export async function GET() {
  try {
    const instagramPosts = await fetchInstagramPosts();
    
    return NextResponse.json({
      success: true,
      data: instagramPosts
    });
  } catch (error) {
    console.error('Error in Instagram API route:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch Instagram posts' },
      { status: 500 }
    );
  }
}
import { NextResponse } from 'next/server';
import { fetchXPosts } from '@/utils/socialMediaApi';

export async function GET() {
  try {
    const xPosts = await fetchXPosts();
    
    return NextResponse.json({
      success: true,
      data: xPosts
    });
  } catch (error) {
    console.error('Error in X API route:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch X posts' },
      { status: 500 }
    );
  }
}
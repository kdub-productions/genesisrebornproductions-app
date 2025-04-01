import { NextResponse } from 'next/server';
import { fetchDiscordPosts } from '@/utils/socialMediaApi';

export async function GET() {
  try {
    const discordPosts = await fetchDiscordPosts();
    
    return NextResponse.json({
      success: true,
      data: discordPosts
    });
  } catch (error) {
    console.error('Error in Discord API route:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch Discord posts' },
      { status: 500 }
    );
  }
}
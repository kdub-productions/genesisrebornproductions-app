import { NextResponse } from 'next/server';
import { fetchInstagramPosts, fetchXPosts, fetchDiscordPosts } from '@/utils/socialMediaApi';

export async function GET() {
  try {
    // Directly call the API functions instead of making HTTP requests
    // This avoids the self-referential loop and connection issues
    const [instagramData, xData, discordData] = await Promise.all([
      fetchInstagramPosts(),
      fetchXPosts(),
      fetchDiscordPosts()
    ]);

    return NextResponse.json({
      success: true,
      data: {
        instagram: instagramData,
        x: xData,
        discord: discordData,
      },
    });
  } catch (error) {
    console.error('Error fetching social media data:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch social media data' },
      { status: 500 }
    );
  }
}

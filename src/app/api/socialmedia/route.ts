import { NextRequest, NextResponse } from 'next/server';
import { fetchInstagramPosts, fetchXPosts, fetchDiscordPosts } from '@/utils/socialMediaApi';
import { InstagramPost, XPost, DiscordPost } from '@/types/socialmedia';

// Cache mechanism to avoid hitting API rate limits
let cachedData = {
  instagram: null as InstagramPost[] | null,
  x: null as XPost[] | null,
  discord: null as DiscordPost[] | null,
  lastFetched: {
    instagram: 0,
    x: 0,
    discord: 0
  }
};

// Cache expiration time (30 minutes)
const CACHE_EXPIRATION = 30 * 60 * 1000;

export async function GET(request: NextRequest) {
  console.log("Starting /api/socialmedia route");
  const searchParams = request.nextUrl.searchParams;
  const platform = searchParams.get('platform');
  const forceRefresh = searchParams.get('refresh') === 'true';

  try {
    // Function to get data for a specific platform with caching
    async function getPlatformData(platform: 'instagram' | 'x' | 'discord') {
      console.log(`Starting getPlatformData for ${platform}`);
      const now = Date.now();
      const lastFetched = cachedData.lastFetched[platform];
      const isCacheExpired = now - lastFetched > CACHE_EXPIRATION;
      
      // Use cached data if available and not expired
      if (cachedData[platform] && !isCacheExpired && !forceRefresh) {
        console.log(`Using cached ${platform} data`);
        console.log(`Finished getPlatformData for ${platform}`);
        return cachedData[platform];
      }
      
      // Fetch fresh data
      console.log(`Fetching fresh ${platform} data`);
      let data;
      
      try {
        console.log(`Starting switch statement for ${platform}`);
        switch (platform) {
          case 'instagram':
            data = await fetchInstagramPosts();
            break;
          case 'x':
            data = await fetchXPosts();
            break;
          case 'discord':
            data = await fetchDiscordPosts();
            break;
        }
        console.log(`Finished switch statement for ${platform}`);
        
        // If we got data, update the cache
        if (data && data.length > 0) {
          switch (platform) {
            case 'instagram':
              cachedData.instagram = data as InstagramPost[];
              break;
            case 'x':
              cachedData.x = data as XPost[];
              break;
            case 'discord':
              cachedData.discord = data as DiscordPost[];
              break;
          }
          cachedData.lastFetched[platform] = now;
          console.log(`Finished getPlatformData for ${platform}`);
          return data;
        }
      } catch (error) {
        console.error(`Error fetching ${platform} data:`, error);
      }
      
      // If API call failed or returned no data, return empty array with appropriate log message
      console.log(`No data available for ${platform}, returning empty array`);
      console.log(`Finished getPlatformData for ${platform}`);
      return [];

    }
    
    let data;
    
    // Handle specific platform request
    if (platform === 'instagram' || platform === 'x' || platform === 'discord') {
      console.log(`Fetching data for specific platform: ${platform}`);
      data = await getPlatformData(platform as 'instagram' | 'x' | 'discord');
      console.log(`Finished fetching data for specific platform: ${platform}`);
    } else {
      console.log("Fetching data for all platforms");
      // Fetch data for all platforms in parallel
      const [instagramData, xData, discordData] = await Promise.all([
        getPlatformData('instagram'),
        getPlatformData('x'),
        getPlatformData('discord')
      ]);
      
      data = {
        instagram: instagramData,
        x: xData,
        discord: discordData
      };
      console.log("Finished fetching data for all platforms");
    }
    console.log("Sending response:", { success: true, data });
    return NextResponse.json({ success: true, data }, { status: 200 });
  } catch (error) {
    console.error('Error fetching social media data:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch social media data' },
      { status: 500 }
    );
  } finally {
    console.log("Finished /api/socialmedia route");
  }
}

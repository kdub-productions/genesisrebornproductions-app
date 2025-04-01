/**
 * Social Media API Integration Utilities
 * 
 * This file contains functions to fetch data from Instagram, Twitter (X), and Discord APIs
 * using proper authentication and formatting the responses to match our application's data structure.
 */

import { InstagramPost, XPost, DiscordPost } from '@/types/socialmedia';
import { mockInstagramPosts } from './instagramSocialMediaData';
// Instagram uses manually updated data, while Twitter (X) and Discord use real API data only

// Instagram posts (using manually updated data)
export async function fetchInstagramPosts(): Promise<InstagramPost[]> {
  try {
    // Instagram uses manually updated data instead of API integration
    // This allows for manual control of content without API restrictions
    console.log('Using manually updated Instagram data');
    return mockInstagramPosts;
  } catch (error) {
    console.error('Error fetching Instagram posts:', error);
    return [];
  }
}

// Twitter (X) API integration
export async function fetchXPosts(): Promise<XPost[]> {
  console.log("Fetching fresh x data");
  try {
    // Check if API keys are available
    const bearerToken = process.env.TWITTER_BEARER_TOKEN;
    const username = process.env.TWITTER_USERNAME;
    
    if (!bearerToken || !username) {
      console.warn('Twitter bearer token or username not found in environment variables');
      return [];
    }
    
    // Twitter API v2 implementation
    // First get the user ID from the username
    const userResponse = await fetch(
      `https://api.twitter.com/2/users/by/username/${username}`,
      {
        headers: {
          Authorization: `Bearer ${bearerToken}`,
        },
      }
    );
    
    if (!userResponse.ok) {
      console.error('Failed to fetch Twitter user:', await userResponse.text());
      return [];
    }
    
    const userData = await userResponse.json();
    const userId = userData.data?.id;
    
    if (!userId) {
      console.error('Could not find Twitter user ID');
      return [];
    }
    
    // Now fetch the user's tweets
    const tweetsResponse = await fetch(
      `https://api.twitter.com/2/users/${userId}/tweets?max_results=10&tweet.fields=created_at,public_metrics&expansions=author_id`,
      {
        headers: {
          Authorization: `Bearer ${bearerToken}`,
        },
      }
    );
    
    if (!tweetsResponse.ok) {
      console.error('Failed to fetch tweets:', await tweetsResponse.text());
      return [];
    }
    
    const tweetsData = await tweetsResponse.json();
    
    if (!tweetsData.data || !Array.isArray(tweetsData.data)) {
      console.log("No tweets found, returning empty array");
      return [];
    }
    
    // Transform the Twitter API response to match our XPost interface
    return tweetsData.data.map((tweet: any) => ({
      id: tweet.id,
      text: tweet.text,
      likes: tweet.public_metrics?.like_count || 0,
      retweets: tweet.public_metrics?.retweet_count || 0,
      timestamp: tweet.created_at,
      url: `https://twitter.com/${username}/status/${tweet.id}`
    }));
  } catch (error) {
    console.error('Error fetching X posts:', error);
    return [];
  }
}

// Discord API integration
export async function fetchDiscordPosts(): Promise<DiscordPost[]> {
  console.log("Fetching fresh discord data");
  try {
    // Check if API keys are available
    const token = process.env.DISCORD_BOT_TOKEN;
    const serverId = process.env.DISCORD_SERVER_ID;
    const channelId = process.env.DISCORD_CHANNEL_ID;

    if (!token || !serverId || !channelId || token === 'your_discord_bot_token') {
      console.warn('Discord credentials not found or invalid in environment variables');
      console.log('No Discord credentials available, returning empty array');
      return [];
    }
    
    // Discord API implementation using Discord Bot API
    console.log(`Attempting to fetch messages from channel ID: ${channelId}`);
    const response = await fetch(
      `https://discord.com/api/v10/channels/${channelId}/messages?limit=10`,
      {
        headers: {
          Authorization: `Bot ${token}`,
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) {
      const errorData = await response.text();
      let errorJson;
      try {
        errorJson = JSON.parse(errorData);
      } catch (e) {
        // If not JSON, use the raw text
        errorJson = { message: errorData };
      }
      
      console.error(`Failed to fetch Discord messages: Status ${response.status}`);
      console.error(`Error details: ${errorData}`);
      
      // Provide more specific error messages and troubleshooting steps based on common Discord API errors
      if (response.status === 403) {
        console.error('Permission error: The bot does not have access to this channel.');
        console.error('Make sure the bot is invited to the server with proper permissions:');
        console.error('1. The bot needs "Read Messages/View Channels" permission');
        console.error('2. The bot needs access to the specific channel');
        console.error('3. Check if the bot token is valid and not expired');
        console.error('4. Ensure the bot has been added to the server with the correct scopes');
        console.error('5. Try regenerating the bot token in the Discord Developer Portal');
        
        // Additional guidance for fixing 403 errors
        console.error('\nTo fix this issue:');
        console.error('1. Go to Discord Developer Portal: https://discord.com/developers/applications');
        console.error('2. Select your application and go to "Bot" section');
        console.error('3. Under "Privileged Gateway Intents", enable "Message Content Intent"');
        console.error('4. Generate a new invite URL with proper scopes from the "OAuth2" section:');
        console.error('   - Required scopes: bot');
        console.error('   - Required bot permissions: Read Messages/View Channels, Read Message History');
        console.error('5. Use the generated URL to add the bot to your server again');
      } else if (response.status === 401) {
        console.error('Authentication error: The bot token is invalid or expired');
        console.error('Please regenerate your bot token in the Discord Developer Portal');
      } else if (response.status === 404) {
        console.error('Channel not found: The specified channel ID does not exist or the bot cannot see it');
        console.error(`Check if channel ID ${channelId} is correct and visible to the bot`);
      } else if (response.status === 429) {
        console.error('Rate limit exceeded: Too many requests to the Discord API');
        console.error('Please wait before trying again');
      }
      
      console.log('Failed to fetch Discord data, returning empty array');
      return [];
    }

    const messagesData = await response.json();
    
    if (!Array.isArray(messagesData)) {
      console.log("No Discord messages found or invalid response format");
      console.log('Invalid Discord data format, returning empty array');
      return [];
    }

    // Transform the Discord API response to match our DiscordPost interface
    return messagesData.map((message: any) => ({
      id: message.id,
      title: message.type === 0 ? 'Message' : 'Announcement',
      content: message.content,
      author: message.author?.username || 'Unknown',
      timestamp: message.timestamp,
      channel: channelId
    }));
  } catch (error) {
    console.error('Error fetching Discord posts:', error);
    return [];
  }
}

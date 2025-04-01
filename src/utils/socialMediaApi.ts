/**
 * Social Media API Integration Utilities
 * 
 * This file contains functions to fetch data from Instagram, Twitter (X), and Discord APIs
 * using proper authentication and formatting the responses to match our application's data structure.
 */

import { InstagramPost, XPost, DiscordPost } from '@/types/socialmedia';

// Instagram posts (using mock data only)
export async function fetchInstagramPosts(): Promise<InstagramPost[]> {
  try {
    // Instagram API integration has been removed
    // Using mock data for Instagram posts
    console.log('Using mock Instagram data');
    const { mockInstagramPosts } = await import('./instagramSocialMediaData');
    return mockInstagramPosts;
  } catch (error) {
    console.error('Error fetching Instagram posts:', error);
    return [];
  }
}

// Twitter (X) API integration
export async function fetchXPosts(): Promise<XPost[]> {
  console.log("Starting fetchXPosts");
  try {
    // Check if API keys are available
    const apiKey = process.env.TWITTER_API_KEY;
    const apiKeySecret = process.env.TWITTER_API_KEY_SECRET;
    const accessToken = process.env.TWITTER_ACCESS_TOKEN;
    const accessTokenSecret = process.env.TWITTER_ACCESS_TOKEN_SECRET;
    const bearerToken = process.env.TWITTER_BEARER_TOKEN;
    const username = process.env.TWITTER_USERNAME;

    if (!bearerToken || !apiKey || !apiKeySecret || !accessToken || !accessTokenSecret || !username) {
      console.warn('Twitter credentials not found in environment variables');
      return [];
    }

    // Twitter API v2 endpoint for user timeline
    // Note: You'll need to replace 'username' with your actual Twitter username
    
    console.log("Fetching user ID for username:", username);
    // First, get the user ID from the username
    const userResponse = await fetch(
      `https://api.twitter.com/2/users/by/username/${username}`,
      {
        headers: {
          Authorization: `Bearer ${bearerToken}`,
        },
      }
    );

    if (!userResponse.ok) {
      console.error("Error fetching user ID:", userResponse.status);
      throw new Error(`Twitter API error: ${userResponse.status}`);
    }

    const userData = await userResponse.json();
    console.log("User data:", userData);
    const userId = userData.data.id;

    console.log("Fetching tweets for user ID:", userId);
    // Then, get the user's tweets
    const tweetsResponse = await fetch(
      `https://api.twitter.com/2/users/${userId}/tweets?max_results=10&tweet.fields=created_at,public_metrics&expansions=attachments.media_keys&media.fields=url,preview_image_url`,
      {
        headers: {
          Authorization: `Bearer ${bearerToken}`,
        },
      }
    );

    if (!tweetsResponse.ok) {
      console.error("Error fetching tweets:", tweetsResponse.status);
      throw new Error(`Twitter API error: ${tweetsResponse.status}`);
    }

    const tweetsData = await tweetsResponse.json();
    console.log("Tweets data:", tweetsData);
    
    // Transform the Twitter API response to match our application's data structure
    const xPosts = tweetsData.data.slice(0, 6).map((tweet: any) => ({
      id: tweet.id,
      text: tweet.text,
      likes: tweet.public_metrics?.like_count || 0,
      retweets: tweet.public_metrics?.retweet_count || 0,
      timestamp: tweet.created_at,
      url: `https://twitter.com/${username}/status/${tweet.id}`
    }));
    console.log("Transformed X posts:", xPosts);
    return xPosts;
  } catch (error) {
    console.error('Error fetching X posts:', error);
    return [];
  } finally {
    console.log("Finished fetchXPosts");
  }
}

// Discord API integration
export async function fetchDiscordPosts(): Promise<DiscordPost[]> {
  try {
    // Check if API token is available
    const discordBotToken = process.env.DISCORD_BOT_TOKEN;
    const discordChannelId = process.env.DISCORD_CHANNEL_ID;
    const discordServerId = process.env.DISCORD_SERVER_ID;
    
    if (!discordBotToken || !discordChannelId) {
      console.warn('Discord credentials not found in environment variables');
      return [];
    }

    // Discord API endpoint for channel messages
    const response = await fetch(
      `https://discord.com/api/v10/channels/${discordChannelId}/messages?limit=10`,
      {
        headers: {
          Authorization: `Bot ${discordBotToken}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Discord API error: ${response.status}`);
    }

    const messages = await response.json();
    
    // Transform the Discord API response to match our application's data structure
    return messages.slice(0, 6).map((message: any) => {
      // Extract title from message content (first line or first 30 chars)
      const contentLines = message.content.split('\n');
      const title = contentLines[0].length > 30 
        ? contentLines[0].substring(0, 30) + '...' 
        : contentLines[0] || 'Discord Message';
      
      // Rest of the content
      const content = contentLines.length > 1 
        ? contentLines.slice(1).join('\n') 
        : message.content.length > 30 
          ? message.content.substring(30) 
          : 'Check out our Discord channel!';

      return {
        id: message.id,
        title,
        content,
        author: message.author.username,
        timestamp: message.timestamp,
        channel: message.channel_id === discordChannelId ? 'announcements' : 'general'
      };
    });
  } catch (error) {
    console.error('Error fetching Discord posts:', error);
    return [];
  }
}

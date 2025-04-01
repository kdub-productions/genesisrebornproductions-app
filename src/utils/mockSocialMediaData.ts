/**
 * DEPRECATED - This file is no longer used
 * 
 * This file previously contained mock data for social media platforms when API keys were not available.
 * The application now uses only real API data for Twitter (X) and Discord.
 * Instagram data is managed through instagramSocialMediaData.ts.
 */

import { InstagramPost, XPost, DiscordPost } from '@/types/socialmedia';

// DEPRECATED - These mock posts are no longer used
// The application now uses only real API data
// Keeping this file for reference only

// Mock X (Twitter) posts - NOT USED
/* 
export const mockXPosts: XPost[] = [
  {
    id: 'mock-x-1',
    text: 'Just dropped some new beats on our website! Check them out and let us know what you think. #MusicProduction #NewBeats',
    likes: 42,
    retweets: 12,
    timestamp: new Date().toISOString(),
    url: 'https://twitter.com/GenesisReborn'
  },
  {
    id: 'mock-x-2',
    text: 'Working on something special in the studio today. Stay tuned for updates! #StudioLife #ComingSoon',
    likes: 28,
    retweets: 5,
    timestamp: new Date(Date.now() - 86400000 * 2).toISOString(), // 2 days ago
    url: 'https://twitter.com/GenesisReborn'
  }
];
*/

// Mock Discord posts - NOT USED
/*
export const mockDiscordPosts: DiscordPost[] = [
  {
    id: 'mock-discord-1',
    title: 'New Beat Pack Release',
    content: 'We just released a new beat pack on our website! Check it out and let us know what you think.',
    author: 'GenesisReborn',
    timestamp: new Date().toISOString(),
    channel: 'announcements'
  },
  {
    id: 'mock-discord-2',
    title: 'Community Feedback',
    content: 'What kind of beats would you like to see more of? Drop your suggestions below!',
    author: 'GenesisReborn',
    timestamp: new Date(Date.now() - 86400000 * 3).toISOString(), // 3 days ago
    channel: 'community'
  }
];
*/
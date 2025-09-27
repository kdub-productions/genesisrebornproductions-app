/**
 * Mock Social Media Data
 * 
 * This file contains mock data for social media platforms when API keys are not available.
 * Update this file manually to change the displayed content.
 */

import { InstagramPost } from '@/types/socialmedia';

// Real Instagram posts (manually updated)
export const mockInstagramPosts: InstagramPost[] = [
  {
    id: 'real-ig-1',
    imageUrl: '/images/instagram/BetterDays.jpg',
    caption: 'Beats are now available on our website go check it out. #beats #music #newbeats #newbuisness https://genesisrebornproductions.vercel.app/beatsforsale',
    timestamp: new Date().toISOString(),
    url: 'https://www.instagram.com/genesis_reborn_productions/p/DHm6jWfM2Z8/'
  },
]
 //template post for instagram {
 //template post for instagram   id: 'real-ig-2',
 //template post for instagram   imageUrl: '/images/instagram/post2.svg',
 //template post for instagram   caption: 'Behind the scenes at our studio. Working on something special for you all! #StudioLife #BehindTheScenes',
 //template post for instagram   timestamp: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
 //template post for instagram   url: ''
 //template post for instagram },

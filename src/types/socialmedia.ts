// Types for social media data

export interface InstagramPost {
  id: string;
  imageUrl: string;
  caption: string;
  timestamp: string;
  url: string;
}

export interface XPost {
  id: string;
  text: string;
  likes: number;
  retweets: number;
  timestamp: string;
  url: string;
}

export interface DiscordPost {
  id: string;
  title: string;
  content: string;
  author: string;
  timestamp: string;
  channel: string;
}

export interface SocialMediaData {
  instagram?: InstagramPost[];
  x?: XPost[];
  discord?: DiscordPost[];
}

export interface ApiResponse {
  success: boolean;
  data: SocialMediaData | InstagramPost[] | XPost[] | DiscordPost[];
  error?: string;
}
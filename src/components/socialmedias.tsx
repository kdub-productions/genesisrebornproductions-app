"use client";

import { useEffect, useState } from 'react';
import '@/styles/socialmediapage.css';
import { InstagramPost, XPost, DiscordPost, ApiResponse } from '@/types/socialmedia';

interface SocialMediasProps {
  setLoading: (loading: boolean) => void;
}

const SocialMediasComponent = ({ setLoading }: SocialMediasProps) => {
  const [instagramPosts, setInstagramPosts] = useState<InstagramPost[]>([]);
  const [xPosts, setXPosts] = useState<XPost[]>([]);
  const [discordPosts, setDiscordPosts] = useState<DiscordPost[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [activePlatform, setActivePlatform] = useState<string | null>(null);

  const fetchSocialMediaData = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/socialmedia');
      
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      
      const data: ApiResponse = await response.json();
      
      if (!data.success) {
        throw new Error(data.error || 'Failed to fetch social media data');
      }
      
      // Handle the data based on its structure
      if ('instagram' in data.data) {
        // All platforms data
        const allData = data.data;
        setInstagramPosts(allData.instagram || []);
        setXPosts(allData.x || []);
        setDiscordPosts(allData.discord || []);
      } else {
        // Single platform data
        // This branch shouldn't be reached with the current implementation
        // but is included for future flexibility
      }
      
      setError(null);
    } catch (err) {
      console.error('Error fetching social media data:', err);
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSocialMediaData();
    return () => setLoading(true); // Reset on unmount
  }, [setLoading]);

  const handlePlatformFilter = (platform: string | null) => {
    setActivePlatform(platform === activePlatform ? null : platform);
  };

  const formatDate = (timestamp: string) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="social-media-container">
      {error && <div className="error-message">Error: {error}</div>}
      
      <div className="platform-filters">
        <button 
          className={`filter-button ${activePlatform === null ? 'active' : ''}`}
          onClick={() => handlePlatformFilter(null)}
        >
          All
        </button>
        <button 
          className={`filter-button ${activePlatform === 'instagram' ? 'active' : ''}`}
          onClick={() => handlePlatformFilter('instagram')}
        >
          Instagram
        </button>
        <button 
          className={`filter-button ${activePlatform === 'x' ? 'active' : ''}`}
          onClick={() => handlePlatformFilter('x')}
        >
          X
        </button>
        <button 
          className={`filter-button ${activePlatform === 'discord' ? 'active' : ''}`}
          onClick={() => handlePlatformFilter('discord')}
        >
          Discord
        </button>
      </div>
      
      <div className="social-media-grid-api">
        {(activePlatform === null || activePlatform === 'instagram') && (
          <div className="instagram-grid">
            <p className="social-media-platform-title">Instagram</p>
            <div className="instagram-posts">
              {instagramPosts.length > 0 ? (
                instagramPosts.map((post) => (
                  <div key={post.id} className="instagram-post">
                    <a href={post.url} target="_blank" rel="noopener noreferrer">
                      <img src={post.imageUrl} alt={post.caption} className="instagram-image" />
                      <div className="instagram-content">
                        <p className="instagram-caption">{post.caption}</p>
                        <div className="instagram-meta">
                          <span className="instagram-date">{formatDate(post.timestamp)}</span>
                        </div>
                      </div>
                    </a>
                  </div>
                ))
              ) : (
                <p className="no-posts">No Instagram posts to display</p>
              )}
            </div>
          </div>
        )}
        
        {(activePlatform === null || activePlatform === 'x') && (
          <div className="x-grid">
            <p className="social-media-platform-title">X</p>
            <div className="x-posts">
              {xPosts.length > 0 ? (
                xPosts.map((post) => (
                  <div key={post.id} className="x-post">
                    <a href={post.url} target="_blank" rel="noopener noreferrer">
                      <div className="x-content">
                        <p className="x-text">{post.text}</p>
                        <div className="x-meta">
                          <span className="x-likes">{post.likes} likes</span>
                          <span className="x-retweets">{post.retweets} retweets</span>
                          <span className="x-date">{formatDate(post.timestamp)}</span>
                        </div>
                      </div>
                    </a>
                  </div>
                ))
              ) : (
                <p className="no-posts">No X posts to display</p>
              )}
            </div>
          </div>
        )}
        
        {(activePlatform === null || activePlatform === 'discord') && (
          <div className="discord-grid">
            <p className="social-media-platform-title">Discord</p>
            <div className="discord-posts">
              {discordPosts.length > 0 ? (
                discordPosts.map((post) => (
                  <div key={post.id} className="discord-post">
                    <div className="discord-content">
                      <h3 className="discord-title">{post.title}</h3>
                      <p className="discord-text">{post.content}</p>
                      <div className="discord-meta">
                        <span className="discord-author">Posted by {post.author}</span>
                        <span className="discord-channel">in #{post.channel}</span>
                        <span className="discord-date">{formatDate(post.timestamp)}</span>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p className="no-posts">No Discord posts to display</p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SocialMediasComponent;

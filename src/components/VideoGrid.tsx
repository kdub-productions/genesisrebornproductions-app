"use client";

import { useEffect, useState, useCallback } from 'react';
import '@/styles/Homepage-styles/videoGrid.css';

const apiKey = process.env.NEXT_PUBLIC_YOUTUBE_API_KEY;
const channelId = process.env.NEXT_PUBLIC_YOUTUBE_CHANNEL_ID;
const videosPerPage = 12;

interface Video {
  src: string;
  title: string;
  thumbnail: string;
}

interface VideoGridProps {
  setLoading: (loading: boolean) => void;
}

const VideoGrid = ({ setLoading }: VideoGridProps) => {
  const [videos, setVideos] = useState<Video[]>([]);
  const [nextPageToken, setNextPageToken] = useState<string>('');
  const [prevPageToken, setPrevPageToken] = useState<string>('');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageTokens, setPageTokens] = useState<{[key: number]: string}>({1: ''});
  const [activeVideo, setActiveVideo] = useState<number | null>(null);

  const fetchVideos = useCallback(async (pageToken = '', direction: 'next' | 'prev' = 'next') => {
    setLoading(true);
    
    const targetPage = direction === 'next' 
      ? (pageToken ? currentPage + 1 : 1) 
      : Math.max(1, currentPage - 1);

    try {
      const url = `https://www.googleapis.com/youtube/v3/search?key=${apiKey}&channelId=${channelId}&part=snippet&type=video&maxResults=${videosPerPage}&pageToken=${pageToken}&order=date`;
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data.error) {
        console.error("API Error:", data.error.message);
        return;
      }

      const fetchedVideos = data.items.map((item: any) => ({
        src: `https://www.youtube.com/embed/${item.id.videoId}`,
        title: item.snippet.title,
        thumbnail: item.snippet.thumbnails.medium.url,
      }));

      setVideos(fetchedVideos);
      setCurrentPage(targetPage);
      setNextPageToken(data.nextPageToken || '');
      setPrevPageToken(data.prevPageToken || '');
      setActiveVideo(null);
      
      const newPageTokens = {...pageTokens};
      newPageTokens[targetPage] = pageToken;
      if (data.nextPageToken) newPageTokens[targetPage + 1] = data.nextPageToken;
      if (data.prevPageToken) newPageTokens[targetPage - 1] = data.prevPageToken;
      setPageTokens(newPageTokens);

    } catch (error) {
      console.error("Fetch Error:", error);
    } finally {
      setLoading(false);
    }
  }, [currentPage, pageTokens, setLoading]);

  useEffect(() => {
    fetchVideos();
  }, [fetchVideos]);

  const handleVideoClick = (index: number) => {
    setActiveVideo(activeVideo === index ? null : index);
  };

  return (
    <div>
      <div id="video-grid" className="video-grid-container">
        {videos.map((video, index) => (
          <div key={`video-${index}-${currentPage}`} className="video-card">
            <div className="thumbnail-container">
              <img 
                src={video.thumbnail} 
                alt={video.title} 
                loading="lazy"
                width="480"
                height="360"
                className={`thumbnail-image ${activeVideo === index ? 'hidden' : ''}`}
              />
              <div className={`iframe-container ${activeVideo === index ? 'iframe-visible' : ''}`}>
                {activeVideo === index && (
                  <iframe
                    src={`${video.src}?autoplay=1`}
                    title={video.title}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="video-iframe iframe-visible"
                  />
                )}
              </div>
            </div>
            <div className="video-details">
              <h3 className="video-title">{video.title}</h3>
              <button 
                className="play-button"
                onClick={() => handleVideoClick(index)}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M8 5v14l11-7z"/>
                </svg>
              </button>
            </div>
          </div>
        ))}
      </div>
      <div className="video-grid-buttons">
        <button 
          className="pagination-button prev-button"
          onClick={() => fetchVideos(prevPageToken, 'prev')} 
          disabled={currentPage <= 1}
        >
          Previous
        </button>
        <span className="page-indicator">Page {currentPage}</span>
        <button 
          className="pagination-button next-button"
          onClick={() => fetchVideos(nextPageToken, 'next')} 
          disabled={!nextPageToken}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default VideoGrid;
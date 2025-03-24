"use client";

import { useEffect, useState } from 'react';
import '../styles/loading.css';
import '../styles/videoGrid.css';
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

// Add this function at the top of the file, after the interfaces
function decodeHTMLEntities(text: string) {
  const textarea = document.createElement('textarea');
  textarea.innerHTML = text;
  const decodedText = textarea.value;
  textarea.remove(); // Clean up
  return decodedText;
}

const VideoGrid = ({ setLoading }: VideoGridProps) => {
  const [videos, setVideos] = useState<Video[]>([]);
  const [nextPageToken, setNextPageToken] = useState<string>('');
  const [prevPageToken, setPrevPageToken] = useState<string>('');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageTokens, setPageTokens] = useState<{[key: number]: string}>({1: ''});

  useEffect(() => {
    // Clear cache and fetch fresh data on every page load
    localStorage.clear();
    setCurrentPage(1); // Reset to page 1 on initial load
    fetchVideos();
  }, [setLoading]);

  async function fetchVideos(pageToken = '', direction: 'next' | 'prev' = 'next') {
    setLoading(true);
    console.log("Fetching videos...");
    
    // Fix page calculation
    const targetPage = direction === 'next' 
      ? (pageToken ? currentPage + 1 : 1) 
      : currentPage - 1;
    
    // Check if we already have the videos for this page in cache
    const cachedData = localStorage.getItem('videoGridData');
    if (cachedData) {
      const parsedData = JSON.parse(cachedData);
      const pageVideos = parsedData.pageVideos || {};
      const storedPageTokens = parsedData.pageTokens || {};
      
      // If we have cached videos for the target page and its token matches
      if (pageVideos[targetPage] && storedPageTokens[targetPage] === pageToken) {
        setVideos(pageVideos[targetPage]);
        setCurrentPage(targetPage);
        setNextPageToken(storedPageTokens[targetPage + 1] || '');
        setPrevPageToken(storedPageTokens[targetPage - 1] || '');
        setLoading(false);
        return;
      }
    }

    const url = `https://www.googleapis.com/youtube/v3/search?key=${apiKey}&channelId=${channelId}&part=snippet&type=video&maxResults=${videosPerPage}&pageToken=${pageToken}`;

    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log("Data fetched:", data);

      if (data.error) {
        console.error("API Error:", data.error.message);
        alert("An error occurred: " + data.error.message);
        return;
      }

      const fetchedVideos = data.items.map((item: any) => ({
        src: `https://www.youtube.com/embed/${item.id.videoId}`,
        title: decodeHTMLEntities(item.snippet.title),
        thumbnail: item.snippet.thumbnails.medium.url,
      }));

      setVideos(fetchedVideos);
      setCurrentPage(targetPage);
      
      // Update page tokens mapping
      const newPageTokens = {...pageTokens};
      newPageTokens[targetPage] = pageToken;
      if (data.nextPageToken) newPageTokens[targetPage + 1] = data.nextPageToken;
      if (data.prevPageToken) newPageTokens[targetPage - 1] = data.prevPageToken;
      setPageTokens(newPageTokens);

      // Cache the current state
      const existingCache = localStorage.getItem('videoGridData');
      const existingPageVideos = existingCache ? JSON.parse(existingCache).pageVideos || {} : {};
      
      const cacheData = {
        videos: fetchedVideos,
        nextPageToken: data.nextPageToken || '',
        prevPageToken: data.prevPageToken || '',
        currentPage: targetPage,
        pageTokens: newPageTokens,
        pageVideos: {
          ...existingPageVideos,
          [targetPage]: fetchedVideos
        }
      };
      localStorage.setItem('videoGridData', JSON.stringify(cacheData));
      
      setNextPageToken(data.nextPageToken || '');
      setPrevPageToken(data.prevPageToken || '');
      console.log("Videos set:", fetchedVideos);
    } catch (error) {
      console.error("Fetch Error:", error);
      alert("Failed to fetch videos. Please check your network or API key.");
    } finally {
      setLoading(false);
      console.log("Loading set to false");
    }
  }

  return (
    <div>
      <div id="video-grid" className="video-grid-container">
        {videos.map((video, index) => (
          <div key={index} className="video-card">
            <div className="thumbnail-container">
              <img 
                src={video.thumbnail} 
                alt={video.title} 
                loading="lazy"
                className="thumbnail-image" 
                onError={(e) => {
                  console.error('Error loading thumbnail:', e);
                  e.currentTarget.src = '/images/fallback-thumbnail.jpg';
                }}
              />
              <iframe 
                src={`${video.src}?enablejsapi=1&origin=${window.location.origin}&rel=0&showinfo=0`}
                allowFullScreen 
                allow="autoplay"
                className="video-iframe hidden"
                loading="lazy"
                title={video.title}
              />
            </div>
            <div className="video-details">
              <h3 className="video-title">{video.title}</h3>
              <button 
                className="play-button"
                onClick={(e) => {
                  const parent = (e.target as HTMLElement).closest('.video-card');
                  const iframe = parent?.querySelector('iframe');
                  const img = parent?.querySelector('img');
                  const playButton = parent?.querySelector('.play-button');
                  if (iframe && img && playButton) {
                    iframe.src = `${video.src}?autoplay=1&rel=0&showinfo=0&controls=1`;
                    iframe.classList.remove('hidden');
                    iframe.classList.add('iframe-visible');
                    img.style.display = 'none';
                    (playButton as HTMLElement).style.display = 'none';
                  }
                }}
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
          disabled={!prevPageToken}
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
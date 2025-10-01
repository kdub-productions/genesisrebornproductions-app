"use client";

import { useEffect, useState, useCallback, useRef } from 'react';
import '@/styles/Homepage-styles/videoGrid.css';

const videosPerPage = 12;

interface Video {
  src: string;
  title: string;
  thumbnail: string;
  videoId?: string | null;
}

// Simple HTML entity decoder
function decodeHtmlEntities(text: string) {
  const map: { [key: string]: string } = {
    '&amp;': '&',
    '<': '<',
    '>': '>',
    '"': '"',
    '&#39;': "'",
    '&#x27;': "'",
    '&#x2F;': '/',
    '&#x60;': '`',
    '&#x3D;': '=',
  };
  return text.replace(/&[a-zA-Z0-9#]+;/g, (m) => map[m] || m);
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
  const [error, setError] = useState<string | null>(null);

  const fetchVideos = useCallback(async (pageToken = '', direction: 'next' | 'prev' = 'next') => {
    // prevent overlapping fetches
    if (isFetchingRef.current) return;
    isFetchingRef.current = true;
    setLoading(true);
    
    const targetPage = direction === 'next' 
      ? (pageToken ? currentPage + 1 : 1) 
      : Math.max(1, currentPage - 1);

      try {
        setError(null);
        // Call server-side proxy so the API key is not exposed to the client and to avoid CORS/403 issues
        const proxyUrl = `/api/youtube/search?maxResults=${videosPerPage}&pageToken=${encodeURIComponent(pageToken)}&order=date`;
        const response = await fetch(proxyUrl);

        if (!response.ok) {
          const err = await response.json().catch(() => ({}));
          throw new Error(`HTTP error! status: ${response.status} ${err?.message || ''}`);
        }

        const data = await response.json();

        const fetchedVideos = (data.items || []).map((item: any) => {
          const vid = item.videoId || null;
          const rawTitle = item.title || '';
          let title = String(rawTitle).replace(/"/g, '"').replace(/&amp;/g, '&').replace(/</g, '<').replace(/>/g, '>').replace(/&#39;/g, "'").replace(/&#x27;/g, "'").trim() || 'Untitled video';
          // Prefer provided thumbnail, otherwise fall back to YouTube default thumbnail when we have a video id
          const thumb = item.thumbnail || (vid ? `https://i.ytimg.com/vi/${vid}/hqdefault.jpg` : null);
          return {
            src: vid ? `https://www.youtube.com/embed/${vid}` : '',
            title,
            thumbnail: thumb,
            videoId: vid,
          };
        }).filter((v: any) => !!v.videoId); // drop entries without a valid videoId

        if (!fetchedVideos || fetchedVideos.length === 0) {
          setVideos([]);
          setError('No videos returned from the YouTube API.');
        } else if (fetchedVideos.length === 0) {
          setVideos([]);
          setError('No valid videos found (no video IDs).');
        } else {
          setVideos(fetchedVideos);
          setError(null);
        }
      setCurrentPage(targetPage);
      setNextPageToken(data.nextPageToken || '');
      setPrevPageToken(data.prevPageToken || '');
      setActiveVideo(null);
      
      const newPageTokens = {...pageTokens};
      newPageTokens[targetPage] = pageToken;
      if (data.nextPageToken) newPageTokens[targetPage + 1] = data.nextPageToken;
      if (data.prevPageToken) newPageTokens[targetPage - 1] = data.prevPageToken;
      setPageTokens(newPageTokens);

    } catch (error: any) {
      const msg = (error && error.message) ? error.message : String(error);
      console.error("Fetch Error:", msg);
      setError(msg);
    } finally {
      setLoading(false);
      isFetchingRef.current = false;
    }
  }, [currentPage, pageTokens, setLoading]);

  // ref to avoid concurrent fetches
  const isFetchingRef = useRef(false);

  // Run initial fetch only once on mount. Pagination buttons call fetchVideos directly.
  useEffect(() => {
    fetchVideos();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleVideoClick = (index: number) => {
    setActiveVideo(activeVideo === index ? null : index);
  };

  // dev-only raw debug data panel
  const devRaw = process.env.NODE_ENV === 'development' ? (
    <details style={{margin: '8px 0', fontSize: 12}}>
      <summary>Raw Video Data (dev)</summary>
      <pre style={{maxHeight: 200, overflow: 'auto'}}>{JSON.stringify(videos, null, 2)}</pre>
    </details>
  ) : null;

  return (
    <div>
      {error && (
        <div className="video-grid-error" role="alert" style={{color: '#b00', padding: '12px', textAlign: 'center'}}>
          <strong>Videos failed to load:</strong> {error}
        </div>
      )}
      <div id="video-grid" className="video-grid-container">
        {videos.map((video, index) => (
          <div key={`video-${index}-${currentPage}`} className="video-card">
            <div
              className="thumbnail-container"
              role="button"
              tabIndex={0}
              onClick={() => handleVideoClick(index)}
              onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); handleVideoClick(index); } }}
            >
              <img
                src={video.thumbnail ?? ''}
                alt={video.title}
                loading="lazy"
                width="480"
                height="360"
                className={`thumbnail-image ${activeVideo === index ? 'hidden' : ''}`}
                style={{backgroundColor: '#000', objectFit: 'cover', display: activeVideo === index ? 'none' : 'block'}}
                onError={(e) => {
                  const t = e.currentTarget as HTMLImageElement;
                  if (video.videoId) {
                    const fallback = `https://i.ytimg.com/vi/${video.videoId}/hqdefault.jpg`;
                    if (t.src !== fallback) t.src = fallback;
                  } else {
                    t.style.backgroundColor = '#222';
                  }
                }}
                onLoad={(e) => {
                  const t = e.currentTarget as HTMLImageElement;
                  if (t.naturalWidth === 1 && t.naturalHeight === 1) {
                    // This is a 1x1 pixel transparent image, likely a placeholder or error
                    t.style.backgroundColor = '#222';
                    t.src = `https://i.ytimg.com/vi/${video.videoId}/hqdefault.jpg`;
                  }
                }}
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
              {!activeVideo && (
                <button 
                  className="play-button"
                  aria-label={`Play ${video.title}`}
                  onClick={(e) => { e.stopPropagation(); handleVideoClick(index); }}
                  tabIndex={-1}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M8 5v14l11-7z"/>
                  </svg>
                </button>
              )}
            </div>
            <div className="video-details">
              <h3 className="video-title">{video.title}</h3>
            </div>
          </div>
        ))}
      </div>
      {devRaw}
      <div className="video-grid-buttons">
        <button 
          className="pagination-button prev-button"
          onClick={() => { if (!isFetchingRef.current) fetchVideos(prevPageToken, 'prev'); }} 
          disabled={currentPage <= 1}
        >
          Previous
        </button>
        <span className="page-indicator">Page {currentPage}</span>
        <button 
          className="pagination-button next-button"
          onClick={() => { if (!isFetchingRef.current) fetchVideos(nextPageToken, 'next'); }} 
          disabled={!nextPageToken}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default VideoGrid;
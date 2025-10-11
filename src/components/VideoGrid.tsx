"use client";

import { useEffect, useState, useCallback, useRef } from 'react';
import '@/styles/Homepage-styles/videoGrid.css';

const videosPerPage = 12;

interface Video {
  src: string;
  title: string;
  thumbnail: string | null;
  videoId?: string | null;
  channelTitle?: string;
  publishedAt?: string;
}

// Simple HTML entity decoder
function decodeHtmlEntities(text: string) {
  const textarea = document.createElement('textarea');
  textarea.innerHTML = text;
  return textarea.value;
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
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const playerRef = useRef<any>(null);
  const [apiLoaded, setApiLoaded] = useState(false);
  const [gridLoading, setGridLoading] = useState(false);
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  const fetchVideos = useCallback(async (pageToken = '', direction: 'next' | 'prev' = 'next') => {
    // prevent overlapping fetches
    if (isFetchingRef.current) return;
    isFetchingRef.current = true;
    setGridLoading(true);
    
    const targetPage = direction === 'next' 
      ? (pageToken ? currentPage + 1 : 1) 
      : Math.max(1, currentPage - 1);

      try {
        setError(null);
        // Call server-side proxy so the API key is not exposed to the client and to avoid CORS/403 issues
        const proxyUrl = '/api/youtube/search?maxResults=' + videosPerPage + '&pageToken=' + encodeURIComponent(pageToken) + '&order=date';
        const response = await fetch(proxyUrl);

        if (!response.ok) {
          const err = await response.json().catch(() => ({}));
          throw new Error('HTTP error! status: ' + response.status + ' ' + (err?.message || ''));
        }

        const data = await response.json();

        const fetchedVideos = (data.items || []).map((item: any) => {
          const vid = item.videoId || null;
          const rawTitle = item.title || '';
          let title = decodeHtmlEntities(String(rawTitle)).trim() || 'Untitled video';
          const thumb = item.thumbnail;
          return {
            src: vid ? 'https://www.youtube.com/embed/' + vid + '?autoplay=1&mute=1' : '',
            title,
            thumbnail: thumb,
            videoId: vid,
          };
        }).filter((v: any) => !!v.videoId); // drop entries without a valid videoId

        if (!fetchedVideos || fetchedVideos.length === 0) {
          setVideos([]);
          setError('No videos returned from the YouTube API.');
          setGridLoading(false);
        } else if (fetchedVideos.length === 0) {
          setVideos([]);
          setError('No valid videos found (no video IDs).');
          setGridLoading(false);
        } else {
          setVideos(fetchedVideos);
          setError(null);
          setGridLoading(false);
          if (isInitialLoad) {
            setIsInitialLoad(false);
            setLoading(false);
          }
        }
      setCurrentPage(targetPage);
      setNextPageToken(data.nextPageToken || '');
      setPrevPageToken(data.prevPageToken || '');
      setActiveVideo(null);
      setIsPlaying(false);

      const newPageTokens = {...pageTokens};
      newPageTokens[targetPage] = pageToken;
      if (data.nextPageToken) newPageTokens[targetPage + 1] = data.nextPageToken;
      if (data.prevPageToken) newPageTokens[targetPage - 1] = data.prevPageToken;
      setPageTokens(newPageTokens);
    } catch (error: any) {
      const msg = (error && error.message) ? error.message : String(error);
      console.error("Fetch Error:", msg);
      setError(msg);
      setGridLoading(false);
    } finally {
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

  // Load YouTube IFrame API script
  useEffect(() => {
    if ((window as any).YT) {
      setApiLoaded(true);
    } else {
      (window as any).onYouTubeIframeAPIReady = () => {
        setApiLoaded(true);
      };
      const script = document.createElement('script');
      script.src = 'https://www.youtube.com/iframe_api';
      document.head.appendChild(script);
    }
  }, []);

  // Create/destroy YouTube player
  useEffect(() => {
    if (!apiLoaded || activeVideo === null) {
      if (playerRef.current) {
        playerRef.current.destroy();
        playerRef.current = null;
      }
      setIsPlaying(false);
      return;
    }

    const video = videos[activeVideo];
    if (!video || !video.videoId) return;

    if (playerRef.current) {
      playerRef.current.destroy();
    }

    playerRef.current = new (window as any).YT.Player(`player-${activeVideo}`, {
      videoId: video.videoId,
      playerVars: {
        autoplay: 1,
        mute: 1,
      },
      events: {
        onReady: (event: any) => {
          event.target.playVideo();
        },
        onStateChange: (event: any) => {
          if (event.data === (window as any).YT.PlayerState.PLAYING) {
            setIsPlaying(true);
          } else if (event.data === (window as any).YT.PlayerState.PAUSED) {
            setIsPlaying(false);
          }
        },
      },
    });
  }, [activeVideo, apiLoaded, videos]);

  const handleVideoClick = (index: number) => {
    if (activeVideo === index) {
      if (playerRef.current) {
        playerRef.current.destroy();
        playerRef.current = null;
      }
      setActiveVideo(null);
      setIsPlaying(false);
    } else {
      setActiveVideo(index);
      setIsPlaying(true); // Assume it will play immediately
    }
  };

  // dev-only raw debug data panel
  const devRaw = null;

  return (
    <div>
      {error && (
        <div className="video-grid-error" role="alert" style={{color: '#b00', padding: '12px', textAlign: 'center'}}>
          <strong>Videos failed to load:</strong> {error}
        </div>
      )}
      <div id="video-grid" className="video-grid-container">
        {gridLoading && (
          <div className="video-grid-loading">
            <div className="loading-progress"></div>
          </div>
        )}
        {videos.map((video, index) => {
          console.log('Rendering thumbnail for videoId:', video.videoId, 'thumbnail URL:', video.thumbnail);
          return (
            <div key={'video-' + index + '-' + currentPage} className="video-card">
              <div
                className="thumbnail-container"
                role="button"
                tabIndex={0}
                onClick={() => handleVideoClick(index)}
                onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); handleVideoClick(index); } }}
              >
                <img
                  src={video.thumbnail + `?t=${Date.now()}`}
                  alt={video.title || 'Video thumbnail'}
                  loading="lazy"
                  width="480"
                  height="360"
                  className="thumbnail-image"
                  style={{objectFit: 'cover', display: 'block', zIndex: 1}}
                  onError={(e) => {
                    const t = e.currentTarget as HTMLImageElement;
                    console.error('Thumbnail failed to load for videoId:', video.videoId, 'src:', t.src);
                    if (video.videoId) {
                      // Try in order: hqdefault -> maxresdefault -> mqdefault -> default
                      if (t.src.includes('/hqdefault.jpg')) {
                        t.src = 'https://i.ytimg.com/vi/' + video.videoId + '/maxresdefault.jpg?t=' + Date.now();
                      } else if (t.src.includes('/maxresdefault.jpg')) {
                        t.src = 'https://i.ytimg.com/vi/' + video.videoId + '/mqdefault.jpg?t=' + Date.now();
                      } else if (t.src.includes('/mqdefault.jpg')) {
                        t.src = 'https://i.ytimg.com/vi/' + video.videoId + '/default.jpg?t=' + Date.now();
                      } else {
                        t.style.backgroundColor = '#222';
                      }
                    } else {
                      t.style.backgroundColor = '#222';
                    }
                  }}
                />
              <div className={'iframe-container ' + (activeVideo === index ? 'iframe-visible' : '')}>
                {activeVideo === index && (
                  <div
                    id={`player-${index}`}
                    className="video-player-div iframe-visible"
                  />
                )}
              </div>
              {(!activeVideo || (activeVideo === index && !isPlaying)) && (
                <button
                  className={`play-button ${activeVideo === index ? 'paused-overlay' : ''}`}
                  aria-label={activeVideo === index ? 'Resume ' + video.title : 'Play ' + video.title}
                  onClick={(e) => {
                    e.stopPropagation();
                    if (activeVideo === index && playerRef.current) {
                      playerRef.current.playVideo();
                    } else {
                      handleVideoClick(index);
                    }
                  }}
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
        );
      })}
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
  )
}

export default VideoGrid;

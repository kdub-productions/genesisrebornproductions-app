"use client";

import { useEffect, useRef } from 'react';
import React, { useState } from 'react';
import '@/styles/other-page-styles/lyrics-page.css';
import '@/styles/site-wide-styles/styles.css';
import { songs } from '../lyrics/data/songsData';
import { useSwipeable } from 'react-swipeable';
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
const LyricsPage: React.FC = () => {
  const [selectedSong, setSelectedSong] = useState(songs[0]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    audioRef.current = new Audio('/sounds/page-flip.mp3');
  }, []);

  const playPageFlipSound = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = 0; // Reset sound to start
      audioRef.current.play().catch(err => console.log('Audio playback failed:', err));
    }
  };

  const handleSongClick = (song: { title: string; artist: string; lyrics: string }) => {
    setSelectedSong(song);
    setIsSidebarOpen(false);
    playPageFlipSound();
  };

  const handleSwipe = (direction: 'left' | 'right') => {
    if (isAnimating) return;
    setIsAnimating(true);
    
    const currentIndex = songs.findIndex(song => song.title === selectedSong.title);
    let nextIndex;
    
    if (direction === 'left' && currentIndex < songs.length - 1) {
      nextIndex = currentIndex + 1;
    } else if (direction === 'right' && currentIndex > 0) {
      nextIndex = currentIndex - 1;
    }

    if (nextIndex !== undefined) {
      playPageFlipSound();
      setSelectedSong(songs[nextIndex]);
    }

    setTimeout(() => setIsAnimating(false), 500);
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const filteredSongs = songs.filter((song) =>
    song.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const renderLyrics = (lyrics: string) => {
    const parts = lyrics.split('[BREAK]');
    return parts.map((part, index) => (
      <div key={index} className="stanza">
        {part.trim()}
      </div>
    ));
  };

  const swipeHandlers = useSwipeable({
    onSwipedLeft: () => handleSwipe('left'),
    onSwipedRight: () => handleSwipe('right'),
    delta: 10,
    trackMouse: true
  });

  return (
    <div className="page-container">
      <Navbar />
      <div className="main-content">
        <div className="lyrics-header">
          <h1 className="section-heading">Song Lyrics</h1>
        </div>
        <div className="lyrics-wrapper">
          <div className="sidebar">
            <div className="sidebar-header">
              <input
                type="text"
                placeholder="Search songs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
              />
            </div>
            <ul className="song-list">
            {filteredSongs.map((song) => (
              <li
                key={song.title}
                className={`song-item ${selectedSong.title === song.title ? 'active' : ''}`}
                onClick={() => handleSongClick(song)}
              >
                {song.title}
              </li>
            ))}
          </ul>
        </div>

        <div className="lyrics-content" {...swipeHandlers}>
          <div className="lyrics-container">
            <h2 className="lyrics-title">{selectedSong.title}</h2>
            <p className="lyrics-artist">{selectedSong.artist}</p>
            {renderLyrics(selectedSong.lyrics)}
          </div>
        </div>
      </div>

      <div className="controls">
        <button
          className="control-button"
          onClick={() => handleSwipe('right')}
          disabled={songs.findIndex(song => song.title === selectedSong.title) === 0}
        >
          Previous
        </button>
        <button
          className="control-button"
          onClick={() => handleSwipe('left')}
          disabled={songs.findIndex(song => song.title === selectedSong.title) === songs.length - 1}
        >
          Next
        </button>
      </div>
    </div>
    <div className='site-footer'>
        <Footer />
      </div>
    </div>
  );
};

export default LyricsPage;

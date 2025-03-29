import React from 'react';
import { songs } from './data/songsData.js';

function SongList() {
  const renderLyrics = (lyrics) => {
    const parts = lyrics.split('[BREAK]');
    return parts.map((part, index) => (
      <React.Fragment key={index}>
        {part.trim() && <pre>{part.trim()}</pre>} {/* Display lyrics part */}
        {index < parts.length - 1 && <hr />} {/* Add a break if not the last part */}
      </React.Fragment>
    ));
  };

  return (
    <div>
      <h1>Song List</h1>
      <ul>
        {songs.map((song, index) => (
          <li key={index}>
            <h2>{song.title}</h2>
            <p>Artist: {song.artist}</p>
            <div>{renderLyrics(song.lyrics)}</div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default SongList;

import React, { useState, useEffect } from 'react';
import { Card } from '@mui/material';

interface Beat {
  id: number;
  title: string;
  genre: string;
  artwork: string;
  audioPreview: string;
  fullAudioId: number;
  price: number;
  licenses: string[];
}

const BeatTable: React.FC = () => {
  const [beats, setBeats] = useState<Beat[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBeats = async () => {
      try {
        const response = await fetch('/api/beats'); // Fetch from /api/beats

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data: Beat[] = await response.json();
        setBeats(data);
      } catch (error: any) {
        setError(error.message); // Handle errors more robustly
        console.error("Error fetching beats:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBeats();
  }, []);

  if (isLoading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  return (
    <table>
      <thead>
        <tr>
          <th>Artwork</th>
          <th>Title</th>
          <th>Genre</th>
          <th>Preview</th>
          <th>Price</th>
          <th>Licenses</th>
        </tr>
      </thead>
      <Card>
        {beats.map((beat) => (
          <tr key={beat.id}>
            <td><img src={beat.artwork} alt={beat.title} width={100} height={100} /></td>
            <td>{beat.title}</td>
            <td>{beat.genre}</td>
            <td>
              <audio controls>
                <source src={beat.audioPreview} type="audio/mpeg" />
                Your browser does not support the audio element.
              </audio>
            </td>
            <td>${beat.price.toFixed(2)}</td> {/* Format price */}
            <td>{beat.licenses.join(', ')}</td>
          </tr>
        ))}
      </Card>
    </table>
  );
};

export default BeatTable;
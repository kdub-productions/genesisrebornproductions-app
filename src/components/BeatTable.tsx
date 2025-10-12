"use client";
import React, { useState, useEffect } from 'react';
import { Beat } from '@/types/beats';

const BeatTable: React.FC = () => {
  const [beats, setBeats] = useState<Beat[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [newBeat, setNewBeat] = useState<Partial<Beat>>({
    title: '',
    genre: '',
    artwork: '',
    audioPreview: '',
    fullAudioId: 0,
    price: 0,
    license: { id: 0, name: '', price: 0, description: '', paymentLink: '' },
    isSold: false,
  });

  useEffect(() => {
    fetchBeats();
  }, []);

  useEffect(() => {
    const handleAudioPlay = (event: Event) => {
      const audioElements = document.querySelectorAll('audio');
      audioElements.forEach((audio) => {
        if (audio !== event.target) {
          audio.pause();
        }
      });
    };

    const audioElements = document.querySelectorAll('audio');
    audioElements.forEach((audio) => {
      audio.addEventListener('play', handleAudioPlay);
    });

    return () => {
      audioElements.forEach((audio) => {
        audio.removeEventListener('play', handleAudioPlay);
      });
    };
  }, [beats]);

  const fetchBeats = async () => {
    try {
      const response = await fetch('/api/beats');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data: Beat[] = await response.json();
      setBeats(data);
    } catch (error: any) {
      setError(error.message);
      console.error("Error fetching beats:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddBeat = () => {
    if (!newBeat.title || !newBeat.genre || !newBeat.artwork || !newBeat.audioPreview || !newBeat.license?.name) {
      alert('Please fill all required fields');
      return;
    }
    const beat: Beat = {
      id: Math.max(...beats.map(b => b.id), 0) + 1,
      title: newBeat.title!,
      genre: newBeat.genre!,
      artwork: newBeat.artwork!,
      audioPreview: newBeat.audioPreview!,
      fullAudioId: newBeat.fullAudioId || 0,
      price: newBeat.price || 0,
      license: newBeat.license!,
      isSold: newBeat.isSold || false,
    };
    setBeats([...beats, beat]);
    setNewBeat({
      title: '',
      genre: '',
      artwork: '',
      audioPreview: '',
      fullAudioId: 0,
      price: 0,
      license: { id: 0, name: '', price: 0, description: '', paymentLink: '' },
      isSold: false,
    });
  };

  const handleRemoveBeat = async (id: number) => {
    const updatedBeats = beats.filter(beat => beat.id !== id);
    setBeats(updatedBeats);
    try {
      const response = await fetch('/api/beats', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedBeats),
      });
      if (!response.ok) {
        throw new Error('Failed to save beats');
      }
      alert('Beat removed successfully');
      // Trigger a refresh of the beats data to ensure consistency
      fetchBeats();
    } catch (error: any) {
      alert('Error removing beat: ' + error.message);
      // Revert the local state if save failed
      setBeats(beats);
    }
  };

  const handleToggleSold = (id: number) => {
    setBeats(beats.map(beat => beat.id === id ? { ...beat, isSold: !beat.isSold } : beat));
  };

  const handleSave = async () => {
    try {
      const response = await fetch('/api/beats', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(beats),
      });
      if (!response.ok) {
        throw new Error('Failed to save beats');
      }
      alert('Beats saved successfully');
    } catch (error: any) {
      alert('Error saving beats: ' + error.message);
    }
  };

  if (isLoading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  return (
    <div>
      <h2>Beat Management</h2>
      <div className="add-beat-form">
        <h3>Add New Beat</h3>
        <input
          type="text"
          placeholder="Title"
          value={newBeat.title}
          onChange={(e) => setNewBeat({ ...newBeat, title: e.target.value })}
        />
        <input
          type="text"
          placeholder="Genre"
          value={newBeat.genre}
          onChange={(e) => setNewBeat({ ...newBeat, genre: e.target.value })}
        />
        <input
          type="text"
          placeholder="Artwork URL"
          value={newBeat.artwork}
          onChange={(e) => setNewBeat({ ...newBeat, artwork: e.target.value })}
        />
        <input
          type="text"
          placeholder="Audio Preview URL"
          value={newBeat.audioPreview}
          onChange={(e) => setNewBeat({ ...newBeat, audioPreview: e.target.value })}
        />
        <input
          type="number"
          placeholder="Full Audio ID"
          value={newBeat.fullAudioId}
          onChange={(e) => setNewBeat({ ...newBeat, fullAudioId: parseInt(e.target.value) })}
        />
        <input
          type="number"
          placeholder="Price"
          value={newBeat.price}
          onChange={(e) => setNewBeat({ ...newBeat, price: parseFloat(e.target.value) })}
        />
        <input
          type="text"
          placeholder="License Name"
          value={newBeat.license?.name}
          onChange={(e) => setNewBeat({ ...newBeat, license: { ...newBeat.license!, name: e.target.value } })}
        />
        <input
          type="number"
          placeholder="License Price"
          value={newBeat.license?.price}
          onChange={(e) => setNewBeat({ ...newBeat, license: { ...newBeat.license!, price: parseFloat(e.target.value) } })}
        />
        <textarea
          placeholder="License Description"
          value={newBeat.license?.description}
          onChange={(e) => setNewBeat({ ...newBeat, license: { ...newBeat.license!, description: e.target.value } })}
        />
        <input
          type="text"
          placeholder="Payment Link"
          value={newBeat.license?.paymentLink}
          onChange={(e) => setNewBeat({ ...newBeat, license: { ...newBeat.license!, paymentLink: e.target.value } })}
        />
        <label>
          <input
            type="checkbox"
            checked={newBeat.isSold}
            onChange={(e) => setNewBeat({ ...newBeat, isSold: e.target.checked })}
          />
          Sold
        </label>
        <button onClick={handleAddBeat}>Add Beat</button>
      </div>
      <button className="save-button" onClick={handleSave}>Save Changes</button>
      <table className="beat-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Title</th>
            <th>Genre</th>
            <th>Artwork</th>
            <th>Preview</th>
            <th>Price</th>
            <th>License</th>
            <th>Sold</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {beats.map((beat) => (
            <tr key={beat.id}>
              <td>{beat.id}</td>
              <td>{beat.title}</td>
              <td>{beat.genre}</td>
              <td><img src={beat.artwork} alt={beat.title} width={50} height={50} /></td>
              <td>
                <audio controls>
                  <source src={beat.audioPreview} type="audio/mpeg" />
                </audio>
              </td>
              <td>${beat.price.toFixed(2)}</td>
              <td>{beat.license.name} - ${beat.license.price.toFixed(2)}</td>
              <td>{beat.isSold ? 'Yes' : 'No'}</td>
              <td>
                <button onClick={() => handleToggleSold(beat.id)}>
                  {beat.isSold ? 'Mark Available' : 'Mark Sold'}
                </button>
                <button onClick={() => handleRemoveBeat(beat.id)}>Remove</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default BeatTable;

"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function UploadBeatPage() {
  const [formData, setFormData] = useState({
    title: '',
    genre: '',
    price: '',
    licenseName: '',
    licenseDescription: '',
    paymentLink: '',
  });
  const [coverArt, setCoverArt] = useState<File | null>(null);
  const [audioPreview, setAudioPreview] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState('');
  const router = useRouter();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'coverArt' | 'audioPreview') => {
    const file = e.target.files?.[0] || null;
    if (type === 'coverArt') {
      setCoverArt(file);
    } else {
      setAudioPreview(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!coverArt || !audioPreview) {
      setMessage('Please select both cover art and audio preview files.');
      return;
    }

    setUploading(true);
    setMessage('');

    const data = new FormData();
    data.append('title', formData.title);
    data.append('genre', formData.genre);
    data.append('price', formData.price);
    data.append('licenseName', formData.licenseName);
    data.append('licenseDescription', formData.licenseDescription);
    data.append('paymentLink', formData.paymentLink);
    data.append('coverArt', coverArt);
    data.append('audioPreview', audioPreview);

    try {
      const response = await fetch('/api/beats/upload', {
        method: 'POST',
        body: data,
      });

      if (response.ok) {
        setMessage('Beat uploaded successfully!');
        setFormData({
          title: '',
          genre: '',
          price: '',
          licenseName: '',
          licenseDescription: '',
          paymentLink: '',
        });
        setCoverArt(null);
        setAudioPreview(null);
        // Reset file inputs
        const coverArtInput = document.getElementById('coverArt') as HTMLInputElement;
        const audioInput = document.getElementById('audioPreview') as HTMLInputElement;
        if (coverArtInput) coverArtInput.value = '';
        if (audioInput) audioInput.value = '';
      } else {
        const error = await response.text();
        setMessage(`Upload failed: ${error}`);
      }
    } catch (error) {
      setMessage('An error occurred during upload.');
      console.error(error);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
      <h1>Upload New Beat</h1>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '10px' }}>
          <label htmlFor="title">Title:</label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            required
            style={{ width: '100%', padding: '8px', marginTop: '5px' }}
          />
        </div>
        <div style={{ marginBottom: '10px' }}>
          <label htmlFor="genre">Genre:</label>
          <input
            type="text"
            id="genre"
            name="genre"
            value={formData.genre}
            onChange={handleInputChange}
            required
            style={{ width: '100%', padding: '8px', marginTop: '5px' }}
          />
        </div>
        <div style={{ marginBottom: '10px' }}>
          <label htmlFor="price">Price:</label>
          <input
            type="number"
            id="price"
            name="price"
            value={formData.price}
            onChange={handleInputChange}
            step="0.01"
            required
            style={{ width: '100%', padding: '8px', marginTop: '5px' }}
          />
        </div>
        <div style={{ marginBottom: '10px' }}>
          <label htmlFor="licenseName">License Name:</label>
          <input
            type="text"
            id="licenseName"
            name="licenseName"
            value={formData.licenseName}
            onChange={handleInputChange}
            required
            style={{ width: '100%', padding: '8px', marginTop: '5px' }}
          />
        </div>
        <div style={{ marginBottom: '10px' }}>
          <label htmlFor="licenseDescription">License Description:</label>
          <textarea
            id="licenseDescription"
            name="licenseDescription"
            value={formData.licenseDescription}
            onChange={handleInputChange}
            required
            style={{ width: '100%', padding: '8px', marginTop: '5px', minHeight: '60px' }}
          />
        </div>
        <div style={{ marginBottom: '10px' }}>
          <label htmlFor="paymentLink">Payment Link:</label>
          <input
            type="url"
            id="paymentLink"
            name="paymentLink"
            value={formData.paymentLink}
            onChange={handleInputChange}
            required
            style={{ width: '100%', padding: '8px', marginTop: '5px' }}
          />
        </div>
        <div style={{ marginBottom: '10px' }}>
          <label htmlFor="coverArt">Cover Art (Image file):</label>
          <input
            type="file"
            id="coverArt"
            accept="image/*"
            onChange={(e) => handleFileChange(e, 'coverArt')}
            required
            style={{ width: '100%', padding: '8px', marginTop: '5px' }}
          />
        </div>
        <div style={{ marginBottom: '10px' }}>
          <label htmlFor="audioPreview">Audio Preview (MP3 file):</label>
          <input
            type="file"
            id="audioPreview"
            accept="audio/mpeg"
            onChange={(e) => handleFileChange(e, 'audioPreview')}
            required
            style={{ width: '100%', padding: '8px', marginTop: '5px' }}
          />
        </div>
        <button
          type="submit"
          disabled={uploading}
          style={{
            padding: '10px 20px',
            backgroundColor: uploading ? '#ccc' : '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: uploading ? 'not-allowed' : 'pointer'
          }}
        >
          {uploading ? 'Uploading...' : 'Upload Beat'}
        </button>
      </form>
      {message && <p style={{ marginTop: '20px', color: message.includes('successfully') ? 'green' : 'red' }}>{message}</p>}
      <button
        onClick={() => router.push('/admin')}
        style={{
          marginTop: '20px',
          padding: '10px 20px',
          backgroundColor: '#6c757d',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer'
        }}
      >
        Back to Admin
      </button>
    </div>
  );
}

"use client";

import { useState, useEffect, useRef } from 'react';
import '@/styles/mixingmasteringGrid.css';

interface MixingMasteringGridProps {
  setLoading: (loading: boolean) => void;
}

const MixingMasteringGrid = ({ setLoading }: MixingMasteringGridProps) => {
  const [selectedTier, setSelectedTier] = useState<string | null>(null);
  const [files, setFiles] = useState<File[]>([]);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Set loading to false when component is mounted
    setLoading(false);
    return () => setLoading(true); // Reset on unmount
  }, [setLoading]);

  const serviceTiers = [
    {
      id: 'basic',
      name: 'Basic Mix',
      price: '$75',
      turnaround: '3-5 days',
      description: 'Perfect for indie artists and small projects needing professional sound quality.',
      features: [
        'Professional mixing of up to 20 tracks',
        'Basic EQ, compression, and effects',
        'Two revisions included',
        'MP3 and WAV delivery formats',
        'Basic stereo enhancement',
        'Basic noise reduction'
      ]
    },
    {
      id: 'standard',
      name: 'Standard Mix & Master',
      price: '$150',
      turnaround: '5-7 days',
      description: 'Our most popular package for artists looking for radio-ready sound.',
      features: [
        'Professional mixing of up to 40 tracks',
        'Advanced EQ, compression, and effects',
        'Professional mastering included',
        'Three revisions included',
        'All delivery formats (MP3, WAV, FLAC)',
        'Stem exports available',
        'Advanced stereo enhancement',
        'Detailed noise reduction'
      ]
    },
    {
      id: 'premium',
      name: 'Premium Mix & Master',
      price: '$250',
      turnaround: '7-10 days',
      description: 'The ultimate package for artists who demand the highest quality for their releases.',
      features: [
        'Professional mixing of unlimited tracks',
        'Premium EQ, compression, and effects',
        'Advanced mastering with analog emulation',
        'Unlimited revisions',
        'All delivery formats (MP3, WAV, FLAC)',
        'Stem exports included',
        'Priority support',
        'Vocal tuning and time alignment',
        'Advanced spatial processing',
        'Custom reference matching'
      ]
    },
    {
      id: 'vocal',
      name: 'Vocal Production',
      price: '$100',
      turnaround: '3-5 days',
      description: 'Specialized service for vocal-focused tracks and artists.',
      features: [
        'Professional vocal tuning and timing',
        'Detailed vocal processing and effects',
        'Vocal doubling and harmonization',
        'Background vocal arrangement',
        'Two revisions included',
        'All delivery formats (MP3, WAV, FLAC)',
        'Stem exports available'
      ]
    }
  ];

  const handleTierSelect = (tierId: string) => {
    setSelectedTier(tierId);
    // Show a brief confirmation message
    const tierName = serviceTiers.find(tier => tier.id === tierId)?.name;
    setSubmitMessage(`You selected: ${tierName}. Please complete the form below.`);
    // Scroll to the form section
    document.getElementById('upload-section')?.scrollIntoView({ behavior: 'smooth' });
    // Clear the message after 5 seconds
    setTimeout(() => {
      if (submitMessage.includes(`You selected: ${tierName}`)) {
        setSubmitMessage('');
      }
    }, 5000);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setFiles(prev => [...prev, ...newFiles]);
    }
  };

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedTier) {
      setSubmitMessage('Please select a service tier');
      return;
    }

    if (files.length === 0) {
      setSubmitMessage('Please upload at least one file');
      return;
    }

    setIsSubmitting(true);
    setSubmitMessage('Submitting your request...');

    try {
      // Get the selected tier name
      const selectedTierName = serviceTiers.find(tier => tier.id === selectedTier)?.name || '';
      
      // Get file names for email
      const fileNames = files.map(file => `${file.name} (${(file.size / (1024 * 1024)).toFixed(2)} MB)`);
      
      // Send email with form data
      const response = await fetch('/api/email/mixing-request', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          email,
          selectedTier: selectedTierName,
          message,
          fileNames
        }),
      });

      const result = await response.json();
      
      if (result.success) {
        setSubmitMessage('Your request has been submitted successfully! We will contact you shortly.');
        
        // Reset form
        setFiles([]);
        setName('');
        setEmail('');
        setMessage('');
        setSelectedTier(null);
      } else {
        setSubmitMessage(`Error: ${result.error || 'Failed to submit request. Please try again.'}`);
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      setSubmitMessage('An error occurred while submitting your request. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mixing-mastering-container">
      <section className="services-intro">
        <h2>Professional Mixing & Mastering Services</h2>
        <p>
          Take your music to the next level with our professional mixing and mastering services. 
          We offer different tiers to suit your needs and budget, ensuring your tracks sound 
          polished and ready for release on all platforms.
        </p>
        <div className="services-highlights">
          <div className="highlight-item">
            <span className="highlight-icon">🎚️</span>
            <h3>Professional Quality</h3>
            <p>Industry standard processing and techniques</p>
          </div>
          <div className="highlight-item">
            <span className="highlight-icon">⏱️</span>
            <h3>Quick Turnaround</h3>
            <p>Get your tracks back in as little as 3 days</p>
          </div>
          <div className="highlight-item">
            <span className="highlight-icon">🔄</span>
            <h3>Revision Included</h3>
            <p>We work until you're completely satisfied</p>
          </div>
        </div>
      </section>

      <section className="service-tiers">
        <h3>Choose Your Service Tier</h3>
        <p className="service-subtitle">Select the package that best fits your project needs</p>
        <div className="tier-cards">
          {serviceTiers.map((tier) => (
            <div 
              key={tier.id} 
              className={`tier-card ${selectedTier === tier.id ? 'selected' : ''}`}
              onClick={() => handleTierSelect(tier.id)}
              role="button"
              tabIndex={0}
              aria-pressed={selectedTier === tier.id}
            >
              <div className="tier-badge">{tier.id === 'standard' ? 'MOST POPULAR' : ''}</div>
              <h4>{tier.name}</h4>
              <div className="tier-price">{tier.price}</div>
              <div className="tier-turnaround">Turnaround: {tier.turnaround}</div>
              {tier.description && <p className="tier-description">{tier.description}</p>}
              <ul className="tier-features">
                {tier.features.map((feature, index) => (
                  <li key={index}>{feature}</li>
                ))}
              </ul>
              <button 
                className="select-tier-btn" 
                onClick={(e) => {
                  e.stopPropagation(); // Prevent triggering the parent div's onClick
                  handleTierSelect(tier.id);
                }}
                type="button"
              >
                {selectedTier === tier.id ? 'Selected' : 'Select'}
              </button>
            </div>
          ))}
        </div>
      </section>

      <section id="upload-section" className="file-upload-section">
        <h3>Upload Your Files</h3>
        <p className="upload-instructions">
          Please upload your project files or stems in WAV or AIFF format (24-bit preferred). 
          For mixing projects, please ensure each track is properly labeled and organized.
        </p>
        
        <div className="file-requirements">
          <h4>File Requirements:</h4>
          <ul>
            <li>WAV or AIFF format (24-bit, 44.1kHz or higher)</li>
            <li>Properly labeled tracks (e.g., "Kick", "Snare", "Vocals")</li>
            <li>Include any reference tracks if available</li>
            <li>Maximum file size: 500MB per file</li>
            <li>Compress multiple files into a ZIP archive if possible</li>
          </ul>
        </div>

        <form onSubmit={handleSubmit} className="upload-form">
          <div className="form-group">
            <label htmlFor="name">Name</label>
            <input 
              type="text" 
              id="name" 
              value={name} 
              onChange={(e) => setName(e.target.value)} 
              required 
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input 
              type="email" 
              id="email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              required 
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="service-tier">Selected Service</label>
            <input 
              type="text" 
              id="service-tier" 
              value={selectedTier ? serviceTiers.find(tier => tier.id === selectedTier)?.name || '' : ''} 
              readOnly 
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="file-upload">Upload Files</label>
            <input 
              type="file" 
              id="file-upload" 
              onChange={handleFileChange} 
              multiple 
              ref={fileInputRef}
              accept=".wav,.aiff,.mp3,.zip,.rar"
            />
            <button 
              type="button" 
              className="browse-btn" 
              onClick={() => fileInputRef.current?.click()}
            >
              Browse Files
            </button>
          </div>
          
          {files.length > 0 && (
            <div className="file-list">
              <h4>Uploaded Files:</h4>
              <ul>
                {files.map((file, index) => (
                  <li key={index}>
                    {file.name} ({(file.size / (1024 * 1024)).toFixed(2)} MB)
                    <button 
                      type="button" 
                      className="remove-file-btn" 
                      onClick={() => removeFile(index)}
                    >
                      Remove
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
          
          <div className="form-group">
            <label htmlFor="message">Additional Instructions</label>
            <textarea 
              id="message" 
              value={message} 
              onChange={(e) => setMessage(e.target.value)} 
              placeholder="Please provide any specific instructions or details about your project..."
              rows={5}
            />
          </div>
          
          <button 
            type="submit" 
            className="submit-btn" 
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Submitting...' : 'Submit Request'}
          </button>
          
          {submitMessage && (
            <div className={`submit-message ${submitMessage.includes('successfully') ? 'success' : 'error'}`}>
              {submitMessage}
            </div>
          )}
        </form>
      </section>

      <section className="faq-section">
        <h3>Frequently Asked Questions</h3>
        <div className="faq-items">
          <div className="faq-item">
            <h4>What's the difference between mixing and mastering?</h4>
            <p>
              Mixing involves balancing individual tracks, applying effects, and creating a cohesive sound. 
              Mastering is the final polish applied to the entire mix, ensuring it sounds consistent across all playback systems.
            </p>
          </div>
          
          <div className="faq-item">
            <h4>How should I prepare my files?</h4>
            <p>
              Export each track as individual WAV or AIFF files (24-bit, 44.1kHz or higher). 
              Ensure all tracks start at the same point and include any effects that are essential to the sound.
            </p>
          </div>
          
          <div className="faq-item">
            <h4>How many revisions do I get?</h4>
            <p>
              The number of revisions depends on your selected tier. Basic includes 2 revisions, 
              Standard includes 3 revisions, and Premium includes unlimited revisions.
            </p>
          </div>
          
          <div className="faq-item">
            <h4>What if I'm not satisfied with the result?</h4>
            <p>
              Your satisfaction is our priority. If you're not happy with the result, we'll work with you 
              to address your concerns within the revision limits of your selected tier.
            </p>
          </div>
          
          <div className="faq-item">
            <h4>How do I receive my files?</h4>
            <p>
              Once your project is complete, you'll receive a download link via email with your 
              final files in the formats included in your selected tier.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default MixingMasteringGrid;
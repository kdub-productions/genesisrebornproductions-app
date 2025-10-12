"use client";

import { useState, useEffect, useRef } from 'react';
import '@/styles/Mixing-mastering-styles/mixingmasteringGrid.css';
import MixingMasteringSale from '@/components/sales/mixing-mastering-sale';

interface MixingMasteringGridProps {
  setLoading: (loading: boolean) => void;
}

export const MixingMasteringGridComponent = ({ setLoading }: MixingMasteringGridProps) => {
  const [selectedTier, setSelectedTier] = useState<string | null>(null);
  const [files, setFiles] = useState<File[]>([]);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState('');
  const [saleActive, setSaleActive] = useState(false); 
  const [salePercentage, setSalePercentage] = useState<number>(30); // change this number to set percent (e.g. 30)
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 100);

    return () => {
      clearTimeout(timer);
    };
  }, [setLoading]);

  // Sale is controlled by the `saleActive` and `salePercentage` defaults above.
  // To change sale behavior, edit the values above in this file.

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
      id: 'vocal-prod', 
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
    },
    {
      id: 'vocal-splitting', 
      name: 'Vocal Splitting',
      price: '$300', 
      turnaround: '10-15 days', 
      description: 'Advanced AI-powered service to isolate vocals from a mixed track for remixing, karaoke, or archival purposes.',
      features: [
        'High-quality vocal stem isolation from stereo mix',
        'Instrumental track generation (minus vocals)',
        'Delivery of separated vocal and instrumental WAV files',
        'Ideal for remixers, producers, and DJs needing acapellas',
        'One revision included for artifact review',
        'Utilizes cutting-edge source separation technology',
        'Note: Quality depends heavily on source material complexity'
      ]
    },
  ];

  const handleTierSelect = (tierId: string) => {
    setSelectedTier(tierId);
    const tierName = serviceTiers.find(tier => tier.id === tierId)?.name;
    setSubmitMessage(`You selected: ${tierName}. Please complete the form below.`);
    document.getElementById('upload-section')?.scrollIntoView({ behavior: 'smooth' });
    setTimeout(() => {
      if (submitMessage.startsWith(`You selected: ${tierName}`)) {
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
      setSubmitMessage('Please upload at least one file or provide a link in the message');
      return;
    }

    // Client-side size check
    const totalSize = files.reduce((sum, file) => sum + file.size, 0);
    if (totalSize > 20 * 1024 * 1024) { // 20MB
      setSubmitMessage('Total file size exceeds 20MB. Please use file links (WeTransfer, Dropbox) instead.');
      return;
    }

    setIsSubmitting(true);
    setSubmitMessage('Submitting your request...');

    try {
      const formData = new FormData();
      formData.append('name', name);
      formData.append('email', email);
      formData.append('selectedTierId', selectedTier);
      formData.append('message', message);

      files.forEach(file => {
        formData.append('files', file);
      });

      const response = await fetch('/api/email/mixing-request', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();

      if (response.ok && result.success) {
        setSubmitMessage('Your request has been submitted successfully! Check your email for confirmation. We will send an invoice shortly.');
        setFiles([]);
        setName('');
        setEmail('');
        setMessage('');
        setSelectedTier(null);
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
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
        {saleActive && (
          <div className="store-wide-sale-banner">
            <h2>{salePercentage}% OFF ALL MIXING & MASTERING SERVICES!</h2>
            <p>(Discount applied automatically at invoice)</p>
          </div>
        )}
        <h2>Professional Mixing & Mastering Services</h2>
        <p>
          Take your music to the next level with our professional mixing and mastering services.
          We offer different tiers to suit your needs and budget, ensuring your tracks sound
          polished and ready for release on all platforms. Explore our specialized Vocal Production and Vocal Splitting services too!
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
              onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') handleTierSelect(tier.id); }} // Added keyboard accessibility
            >
              
              <div className="tier-badge">{tier.id === 'standard' ? 'MOST POPULAR' : ''}</div>
              <h4>{tier.name}</h4>
              <div className="tier-price">
                {saleActive ? (
                  <MixingMasteringSale
                    originalPrice={parseInt(tier.price.replace('$', ''))}
                    serviceName={tier.name}
                    discountPercentage={salePercentage}
                  />
                ) : (
                  <span className="regular-price">{tier.price}</span>
                )}
              </div>
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
                  e.stopPropagation();
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
        <h3>Upload Your Files & Provide Details</h3>
        <p className="upload-instructions">
          Select your desired service above, then provide your contact information and upload your audio file(s).
          For mixing/mastering, please upload stems (WAV/AIFF, 24-bit preferred). For Vocal Splitting, upload the final stereo mix.
        </p>

        <div className="file-requirements">
          <h4>File Requirements:</h4>
          <ul>
            <li>Mixing/Mastering: WAV or AIFF stems (24-bit, 44.1kHz+), properly labeled.</li>
            <li>Vocal Splitting: Final Stereo Mix (WAV, AIFF, or high-quality MP3).</li>
            <li>Include reference tracks if available (link in message).</li>
            <li>Max file size via form: 25MB per file (uses email).</li>
            <li>For larger files/stems: Use WeTransfer/Dropbox/Google Drive and paste the share link in the message below.</li>
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
              aria-required="true"
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
              aria-required="true"
            />
          </div>

          <div className="form-group">
            <label htmlFor="service-tier">Selected Service</label>
            <input
              type="text"
              id="service-tier"
              value={selectedTier ? serviceTiers.find(tier => tier.id === selectedTier)?.name || '' : 'Please select a tier above'}
              readOnly
              aria-label="Selected service tier (read-only)"
            />
          </div>

          <div className="form-group file-input-group"> {}
            <label htmlFor="file-upload">Upload Files (or provide link below)</label>
            <input
              type="file"
              id="file-upload"
              onChange={handleFileChange}
              multiple
              ref={fileInputRef}
              accept=".wav,.aiff,.mp3,.zip,.rar"
              style={{ display: 'none' }}
              aria-hidden="true" 
            />
            <button
              type="button"
              className="browse-btn"
              onClick={() => fileInputRef.current?.click()}
            >
              Browse Files...
            </button>
            <span className="file-info">Max 25MB per file via form</span> {/* Added info */}
          </div>

          {files.length > 0 && (
            <div className="file-list">
              <h4>Selected Files:</h4>
              <ul>
                {files.map((file, index) => (
                  <li key={index}>
                    <span className="file-name">{file.name}</span>
                    <span className="file-size">({(file.size / (1024 * 1024)).toFixed(2)} MB)</span>
                    <button
                      type="button"
                      className="remove-file-btn"
                      onClick={() => removeFile(index)}
                      aria-label={`Remove ${file.name}`}
                    >
                      &times; {}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="form-group">
            <label htmlFor="message">Additional Instructions / File Link</label>
            <textarea
              id="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Provide specific instructions, reference track info, or a link to your files (WeTransfer, Dropbox, Google Drive)..."
              rows={5}
            />
          </div>

          <button
            type="submit"
            className="submit-btn"
            disabled={isSubmitting || !selectedTier} // Also disable if no tier selected
            aria-disabled={isSubmitting || !selectedTier}
          >
            {isSubmitting ? 'Submitting...' : 'Submit Request'}
          </button>

          {submitMessage && (
            <div role="alert" className={`submit-message ${submitMessage.includes('successfully') ? 'success' : submitMessage.includes('Please select') ? 'info' : 'error'}`}>
              {submitMessage}
            </div>
          )}
        </form>
      </section>

      {/* --- FAQ Section remains the same --- */}
      <section className="faq-section">
        <h3>Frequently Asked Questions</h3>
        <div className="faq-items">
          {/* Consider adding a FAQ specific to Vocal Splitting */}
          <div className="faq-item">
            <h4>What is Vocal Splitting?</h4>
            <p>
              Vocal Splitting uses advanced algorithms to separate the vocal track from a finished stereo mix, providing you with an acapella and an instrumental version. This is useful for remixes, karaoke tracks, or sampling. The quality can vary depending on the complexity of the original mix.
            </p>
          </div>
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
              For Mixing/Mastering: Export each track as individual WAV or AIFF files (24-bit, 44.1kHz+), starting from the beginning of the song. Remove unnecessary effects unless crucial to the sound. Label tracks clearly.
              For Vocal Splitting: Provide the highest quality version of the final stereo mix you have (WAV, AIFF, or 320kbps MP3).
            </p>
          </div>

          <div className="faq-item">
            <h4>How many revisions do I get?</h4>
            <p>
              Revisions vary by tier: Basic (2), Standard (3), Premium (Unlimited), Vocal Production (2), Vocal Splitting (1 for artifact review). Revisions cover adjustments based on your feedback, not fundamental changes to the source material.
            </p>
          </div>

          <div className="faq-item">
            <h4>What if I'm not satisfied with the result?</h4>
            <p>
              Your satisfaction is our priority. We'll use the included revisions to address your feedback. For Vocal Splitting, please note that the technology has limitations based on the source audio.
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

export default MixingMasteringGridComponent;

'use client';
import { useState } from 'react';
import { Beat } from '../beats';
import { License } from '../app/api/licenses';

interface BeatPurchaseFormProps {
  beat: Beat;
  license: License;
  onSubmit: (customerInfo: { firstName: string; lastName: string; email: string }) => void;
  onCancel: () => void;
}

const BeatPurchaseForm = ({ beat, license, onSubmit, onCancel }: BeatPurchaseFormProps) => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      const response = await fetch('/api/email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          firstName,
          lastName,
          email,
          beatTitle: beat.title,
          licenseType: license.name,
          price: license.price,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to send purchase request');
      }

      // Store customer info in localStorage for the payment confirmation email
      localStorage.setItem('customerInfo', JSON.stringify({ firstName, lastName, email }));
      
      setSuccess(true);
      setTimeout(() => {
        onSubmit({ firstName, lastName, email });
      }, 1500);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="beat-purchase-form">
      <h3>Purchase Request for {beat.title}</h3>
      <p>License: {license.name} - ${license.price.toFixed(2)}</p>
      
      {success ? (
        <div className="success-message">
          <p>Your purchase request has been sent! Proceeding to payment...</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit}>
          {error && <div className="form-error">{error}</div>}
          
          <div className="form-group">
            <label htmlFor="firstName">First Name</label>
            <input
              type="text"
              id="firstName"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              required
              disabled={submitting}
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="lastName">Last Name</label>
            <input
              type="text"
              id="lastName"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              required
              disabled={submitting}
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="email">Your Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={submitting}
            />
          </div>
          
          <div className="form-actions">
            <button 
              type="button" 
              onClick={onCancel}
              disabled={submitting}
              className="cancel-button"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              disabled={submitting}
              className="submit-button"
            >
              {submitting ? 'Sending...' : 'Continue to Payment'}
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default BeatPurchaseForm;
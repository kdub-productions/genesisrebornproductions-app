"use client";
import { useState, useEffect } from 'react';
import { Beat as ApiBeat } from '@/types/beats';
import { License } from '@/app/api/licenses';
import Loading from '@/components/loading';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import Image from 'next/image';
import '@/styles/beats-shop-page-styles/payment.css';
import '@/styles/beats-shop-page-styles/beats-store.css';
import '@/styles/site-wide-styles/styles.css';
import '@/styles/beats-shop-page-styles/beat-purchase-form.css';
import '@/styles/beats-shop-page-styles/payment-confirmation.css';
import '@/styles/site-wide-styles/sale-component.css';
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import BeatPurchaseForm from "@/components/BeatPurchaseForm";
import PaymentConfirmationPopup from "@/components/PaymentConfirmationPopup";
import BeatStoreSale from '@/components/sales/beats-store-sale'; // Remove this line to disable sale

// Update the Beat interface to match the one in beats.ts
interface Beat {
  id: number;
  title: string;
  genre: string;
  artwork: string;
  audioPreview: string;
  fullAudioId: number;
  price: number;
  license: License; // Single license
}

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || '');

// Component to handle Stripe payment functionality
const CheckoutForm = ({ beat, license, onPaymentComplete, onCancel }: { beat: ApiBeat, license: License, onPaymentComplete?: () => void, onCancel?: () => void }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [paymentError, setPaymentError] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);
  const [email, setEmail] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  
  // Get customer info from localStorage if available
  useEffect(() => {
    const customerInfo = JSON.parse(localStorage.getItem('customerInfo') || '{}');
    if (customerInfo.email) setEmail(customerInfo.email);
    if (customerInfo.firstName) setFirstName(customerInfo.firstName);
    if (customerInfo.lastName) setLastName(customerInfo.lastName);
  }, []);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
  
    if (!stripe || !elements) return;
  
    setProcessing(true);
    setPaymentError(null);
  
    try {
      const response = await fetch('/api/stripe/create-payment-intent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          beatId: beat.id,
          licenseId: license.id,
          price: license.price,
          email: email,
          firstName: firstName,
          lastName: lastName,
        }),
      });
  
      const { clientSecret, error: backendError } = await response.json();
  
      if (backendError) {
        setPaymentError(backendError);
        setProcessing(false);
        return;
      }
  
      const cardElement = elements.getElement(CardElement);
      if (!cardElement) {
        setPaymentError('Card element not found');
        setProcessing(false);
        return;
      }
  
      const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: cardElement,
          billing_details: {
            name: `${firstName} ${lastName}`,
            email: email,
          },
        },
      });
  
      if (error) {
        setPaymentError(error.message || 'An error occurred during payment');
      } else if (paymentIntent.status === 'succeeded') {
        try {
          await fetch('/api/email/confirmation', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              firstName: firstName,
              lastName: lastName,
              email: email,
              message: `Beat Purchase Confirmation: Beat Title: ${beat.title}, License Type: ${license.name}, Price: $${license.price.toFixed(2)}, Payment ID: ${paymentIntent.id}`,
            }),
          });
  
          if (onPaymentComplete) onPaymentComplete();

        } catch (emailError) {
          console.error('Error sending confirmation email:', emailError);
          // Don't show this error to the user, as payment was successful
        }
        if (onPaymentComplete) onPaymentComplete();
      }
    } catch (err) {
      setPaymentError('An unexpected error occurred.');
      console.error('Payment error:', err);
    } finally {
      setProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {paymentError && (
        <div className="payment-error">{paymentError}</div>
      )}
      {processing && (
        <div className="payment-processing">Processing payment...</div>
      )}
      <div className="form-group">
        <label htmlFor="firstName">First Name</label>
        <input
          type="text"
          id="firstName"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          required
          disabled={processing}
          placeholder="Enter your first name"
          className="email-input"
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
          disabled={processing}
          placeholder="Enter your last name"
          className="email-input"
        />
      </div>
      <div className="form-group">
        <label htmlFor="email">Email Address</label>
        <input
          type="email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          disabled={processing}
          placeholder="Enter your email address"
          className="email-input"
        />
      </div>
      <div className="card-element-container">
        <CardElement options={{ style: { base: { fontSize: '16px' } } }} />
      </div>
      <div className="form-actions">
        <button 
          type="button" 
          onClick={onCancel}
          disabled={processing}
          className="cancel-button"
        >
          Cancel
        </button>
        <button 
          type="submit" 
          className="buy-beat-button" 
          disabled={!stripe || processing}
        >
          Buy {license.name} License - ${license.price.toFixed(2)}
        </button>
      </div>
    </form>
  );
};

export default function BeatsForSale() {
  const [beatData, setBeatData] = useState<ApiBeat[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedBeat, setSelectedBeat] = useState<ApiBeat | null>(null);
  const [selectedLicense, setSelectedLicense] = useState<License | null>(null);
  const [showPaymentForm, setShowPaymentForm] = useState<boolean>(false);
  const [showThankYouPopup, setShowThankYouPopup] = useState<boolean>(false);
  const [saleActive] = useState<boolean>(false);
  const [salePercentage] = useState<number>(50); 

  useEffect(() => {
    const fetchBeats = async () => {
      const response = await fetch('/api/beats');
      const data = await response.json();
      setBeatData(data);
      setLoading(false);
    };

    fetchBeats();
  }, []);

  const handleLicenseSelect = (beat: ApiBeat, license: License) => {
    const finalPrice = saleActive ? license.price * ((100 - salePercentage) / 100) : license.price;
    setSelectedBeat(beat);
    setSelectedLicense(license);
    setShowPaymentForm(true);
  };

  const handlePaymentCancel = () => {
    setSelectedBeat(null);
    setSelectedLicense(null);
    setShowPaymentForm(false);
  };

  const handlePaymentComplete = () => {
    setSelectedBeat(null);
    setSelectedLicense(null);
    setShowPaymentForm(false);
    setShowThankYouPopup(true); // Show the thank you popup
  };

  return (
    <Elements stripe={stripePromise}>
      <div className="page-container">
        {loading && <Loading />}
        <Navbar />
        <div className='main-content'>
          <main>
            <section className="beats-store-container">
              {saleActive && (
                <div className="store-wide-sale-banner">
                  <h2>50% OFF ALL BEATS!</h2>
                </div>
              )}
              <h1 className="section-heading">Beats For Sale</h1>
              {beatData.length > 0 ? (
                <div className="beats-grid">
                  {beatData.map((beat) => (
                    <div key={beat.id} className="beat-card">
                      <div className="beat-artwork-container">
                        <Image
                          src={beat.artwork}
                          alt={`${beat.title} Artwork`}
                          width={300}
                          height={300}
                          className="beat-artwork"
                        />
                      </div>
                      <div className="beat-details">
                        <h3>{beat.title}</h3>
                        <p>Genre: {beat.genre}</p>
                        <div className="price-section">
                          {saleActive ? (
                            <BeatStoreSale 
                              originalPrice={beat.price} 
                              license={beat.license}
                              discountPercentage={salePercentage}
                              showBadge={true}
                            />
                          ) : (
                            <p>Price: ${beat.license.price.toFixed(2)}</p>
                          )}
                        </div>
                        <audio controls className="beat-audio-player">
                          <source src={beat.audioPreview} type="audio/mpeg" />
                          Your browser does not support the audio element.
                        </audio>
                        
                        <div>
                          {selectedBeat?.id === beat.id && selectedLicense?.id === beat.license.id ? (
                            showPaymentForm && (
                              <CheckoutForm 
                                beat={beat} 
                                license={beat.license} 
                                onPaymentComplete={handlePaymentComplete}
                                onCancel={handlePaymentCancel}
                              />
                            )
                          ) : (
                            <button
                              className="buy-beat-button"
                              onClick={() => handleLicenseSelect(beat, beat.license)}
                            >
                              Buy {beat.license.name} ${beat.license.price.toFixed(2)}
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p>Loading beats...</p>
              )}
            </section>
          </main>
        </div>
        <div className='site-footer'>
          <Footer />
        </div>
      </div>
      {showThankYouPopup && (
        <PaymentConfirmationPopup
          type="success"
          message="Your payment was successful. We appreciate your business! You will receive your beat in an Email in 1-3 days."
          onClose={() => setShowThankYouPopup(false)}
        />
      )}
    </Elements>
  );
}
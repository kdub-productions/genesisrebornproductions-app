'use client';
import { useEffect } from 'react';
import '@/styles/beats-shop-page-styles/payment-confirmation.css';

interface PaymentConfirmationPopupProps {
  type: 'success' | 'decline';
  message: string;
  onClose: () => void;
}

const PaymentConfirmationPopup = ({ type, message, onClose }: PaymentConfirmationPopupProps) => {
  // Close popup when Escape key is pressed
  useEffect(() => {
    const handleEscKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleEscKey);
    return () => {
      window.removeEventListener('keydown', handleEscKey);
    };
  }, [onClose]);

  const popupClass = type === 'success' ? 'payment-success-popup' : 'payment-decline-popup';
  const buttonClass = type === 'success' ? 'popup-success-button' : 'popup-decline-button';
  const title = type === 'success' ? 'Thank You for Your Purchase!' : 'Payment Failed';

  return (
    <>
      <div className="popup-overlay" onClick={onClose}></div>
      <div className={`payment-confirmation-popup ${popupClass}`}>
        <h2 className="popup-title">{title}</h2>
        {type === 'success' ? (
          <div className="success-content">
            <p className="popup-message">{message}</p>
            <p className="delivery-info">Your beat will be emailed to you within 1-3 business days.</p>
            <p className="contact-info">For any questions, please contact us at:<br />
              <a href="mailto:genesisrebornproductions@gmail.com">genesisrebornproductions@gmail.com</a>
            </p>
          </div>
        ) : (
          <p className="popup-message">{message}</p>
        )}
        <button className={`popup-button ${buttonClass}`} onClick={onClose}>
          {type === 'success' ? 'Continue' : 'Try Again'}
        </button>
      </div>
    </>
  );
};

export default PaymentConfirmationPopup;
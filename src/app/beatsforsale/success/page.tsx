'use client';
import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Loading from '@/components/loading';
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";

function SuccessContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (sessionId) {
      // Send email notification
      fetch('/api/stripe/checkout-success', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ sessionId }),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.success) {
            setSuccess(true);
          } else {
            setError(data.error || 'Failed to process purchase');
          }
        })
        .catch((err) => {
          setError('An error occurred while processing your purchase');
          console.error(err);
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      setError('Invalid session');
      setLoading(false);
    }
  }, [sessionId]);

  return (
    <div className="page-container">
      <Navbar />
      <div className="main-content">
        <main>
          <section className="success-section">
            {loading && <Loading />}
            {error && (
              <div className="error-message">
                <h1>Payment Error</h1>
                <p>{error}</p>
                <p>Please contact support if this persists.</p>
              </div>
            )}
            {success && (
              <div className="success-message">
                <h1>Thank You for Your Purchase!</h1>
                <p>Your payment was successful. We appreciate your business!</p>
                <p>You will receive your beat in an email in 1-3 days.</p>
                <p>An email confirmation has been sent to your inbox.</p>
              </div>
            )}
          </section>
        </main>
      </div>
      <div className="site-footer">
        <Footer />
      </div>
    </div>
  );
}

export default function Success() {
  return (
    <Suspense fallback={<Loading />}>
      <SuccessContent />
    </Suspense>
  );
}

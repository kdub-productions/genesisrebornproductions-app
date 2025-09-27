"use client";
import { useState, useEffect } from 'react';
import Loading from "@/components/loading";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import "@/styles/site-wide-styles/loading.css";
import SocialMedias from '@/components/socialmedias';
export default function Home() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log("Initial loading state:", loading);
    // Loading state now fully controlled by VideoGrid component
    return () => setLoading(true); // Reset on unmount
  }, []);

  return (
    <>
      <div className="page-container">
        <Navbar />
        <div className='main-content'>
          <main>
            <section className="social-grid-section">
              <h1 className="section-heading">Social Media</h1>
            <SocialMedias setLoading={setLoading} />
                {loading && <Loading />}
            </section>
          </main>
        </div>
        <div className='site-footer'>
          <Footer />
        </div>
      </div>
    </>
  );
}

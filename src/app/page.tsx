"use client";
import { useState, useEffect } from 'react';
import Navbar from "@/components/navbar";
import VideoGrid from "@/components/VideoGrid";
import Footer from "@/components/footer";
import Loading from "@/components/loading";
import "@/styles/site-wide-styles/loading.css";

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
        {loading && <Loading />}
        <Navbar />
        <div className='main-content'>
          <main>
            <section className="video-grid-section">
              <h1 className="section-heading">Featured Videos</h1>
              <VideoGrid setLoading={setLoading} />
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
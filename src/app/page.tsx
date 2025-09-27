"use client";
import { useState, useEffect, Suspense, lazy } from 'react';
import Navbar from "@/components/navbar";
const VideoGrid = lazy(() => import("@/components/VideoGrid"));
import Footer from "@/components/footer";
import Loading from "@/components/loading";

export default function Home() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // initial loading is true; VideoGrid will call setLoading(false) when ready
    console.log("Initial loading state:", loading);
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
              <Suspense fallback={<div className="loading-placeholder">Loading videos...</div>}>
                <VideoGrid setLoading={setLoading} />
              </Suspense>
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
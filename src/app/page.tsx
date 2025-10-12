"use client";
import { useState, useEffect, Suspense } from 'react';
import Head from 'next/head';
import Navbar from "@/components/navbar";
import VideoGrid from '@/components/VideoGrid';
import Footer from "@/components/footer";
import Loading from "@/components/loading";
// client-only debug and ads loader (direct imports to avoid lazy null/hydration mismatches)
import EnvDebug from '@/components/envDebug';
import AdsLoader from '@/components/AdsLoader';

export default function Home() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // initial loading is true; VideoGrid will call setLoading(false) when ready
    console.log("Initial loading state:", loading);
  }, []);

  return (
    <>
      <div className="page-container">
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
        <Suspense fallback={null}>
          {process.env.NODE_ENV === 'development' && <EnvDebug />}
          <AdsLoader />
        </Suspense>
      </div>
    </>
  );
}
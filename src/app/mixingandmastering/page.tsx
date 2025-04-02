"use client";

import { useEffect, useRef } from 'react';
import React, { useState } from 'react';
import '@/styles/Mixing-mastering-styles/mixingmasteringGrid.css';
import '@/styles/site-wide-styles/styles.css';
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import Loading from "@/components/loading";
import Mixingmastering from "@/components/mixingmastering";
export default function Home() {
  const [loading, setLoading] = useState<boolean>(true);

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
            <section className="mixandmasterservices">
              <h1 className="section-heading">Mixing and Mastering Services</h1>
              <Mixingmastering setLoading={setLoading} />
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

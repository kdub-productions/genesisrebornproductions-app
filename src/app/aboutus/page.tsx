"use client";

import { useEffect, useState } from 'react';
import '@/styles/mixingmasteringGrid.css';
import '@/styles/styles.css';
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import Loading from "@/components/loading";
import AboutUsComponent from "@/components/aboutus"; // Changed import name

export default function About() {
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    // Simulate loading delay for demonstration purposes
    const timer = setTimeout(() => {
      setLoading(false);
    }, 500); // Adjust the delay as needed

    return () => {
      clearTimeout(timer); // Clear the timer on unmount
      setLoading(true); // Reset loading state on unmount
    };
  }, []);

  return (
    <div className="page-container">
      {loading && <Loading />}
      <Navbar />
      <div className='main-content'>
        <main>
          <section className="mixandmasterservices">
            <h1 className="section-heading">About Us</h1>
            <AboutUsComponent setLoading={setLoading} /> {/* Changed component name */}
          </section>
        </main>
      </div>
      <div className='site-footer'>
        <Footer />
      </div>
    </div>
  );
}

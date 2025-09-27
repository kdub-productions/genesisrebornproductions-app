"use client";

import { useEffect } from 'react';
import '@/styles/other-page-styles/aboutus.css';

interface AboutUsProps {
  setLoading: (loading: boolean) => void;
}

const AboutUsComponent = ({ setLoading }: AboutUsProps) => {
  useEffect(() => {
    // Set loading to false when component is mounted
    setLoading(false);
    return () => setLoading(true); // Reset on unmount
  }, [setLoading]);

  return (
    <div className="about-us-container">
      <div className="about-us-content">
        <h2>Our Story</h2>
        <p>
          Genesis Reborn Productions was founded with a passion for transforming raw musical talent into polished, professional productions. 
          Our journey began with a simple belief: every artist deserves access to high-quality production services that can elevate their sound 
          to industry standards without breaking the bank.
        </p>
        
        <h2>Our Mission</h2>
        <p>
          We are dedicated to providing exceptional mixing, mastering, and production services that help independent artists and musicians 
          achieve their creative vision. We believe in building long-term relationships with our clients, understanding their unique sound, 
          and delivering results that exceed expectations.
        </p>
        
        <h2>Our Approach</h2>
        <p>
          At Genesis Reborn Productions, we combine technical expertise with artistic sensibility. We don't just mix and master tracks; 
          we enhance the emotional impact of your music while maintaining its authentic character. Our approach is collaborative, 
          transparent, and focused on bringing your creative vision to life.
        </p>
        
        <h2>Our Team</h2>
        <div className="team-member">
          <h3>KDUB</h3>
          <p className="team-role">Founder, Current Owner & Lead Engineer</p>
          <p>
Mixing and mastering our groups music from the beginning.
          </p>
        </div>
        
        <div className="team-member">
          <h3>PrimoSKT</h3>
          <p className="team-role">CEO</p>
          <p>
          Making music with us since the beginning. Wanting to learn and branch out we have developed this company to help artists reach their goals.
          </p>
        </div>
        <div className="team-member">
          <h3>Yung Rahk</h3>
          <p className="team-role">Design and Marketing Lead</p>
          <p>
          Yung Rahk or Rahk Da Ahk has also been making music with us since the beginning. He has been a big part of our developemnt around God. 
          Rahk is also the owner of the record label, Real Royalty Records. <a href="https://realroyaltyrecords.vercel.app" target="_blank" rel="noopener noreferrer">https://realroyaltyrecords.vercel.app</a>
          </p>
        </div>
        <h2>Our Studio</h2>
        <p>
We use FL Studio and a variety of plugins to create the best sound possible.
        </p>
        <div className="bonus-content">
        <h2>Bonus Content</h2>
        <p>
        This is a prerelease version of our site so you can see part of the development process.      
        </p>
        <a href="https://kdub-productions.github.io" target="_blank" rel="noopener noreferrer">
          ( Click Here To Visit Beta Site @https://kdub-productions.github.io )
          </a>
      </div>
      </div>

    </div>
  );
};

export default AboutUsComponent;
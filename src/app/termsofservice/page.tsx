"use client"
import React from 'react';
import '@/styles/termsofservice.css';
import '@/styles/styles.css';
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import TermsOfService from '@/components/termsofservicecomp';
const TermsOfServicepage: React.FC = () => {
  return (
    <div className="page-container">
      <Navbar />
    <div className="main-content">
   <TermsOfService />
    </div>
    <Footer />
    </div>
  );
};

export default TermsOfServicepage;

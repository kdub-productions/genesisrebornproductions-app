"use client"
import React from 'react';
import '@/styles/other-page-styles/privacyPolicy.css';
import '@/styles/site-wide-styles/styles.css';
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import PrivacyPolicycomp from "@/components/privacypolicycomp";
const PrivacyPolicyPage: React.FC = () => {
  return (
    <div className="page-container">
      <Navbar />
    <div className="main-content">
   <PrivacyPolicycomp />
    </div>
    <Footer />
    </div>
  );
};

export default PrivacyPolicyPage;

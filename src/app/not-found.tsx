'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import '../styles/notFound.css';
import '../styles/styles.css';
import "../styles/loading.css";

export default function NotFound() {
  useEffect(() => {
    document.body.style.background = 'linear-gradient(135deg, #6B46C1 0%, #3182CE 100%)';
    return () => {
      document.body.style.background = '';
    };
  }, []);

  return (
    <div className="notFoundContainer">
      <div className="errorSection">
        <h1 className="errorCode">Heck!</h1>
        <h2 className="errorTitle">Page Not Found</h2>
        <p className="errorMessage">
          Sorry, we couldn't find the page you're looking for. Site is in constant development.
        </p>
        <Link href="/" className="homeButton">
          Return Home
        </Link>
        <div>
          ------
        </div>
        <Link href="/beatsforsale" className="homeButton">
        Or Check Out Our Beats
        </Link>
      </div>
    </div>
  );
}
import React from 'react';
import '@/styles/site-wide-styles/loading.css';

const Loading = () => {
  return (
    <div className="loading-overlay">
      <div className="loading-spinner"></div>
      <div className="loading-text">Loading...</div>
    </div>
  );
};

export default Loading;

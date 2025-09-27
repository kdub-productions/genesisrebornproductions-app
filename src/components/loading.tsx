import React, { useEffect, useState } from 'react';

interface LoadingProps {
  message?: string;
  fullScreen?: boolean; // keep for future use if you want inline loaders
}

const Loading: React.FC<LoadingProps> = ({ message = 'Loading...', fullScreen = true }) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // small delay to allow CSS enter transition to run
    const t = setTimeout(() => setMounted(true), 10);
    return () => clearTimeout(t);
  }, []);

  return (
    <div
      className={`loading-overlay ${mounted ? 'visible' : 'hidden'} ${fullScreen ? 'full' : 'inline'}`}
      role="status"
      aria-live="polite"
      aria-label={message}
    >
      <div className="loading-spinner" aria-hidden="true"></div>
      <div className="loading-text">{message}</div>
    </div>
  );
};

export default Loading;

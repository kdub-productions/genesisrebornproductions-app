"use client";
import React, { useEffect, useState, useRef } from 'react';
import CookieConsent from './CookieConsent';

const CONSENT_KEY = 'grps_cookie_consent_v1';

function injectScript(src: string, attrs: Record<string,string|boolean> = {}) {
  const s = document.createElement('script');
  s.src = src;
  s.async = true;
  Object.entries(attrs).forEach(([k,v]) => {
    if (typeof v === 'boolean') {
      if (v) s.setAttribute(k, '');
    } else {
      s.setAttribute(k, String(v));
    }
  });
  document.getElementById('ads-root')?.appendChild(s);
  return s;
}

export default function AdsLoader() {
  const [consent, setConsent] = useState<boolean | null>(null);
  const injectedRef = useRef(false);

  useEffect(() => {
    if (process.env.NODE_ENV !== 'production') {
      // In development, do not inject ad scripts. Hide by default.
      setConsent(false);
      return;
    }

    try {
      const stored = localStorage.getItem(CONSENT_KEY);
      if (stored === '1') setConsent(true);
      else if (stored === '0') setConsent(false);
      else setConsent(null);
    } catch (e) {
      // Storage access blocked; be conservative
      setConsent(false);
    }
  }, []);

  useEffect(() => {
    if (consent) {
      // Don't inject more than once
      if (injectedRef.current) return;

      // Poll briefly for an ad slot to appear. Some pages render ad slots after hydration.
      const maxAttempts = 5;
      let attempts = 0;
      const interval = setInterval(() => {
        attempts += 1;
        const hasSlot = !!document.querySelector('ins.adsbygoogle');
        if (hasSlot) {
          injectedRef.current = true;
          injectScript('https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-4585137285765836', { crossOrigin: 'anonymous' });
          clearInterval(interval);
        } else if (attempts >= maxAttempts) {
          // Give up after a few tries to avoid long-running polling
          console.info('AdsLoader: no ins.adsbygoogle slot found after polling; skipping ad script injection.');
          clearInterval(interval);
        }
      }, 250);
    }
  }, [consent]);

  return (
    <>
      <CookieConsent onConsent={(c) => setConsent(c)} />
      {/* nothing visual here; scripts mount into #ads-root when consent is true */}
    </>
  );
}

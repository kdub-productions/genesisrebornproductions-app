"use client";
import React, { useEffect, useState } from 'react';

const CONSENT_KEY = 'grps_cookie_consent_v1';

export default function CookieConsent({ onConsent }: { onConsent?: (consented: boolean) => void }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(CONSENT_KEY);
      if (!stored) setVisible(true);
    } catch (e) {
      // localStorage may be blocked in some privacy modes; don't show consent so we avoid injecting ads
      setVisible(false);
    }
  }, []);

  const accept = () => {
    try { localStorage.setItem(CONSENT_KEY, '1'); } catch {}
    setVisible(false);
    onConsent?.(true);
  };

  const decline = () => {
    try { localStorage.setItem(CONSENT_KEY, '0'); } catch {}
    setVisible(false);
    onConsent?.(false);
  };

  if (!visible) return null;

  return (
    <div style={{position: 'fixed', left: 12, bottom: 12, zIndex: 99998, background: 'rgba(0,0,0,0.8)', color: '#fff', padding: '10px 12px', borderRadius: 8, maxWidth: 360}}>
      <div style={{marginBottom: 8, fontWeight: 700}}>This site uses ads</div>
      <div style={{fontSize: 13, marginBottom: 10}}>To support the site we display ads. Accept to enable ads and a better experience.</div>
      <div style={{display: 'flex', gap: 8}}>
        <button onClick={accept} style={{background: '#0b7', border: 'none', padding: '6px 10px', borderRadius: 6, cursor: 'pointer'}}>Accept</button>
        <button onClick={decline} style={{background: '#444', color: '#fff', border: 'none', padding: '6px 10px', borderRadius: 6, cursor: 'pointer'}}>Decline</button>
      </div>
    </div>
  );
}

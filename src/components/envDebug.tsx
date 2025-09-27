"use client";
import React from 'react';

const EnvDebug: React.FC = () => {
  const has = (v?: string) => (v ? 'set' : 'missing');

  return (
    <div style={{position: 'fixed', right: 12, bottom: 12, zIndex: 99999, background: 'rgba(255,255,255,0.95)', border: '1px solid #eee', padding: '8px 10px', borderRadius: 8, boxShadow: '0 6px 18px rgba(0,0,0,0.08)', fontSize: 12, color: '#111'}}>
      <div style={{fontWeight: 700, marginBottom: 6}}>Env (debug)</div>
      <div>NODE_ENV: {process.env.NODE_ENV ?? 'missing'}</div>
      <div>NEXT_PUBLIC_YOUTUBE_API_KEY: {has(process.env.NEXT_PUBLIC_YOUTUBE_API_KEY)}</div>
      <div>NEXT_PUBLIC_YOUTUBE_CHANNEL_ID: {has(process.env.NEXT_PUBLIC_YOUTUBE_CHANNEL_ID)}</div>
      <div>NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: {has(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY)}</div>
    </div>
  );
};

export default EnvDebug;

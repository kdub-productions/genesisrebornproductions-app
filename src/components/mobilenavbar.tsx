import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import "@/styles/site-wide-styles/styles.css";

export default function MobileNavbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <div className={`mobile-navbar ${menuOpen ? "menu-open" : ""}`}>
      <div className="mobile-header">
        <button className="menu-toggle" onClick={toggleMenu}>
          {menuOpen ? "✕" : "☰"}
        </button>
        <div className="mobile-logo2">
          <Image
            src="/images/Genisis Reborn _real_logo_3.png?v=2"
            alt="Genesis Reborn Productions Logo"
            width={300}
            height={90}
            priority
          />
        </div>
      </div>
      {menuOpen && (
        <div className="mobile-navbar-content">
          <div className="mobile-logo">
          <Link href='/'>
            <Image
              src="/images/Genisis Reborn _real_logo SNAKE AND APPLE.png"
              alt="Genesis Reborn Productions Logo"
              width={300}
              height={120}
              priority
            />
            </Link>
          </div>
          <ul className="mobile-nav-links">
            <li><Link href="/beatsforsale" className="buy-button">🔥 Buy Beats</Link></li>
            <li><Link href="/">Home</Link></li>
            <li><Link href="/lyrics">Lyrics</Link></li>
            <li><Link href="/socialmediapage">Social Media</Link></li>
            <li><Link href="/mixingandmastering">Mixing/Mastering</Link></li>
            <li><Link href="/aboutus">About</Link></li>
            <li>
                <ContactForm />
            </li>
          </ul>
        </div>
      )}
    </div>
  );
}

  function ContactForm() {
    const [name, setName] = React.useState('');
    const [email, setEmail] = React.useState('');
    const [message, setMessage] = React.useState('');
    const [status, setStatus] = React.useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      setStatus('sending');
      try {
        const res = await fetch('/api/email/contact', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name, email, message })
        });
        const data = await res.json();
        if (res.ok) {
          setStatus('sent');
          setName(''); setEmail(''); setMessage('');
        } else {
          setStatus(data.error || 'error');
        }
      } catch (err) {
        setStatus('error');
      }
    };

    return (
      <form onSubmit={handleSubmit} className="contact-form">
        <input value={name} onChange={(e) => setName(e.target.value)} type="text" name="name" placeholder="Your Name" required />
        <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" name="email" placeholder="Your Email" required />
        <textarea value={message} onChange={(e) => setMessage(e.target.value)} name="message" placeholder="Your Message" rows={4} required></textarea>
        <button type="submit">Send</button>
        {status === 'sending' && <div className="contact-status">Sending...</div>}
        {status === 'sent' && <div className="contact-status success">Sent — thanks!</div>}
        {status && status !== 'sending' && status !== 'sent' && <div className="contact-status error">Error: {status}</div>}
      </form>
    );
  }
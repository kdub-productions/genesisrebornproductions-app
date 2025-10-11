import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect, useRef } from 'react';
import "@/styles/site-wide-styles/styles.css";

export default function DesktopNavbar() {
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const toggleDropdown = (menu: string) => {
    setActiveDropdown(activeDropdown === menu ? null : menu);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setActiveDropdown(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <nav className="navbar" ref={dropdownRef}>
      <div className="companyname">
      <Link href='/'>
        <div style={{ position: 'relative', width: '350px', height: '200px', maxWidth: '100%', maxHeight: '100%' }}>
          <Image
            src="/images/Genisis Reborn _real_logo2.png"
            alt="Genesis Reborn Productions Logo"
            fill
            style={{objectFit: 'contain'}}
            priority
          />
        </div>
        </Link>
      </div>
      <ul className="nav-links">
        <li><Link href="/beatsforsale" className="buy-button">🔥 Buy Beats</Link></li>
        <li><Link href="/">Home</Link></li>
        <li><Link href="/lyrics">Lyrics</Link></li>
        <li><Link href="/socialmediapage">Social Media</Link></li>
        <li>
          <span onClick={() => toggleDropdown("services")} className="dropdown-toggle nav-links">
            Services 
          </span>
          <ul className={`dropdown ${activeDropdown === "services" ? "show" : ""}`}>
            <li><Link href="/mixingandmastering">Mixing/Mastering</Link></li>
            <li><Link href="/beatsforsale">Beats For Sale</Link></li>
          </ul>
        </li>
        <li><Link href="/aboutus">About</Link></li>
        <li>
          <span onClick={() => toggleDropdown("contact")} className="dropdown-toggle nav-links listitemeffectdesknav">
            Contact
          </span>
          <ul className={`dropdown ${activeDropdown === "contact" ? "show" : ""}`}>
            <li>
              <ContactForm />
            </li>
          </ul>
        </li>
      </ul>
    </nav>
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
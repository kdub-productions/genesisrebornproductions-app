"use client";
import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import "../styles/styles.css";

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
            <li><Link href="/socialmedia">Social Media</Link></li>
            <li><Link href="#mixing-mastering">Mixing/Mastering</Link></li>
            <li><Link href="/beatsforsale">Beats For Sale</Link></li>
            <li><Link href="/about">About</Link></li>
            <li>
              <form action="mailto:genesisrebornproductions@gmail.com" method="post" encType="text/plain">
                <input type="text" name="name" placeholder="Your Name" required />
<input type="email" name="email" placeholder="Your Email" required />
                <textarea name="message" placeholder="Your Message" rows={4} required></textarea>
                <button type="submit">Send</button>
              </form>
            </li>
          </ul>
        </div>
      )}
    </div>
  );
}
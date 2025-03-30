"use client";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import "../styles/styles.css";

export default function DesktopNavbar() {
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  const toggleDropdown = (menu: string) => {
    setActiveDropdown(activeDropdown === menu ? null : menu);
  };

  return (
    <nav className="navbar">
      <div className="companyname">
      <Link href='/'>
        <Image
          src="/images/Genisis Reborn _real_logo2.png"
          alt="Genesis Reborn Productions Logo"
          width={350}
          height={200}
          priority
        />
        </Link>
      </div>
      <ul className="nav-links">
        <li><Link href="/beatsforsale" className="buy-button">🔥 Buy Beats</Link></li>
        <li><Link href="/">Home</Link></li>
        <li><Link href="/lyrics">Lyrics</Link></li>
        <li><Link href="/socialmedia">Social Media</Link></li>
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
              <form action="mailto:genesisrebornproductions@gmail.com" method="post" encType="text/plain">
                <input type="text" name="name" placeholder="Your Name" required />
                <input type="email" name="email" placeholder="Your Email" required />
                <textarea name="message" placeholder="Your Message" rows={4} required></textarea>
                <button type="submit">Send</button>
              </form>
            </li>
          </ul>
        </li>
      </ul>
    </nav>
  );
}
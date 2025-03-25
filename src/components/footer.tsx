"use client";
import '../styles/styles.css';
import Image from 'next/image';
import Link from 'next/link';
export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-div">
      <Link href='/'>
        <Image className="grbpminilogo" src="/images/Genisis Reborn _real_logo2.png" alt="Genesis Reborn Productions Favicon" width={250} height={150} />
        </Link>
        <div className="footer-copyright-text">
        <p>&copy; {new Date().getFullYear()} Genesis Reborn Productions. All rights reserved.</p>
      </div>
       <a href="https://realroyaltyrecords.vercel.app" target="_blank" rel="noopener noreferrer">
        <Image className="realroyaltyrecordslogo" src="/images/rrr-logo123.png" alt="Real Royalty Records Check Them Out!" width={130} height={150} />
        </a>
      </div>
      <div className='footer-links'>
        <p>Follow us on:</p>
        <ul className="footer-links-list">
        <li><a href="https://www.instagram.com/genesis_reborn_productions/" target="_blank" rel="noopener noreferrer">Instagram</a></li>
       <li><a href="https://www.facebook.com/genesisrebornproductions/" target="_blank" rel="noopener noreferrer">Facebook</a></li>
        <li><a href="https://x.com/GenesisReb14539" target="_blank" rel="noopener noreferrer">X</a></li>
       <li>Join Our Server On:</li>
        <li><a href="https://www.twitter.com/@genesisrebornproductions" target="_blank" rel="noopener noreferrer">Discord</a></li>
        </ul>
        </div>
    </footer>
  );
}
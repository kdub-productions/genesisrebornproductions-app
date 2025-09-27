"use client";
import { useEffect, useState } from "react";
import MobileNavbar from "@/components/mobilenavbar";
import DesktopNavbar from "@/components/desktopnavbar";

export default function Navbar() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    handleResize(); // Check on mount
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return isMobile ? <MobileNavbar /> : <DesktopNavbar />;
}
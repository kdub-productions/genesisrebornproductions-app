import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import '@/styles/site-wide-styles/globals.css';
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next"; // Ensure correct import

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Genesis Reborn Productions',
  description: 'New Beats And New Music From Our Artists. In Collaboration With Real Royalty Records. https://realroyaltyrecords.vercel.app',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {children}
        <SpeedInsights /> {/* Ensure SpeedInsights component is used */}
        <Analytics /> {/* Ensure Analytics component is used */}
      </body>
    </html>
  );
}

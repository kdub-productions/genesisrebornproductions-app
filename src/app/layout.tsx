import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import '@/styles/site-wide-styles/globals.css';
import '@/styles/site-wide-styles/loading.css';
import '@/styles/site-wide-styles/loading-placeholder.css';
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
      <head />
      <body className={inter.className}>
        {/* AdsLoader injects adsense scripts only in production after user consent. */}
        <div id="ads-root" />
        {/* CookieConsent and AdsLoader are client components; they will be dynamically imported by pages that need them. */}
        {children}
        {process.env.NODE_ENV === 'production' && (
          <>
            <SpeedInsights /> {/* Ensure SpeedInsights component is used */}
            <Analytics /> {/* Ensure Analytics component is used */}
          </>
        )}
      </body>
      
    </html>
  );
}

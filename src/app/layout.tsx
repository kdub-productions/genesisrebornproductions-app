import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import '../styles/globals.css';
const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Genesis Reborn Productions',
  description: 'New Beats And New Music From Our Artists',
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
      </body>
    </html>
  );
}

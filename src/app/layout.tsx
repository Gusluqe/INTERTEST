import type { Metadata } from 'next';
import '@/styles/globals.css';
import { Inter } from 'next/font/google';
import { Layout } from '@/components/layout/main-layout';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'NetCheck Pro - Professional Internet Speed Test',
  description: 'Test your internet connection speed with professional-grade metrics. Measure ping, jitter, download and upload speeds with precision.',
  keywords: 'speed test, internet speed, bandwidth test, network test, ping test',
  authors: [{ name: 'NetCheck Pro' }],
  openGraph: {
    title: 'NetCheck Pro - Professional Internet Speed Test',
    description: 'Test your internet connection speed with professional-grade metrics',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className={inter.className}>
        <Layout>{children}</Layout>
      </body>
    </html>
  );
}
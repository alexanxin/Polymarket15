import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Toaster } from "react-hot-toast";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Polymarket Trading Bot - High-Frequency Crypto Prediction Markets",
  description: "Advanced algorithmic trading bot for Polymarket's 15-minute crypto prediction markets. Real-time arbitrage detection with live BTC, ETH, SOL, and XRP price data.",
  keywords: ["Polymarket", "trading bot", "prediction markets", "crypto", "arbitrage", "algorithmic trading", "BTC", "ETH", "SOL", "XRP"],
  authors: [{ name: "Trading Bot Team" }],
  creator: "Trading Bot Team",
  publisher: "Trading Bot Team",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://polymarket15.vercel.app/'), // Replace with your actual domain
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: "Polymarket Trading Bot - High-Frequency Crypto Trading",
    description: "Advanced algorithmic trading bot for Polymarket's prediction markets. Real-time arbitrage detection for 15-minute crypto price predictions.",
    url: 'https://polymarket15.vercel.app/', // Replace with your actual domain
    siteName: 'Polymarket Trading Bot',
    images: [
      {
        url: '/og-image.png', // You'll need to create this image
        width: 1200,
        height: 630,
        alt: 'Polymarket Trading Bot Interface',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: "Polymarket Trading Bot - High-Frequency Crypto Trading",
    description: "Advanced algorithmic trading bot for Polymarket's prediction markets. Real-time arbitrage detection for 15-minute crypto price predictions.",
    images: ['/og-image.png'], // You'll need to create this image
    creator: '@your_twitter_handle', // Replace with your Twitter handle
  },
  robots: {
    index: false, // Set to true when ready for production
    follow: false, // Set to true when ready for production
    nocache: true,
    googleBot: {
      index: false, // Set to true when ready for production
      follow: false, // Set to true when ready for production
      noimageindex: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    // Add your verification codes here when available
    // google: 'your-google-verification-code',
    // yandex: 'your-yandex-verification-code',
    // bing: 'your-bing-verification-code',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
        <Toaster position="top-right" />
      </body>
    </html>
  );
}

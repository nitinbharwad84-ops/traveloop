// =============================================================================
// Traveloop — Root Layout
// =============================================================================
// Root-level layout with Providers wrapper, global metadata, and font loading.
// All page content flows through this layout.
// =============================================================================

import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Providers } from './providers';
import { APP_NAME, APP_DESCRIPTION, APP_URL } from '@/constants';

/**
 * Inter — clean, modern sans-serif from Google Fonts.
 * Optimal for UI-heavy applications with excellent readability.
 */
const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

/**
 * Global metadata applied to all pages.
 * Individual pages can override with their own metadata exports.
 */
export const metadata: Metadata = {
  title: {
    default: `${APP_NAME} — AI Travel Planner`,
    template: `%s — ${APP_NAME}`,
  },
  description: APP_DESCRIPTION,
  metadataBase: new URL(APP_URL),
  applicationName: APP_NAME,
  keywords: [
    'travel planner',
    'trip planning',
    'AI travel',
    'itinerary builder',
    'collaborative travel',
    'budget planner',
    'packing list',
  ],
  authors: [{ name: 'Traveloop' }],
  creator: APP_NAME,
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: APP_URL,
    title: `${APP_NAME} — AI Travel Planner`,
    description: APP_DESCRIPTION,
    siteName: APP_NAME,
  },
  twitter: {
    card: 'summary_large_image',
    title: `${APP_NAME} — AI Travel Planner`,
    description: APP_DESCRIPTION,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
};

/**
 * Viewport configuration for PWA and mobile optimization.
 */
export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#FFFFFF' },
    { media: '(prefers-color-scheme: dark)', color: '#0F172A' },
  ],
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans antialiased`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}

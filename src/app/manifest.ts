// =============================================================================
// Traveloop — PWA Web App Manifest
// =============================================================================
// Defines installable PWA metadata: name, icons, theme, display mode.
// Next.js App Router automatically serves this at /manifest.webmanifest.
// =============================================================================

import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Traveloop — AI Travel Planner',
    short_name: 'Traveloop',
    description:
      'AI-powered collaborative travel planning. Plan smarter trips with less friction.',
    start_url: '/',
    display: 'standalone',
    background_color: '#FFFFFF',
    // Slate-900: matches the dark mode header/sidebar
    theme_color: '#0F172A',
    orientation: 'portrait-primary',
    categories: ['travel', 'productivity', 'lifestyle'],
    icons: [
      {
        src: '/icons/icon-192x192.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'maskable',
      },
      {
        src: '/icons/icon-512x512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'any',
      },
    ],
  };
}

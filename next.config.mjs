// =============================================================================
// Traveloop — Next.js Configuration
// =============================================================================
// Configured with:
// 1. PWA plugin (@ducanh2912/next-pwa) — disabled in development
// 2. Security headers (CSP, X-Frame-Options, etc.)
// 3. Image optimization for Supabase Storage
// 4. Strict mode enabled
// =============================================================================

import withPWAInit from '@ducanh2912/next-pwa';

/**
 * PWA plugin configuration.
 * Generates service worker for offline support and caching.
 * Disabled in development to avoid interfering with hot reload.
 */
const withPWA = withPWAInit({
  dest: 'public',
  disable: process.env.NODE_ENV === 'development',
  register: true,
  skipWaiting: true,
  // Cache pages for offline access
  fallbacks: {
    document: '/offline',
  },
});

/**
 * Security headers applied to all routes.
 * Following OWASP recommendations for web application security.
 */
const securityHeaders = [
  {
    // Prevent clickjacking attacks
    key: 'X-Frame-Options',
    value: 'DENY',
  },
  {
    // Prevent MIME-type sniffing
    key: 'X-Content-Type-Options',
    value: 'nosniff',
  },
  {
    // Control referrer information sent with requests
    key: 'Referrer-Policy',
    value: 'strict-origin-when-cross-origin',
  },
  {
    // Restrict browser features/APIs
    key: 'Permissions-Policy',
    value: 'camera=(), microphone=(), geolocation=(self), interest-cohort=()',
  },
  {
    // Enforce HTTPS after first visit (1 year)
    key: 'Strict-Transport-Security',
    value: 'max-age=31536000; includeSubDomains',
  },
  {
    // XSS protection for older browsers
    key: 'X-XSS-Protection',
    value: '1; mode=block',
  },
];

/** @type {import('next').NextConfig} */
const nextConfig = {
  // React strict mode for catching bugs early
  reactStrictMode: true,

  // Image optimization — allow Supabase Storage images
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.supabase.co',
        pathname: '/storage/v1/object/public/**',
      },
    ],
    // Optimize image formats
    formats: ['image/avif', 'image/webp'],
  },

  // Apply security headers to all routes
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: securityHeaders,
      },
    ];
  },

  // Experimental features
  // Note: typedRoutes disabled until all route pages are created
  // experimental: {
  //   typedRoutes: true,
  // },
};

export default withPWA(nextConfig);

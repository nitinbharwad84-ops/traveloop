// =============================================================================
// Traveloop — Offline Fallback Page
// =============================================================================
// Shown when the user is offline and navigates to an uncached route.
// PWA service worker serves this page from cache.
// =============================================================================

'use client';

import { WifiOff } from 'lucide-react';

export default function OfflinePage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4">
      {/* Offline Icon */}
      <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-muted">
        <WifiOff className="h-10 w-10 text-muted-foreground" />
      </div>

      {/* Heading */}
      <h1 className="mb-2 text-2xl font-bold text-foreground">
        You&apos;re Offline
      </h1>

      {/* Description */}
      <p className="mb-8 max-w-md text-center text-muted-foreground">
        It looks like you&apos;ve lost your internet connection. Some features
        may be unavailable until you&apos;re back online.
      </p>

      {/* Retry Button */}
      <button
        onClick={() => window.location.reload()}
        className="inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-3 text-sm font-medium text-primary-foreground shadow-sm transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
      >
        Try Again
      </button>

      {/* Branding */}
      <p className="mt-12 text-xs text-muted-foreground/60">
        Traveloop — AI Travel Planner
      </p>
    </div>
  );
}

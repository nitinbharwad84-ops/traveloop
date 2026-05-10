// =============================================================================
// Traveloop — 404 Not Found Page
// =============================================================================
// Custom 404 page displayed when a route doesn't exist.
// =============================================================================

import Link from 'next/link';
import { MapPinOff, ArrowLeft } from 'lucide-react';

export const metadata = {
  title: '404 — Page Not Found — Traveloop',
  description: 'The page you are looking for does not exist.',
};

export default function NotFoundPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4">
      {/* Icon */}
      <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-muted">
        <MapPinOff className="h-10 w-10 text-muted-foreground" />
      </div>

      {/* Error Code */}
      <p className="mb-2 text-6xl font-bold text-primary">404</p>

      {/* Title */}
      <h1 className="mb-2 text-2xl font-bold text-foreground">
        Destination Not Found
      </h1>

      {/* Description */}
      <p className="mb-8 max-w-md text-center text-muted-foreground">
        Looks like this route doesn&apos;t exist on our map. Let&apos;s get you
        back on track.
      </p>

      {/* Actions */}
      <div className="flex gap-4">
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-3 text-sm font-medium text-primary-foreground shadow-sm transition-colors hover:bg-primary/90"
        >
          Go to Dashboard
        </Link>
        <Link
          href="/"
          className="inline-flex items-center gap-2 rounded-lg border border-border px-6 py-3 text-sm font-medium text-foreground transition-colors hover:bg-accent"
        >
          <ArrowLeft className="h-4 w-4" />
          Home
        </Link>
      </div>
    </div>
  );
}

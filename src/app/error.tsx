// =============================================================================
// Traveloop — Error Page (500 / Runtime Errors)
// =============================================================================
// Next.js App Router error boundary for page-level runtime errors.
// This is a Client Component (required by Next.js for error.tsx).
// =============================================================================

'use client';

import { useEffect } from 'react';
import { AlertTriangle, RefreshCw, ArrowLeft } from 'lucide-react';
import { captureException } from '@/lib/sentry';
import Link from 'next/link';

interface ErrorPageProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function ErrorPage({ error, reset }: ErrorPageProps) {
  useEffect(() => {
    // Report error to Sentry
    captureException(error, {
      digest: error.digest,
      page: typeof window !== 'undefined' ? window.location.pathname : 'unknown',
    });

    // Log in development
    console.error('[ErrorPage] Runtime error:', error);
  }, [error]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4">
      {/* Icon */}
      <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-destructive/10">
        <AlertTriangle className="h-10 w-10 text-destructive" />
      </div>

      {/* Title */}
      <h1 className="mb-2 text-2xl font-bold text-foreground">
        Something Went Wrong
      </h1>

      {/* Description */}
      <p className="mb-2 max-w-md text-center text-muted-foreground">
        We encountered an unexpected error. Our team has been notified and is
        working on a fix.
      </p>

      {/* Error digest (for support reference) */}
      {error.digest && (
        <p className="mb-6 text-xs text-muted-foreground/60">
          Error ID: {error.digest}
        </p>
      )}

      {/* Dev error details */}
      {process.env.NODE_ENV === 'development' && (
        <pre className="mb-6 max-w-lg overflow-auto rounded-lg bg-muted p-4 text-xs text-muted-foreground">
          {error.message}
          {'\n\n'}
          {error.stack}
        </pre>
      )}

      {/* Actions */}
      <div className="flex gap-4">
        <button
          onClick={reset}
          className="inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-3 text-sm font-medium text-primary-foreground shadow-sm transition-colors hover:bg-primary/90"
        >
          <RefreshCw className="h-4 w-4" />
          Try Again
        </button>
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

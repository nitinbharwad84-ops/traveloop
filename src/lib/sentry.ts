// =============================================================================
// Traveloop — Sentry Error Monitoring
// =============================================================================
// Sentry initialization and helper utilities.
// Sentry Free Plan: 5,000 errors/month, 10,000 transactions.
// =============================================================================

import * as Sentry from '@sentry/nextjs';

/**
 * Whether Sentry has been initialized.
 * Prevents double-initialization in development hot-reload.
 */
let isInitialized = false;

/**
 * Initialize Sentry error monitoring.
 * Called once in the app providers or instrumentation file.
 */
export function initSentry(): void {
  if (isInitialized) return;

  const dsn = process.env.NEXT_PUBLIC_SENTRY_DSN;

  // Skip initialization if DSN is not configured (local dev without Sentry)
  if (!dsn || dsn === 'https://your-dsn@sentry.io/project-id') {
    console.info('[Sentry] DSN not configured — skipping initialization');
    return;
  }

  Sentry.init({
    dsn,

    // Environment tagging for filtering in Sentry dashboard
    environment: process.env.NODE_ENV ?? 'development',

    // Performance monitoring — sample 10% of transactions in production
    // to stay within free tier limits (10,000 transactions/month)
    tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,

    // Only send errors in production to conserve free tier quota
    enabled: process.env.NODE_ENV === 'production',

    // Ignore common non-actionable errors
    ignoreErrors: [
      'ResizeObserver loop limit exceeded',
      'ResizeObserver loop completed with undelivered notifications',
      'Non-Error promise rejection captured',
    ],

    // Breadcrumb limit to reduce payload size
    maxBreadcrumbs: 50,
  });

  isInitialized = true;
}

/**
 * Capture an exception and send it to Sentry.
 * Safe to call even if Sentry is not initialized.
 */
export function captureException(
  error: unknown,
  context?: Record<string, unknown>
): void {
  if (context) {
    Sentry.withScope((scope) => {
      Object.entries(context).forEach(([key, value]) => {
        scope.setExtra(key, value);
      });
      Sentry.captureException(error);
    });
  } else {
    Sentry.captureException(error);
  }
}

/**
 * Capture a custom message in Sentry.
 */
export function captureMessage(
  message: string,
  level: Sentry.SeverityLevel = 'info'
): void {
  Sentry.captureMessage(message, level);
}

/**
 * Set the current user context for Sentry error reports.
 */
export function setUser(user: { id: string; email?: string } | null): void {
  Sentry.setUser(user);
}

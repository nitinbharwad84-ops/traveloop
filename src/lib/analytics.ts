// =============================================================================
// Traveloop — PostHog Analytics
// =============================================================================
// PostHog Cloud Free: 1M events/month, session recordings, feature flags.
// Browser-only initialization (PostHog JS SDK is client-side only).
// =============================================================================

import posthog from 'posthog-js';

/**
 * Whether PostHog has been initialized.
 * Prevents double-initialization in React strict mode / hot-reload.
 */
let isInitialized = false;

/**
 * Initialize PostHog analytics.
 * Must be called from a browser context (client component).
 */
export function initPostHog(): typeof posthog | null {
  // Guard: only run in the browser
  if (typeof window === 'undefined') return null;

  // Guard: don't re-initialize
  if (isInitialized) return posthog;

  const key = process.env.NEXT_PUBLIC_POSTHOG_KEY;
  const host = process.env.NEXT_PUBLIC_POSTHOG_HOST;

  // Skip if not configured (local dev without PostHog)
  if (!key || key === 'phc_your-posthog-key') {
    console.info('[PostHog] API key not configured — skipping initialization');
    return null;
  }

  posthog.init(key, {
    api_host: host || 'https://us.i.posthog.com',

    // Capture pageviews automatically via Next.js router integration
    capture_pageview: false, // We handle this manually in the provider

    // Respect Do Not Track browser setting
    respect_dnt: true,

    // Session recording — disabled by default on free tier to save events
    disable_session_recording: process.env.NODE_ENV !== 'production',

    // Reduce payload size
    property_denylist: ['$ip'],

    // Persistence: use localStorage for better reliability
    persistence: 'localStorage+cookie',

    // Load feature flags on init
    bootstrap: {},
  });

  isInitialized = true;
  return posthog;
}

/**
 * Track a custom analytics event.
 *
 * @param eventName - Name of the event (e.g., 'trip_created', 'ai_plan_generated')
 * @param properties - Optional key-value properties to attach
 */
export function trackEvent(
  eventName: string,
  properties?: Record<string, unknown>
): void {
  if (typeof window === 'undefined') return;
  posthog.capture(eventName, properties);
}

/**
 * Identify a user for analytics tracking.
 * Links all future events to this user ID.
 */
export function identifyUser(
  userId: string,
  traits?: Record<string, unknown>
): void {
  if (typeof window === 'undefined') return;
  posthog.identify(userId, traits);
}

/**
 * Reset user identity (call on logout).
 */
export function resetUser(): void {
  if (typeof window === 'undefined') return;
  posthog.reset();
}

/**
 * Get the PostHog instance for direct usage (e.g., feature flags).
 */
export function getPostHog(): typeof posthog | null {
  if (typeof window === 'undefined') return null;
  return isInitialized ? posthog : null;
}

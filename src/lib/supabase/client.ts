// =============================================================================
// Traveloop — Supabase Browser Client
// =============================================================================
// Client-side Supabase client for use in React Client Components.
// Uses @supabase/ssr for cookie-based auth token management.
// =============================================================================

import { createBrowserClient } from '@supabase/ssr';

/**
 * Creates a Supabase client for browser-side usage.
 *
 * This client:
 * - Reads/writes auth tokens from browser cookies (set by middleware)
 * - Should be used in Client Components ('use client')
 * - Does NOT have access to service_role key (browser-safe)
 *
 * @returns Supabase browser client instance
 */
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}

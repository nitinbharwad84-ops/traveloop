// =============================================================================
// Traveloop — Supabase Server Client
// =============================================================================
// Server-side Supabase client for use in Server Components, API Routes,
// and Server Actions. Handles cookie management via Next.js cookies() API.
// =============================================================================

import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

/**
 * Creates a Supabase client for server-side usage.
 *
 * This client:
 * - Manages auth tokens via HTTP-only cookies (secure, SameSite=Lax)
 * - Should be used in Server Components, API routes, Server Actions
 * - Has access to the user's session via cookie-based auth
 *
 * @returns Supabase server client instance
 */
export function createClient() {
  const cookieStore = cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // The `setAll` method is called from a Server Component where
            // cookies cannot be set. This is expected when refreshing tokens
            // during SSR — the middleware will handle the refresh instead.
          }
        },
      },
    }
  );
}

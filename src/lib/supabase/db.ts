// =============================================================================
// Traveloop — Supabase Server DB Client
// =============================================================================
// Single import for all API route database operations.
// Uses the server-side Supabase client with cookie-based auth.
// =============================================================================

import { createClient } from '@/lib/supabase/server';

/**
 * Returns the server-side Supabase client for database operations.
 * Use this in all API routes instead of the old Prisma client.
 *
 * Usage:
 *   const supabase = supabaseDb();
 *   const { data, error } = await supabase.from('trips').select('*');
 */
export function supabaseDb() {
  return createClient();
}

export default supabaseDb;

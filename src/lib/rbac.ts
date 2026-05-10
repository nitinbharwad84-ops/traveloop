import { createClient } from '@/lib/supabase/server';
import type { CollaboratorRole, CollaboratorStatus } from '@/types';

export type AccessLevel = 'owner' | 'editor' | 'viewer';

/**
 * Get the currently authenticated user's ID.
 * Returns null if not authenticated.
 */
export async function getCurrentUserId(): Promise<string | null> {
  const supabase = createClient();
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error || !user) return null;
  return user.id;
}

const roleHierarchy: Record<CollaboratorRole, number> = {
  owner: 3,
  editor: 2,
  viewer: 1,
};

/**
 * Checks if a user has the required access level for a specific trip.
 *
 * @param tripId The ID of the trip
 * @param userId The ID of the user requesting access
 * @param requiredLevel The minimum access level required ('owner', 'editor', 'viewer')
 * @returns boolean indicating if access is granted
 */
export async function requireTripAccess(
  tripId: string,
  userId: string,
  requiredLevel: AccessLevel = 'viewer'
): Promise<boolean> {
  const supabase = createClient();

  // 1. Check if user is the direct owner
  const { data: trip } = await supabase
    .from('trips')
    .select('owner_id')
    .eq('id', tripId)
    .single();

  if (!trip) return false;
  if (trip.owner_id === userId) return true; // Owner always has full access

  // 2. Check if user is an accepted collaborator with sufficient role
  const { data: collaborator } = await supabase
    .from('collaborators')
    .select('role, status')
    .eq('trip_id', tripId)
    .eq('user_id', userId)
    .single();

  if (!collaborator || collaborator.status !== ('accepted' as CollaboratorStatus)) {
    return false;
  }

  // Compare role hierarchy
  const userRoleWeight = roleHierarchy[collaborator.role as CollaboratorRole];
  const requiredRoleWeight = roleHierarchy[requiredLevel as CollaboratorRole];

  return userRoleWeight >= requiredRoleWeight;
}

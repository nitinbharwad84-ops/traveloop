import { prisma } from '@/lib/prisma/client';
import { CollaboratorRole, CollaboratorStatus } from '@prisma/client';

export type AccessLevel = 'owner' | 'editor' | 'viewer';

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
  // 1. Check if user is the direct owner
  const trip = await prisma.trip.findUnique({
    where: { id: tripId },
    select: { ownerId: true },
  });

  if (!trip) return false;
  if (trip.ownerId === userId) return true; // Owner always has full access

  // 2. Check if user is an accepted collaborator with sufficient role
  const collaborator = await prisma.collaborator.findUnique({
    where: {
      tripId_userId: {
        tripId,
        userId,
      },
    },
    select: { role: true, status: true },
  });

  if (!collaborator || collaborator.status !== CollaboratorStatus.accepted) {
    return false;
  }

  // Compare role hierarchy
  const userRoleWeight = roleHierarchy[collaborator.role];
  const requiredRoleWeight = roleHierarchy[requiredLevel as CollaboratorRole];

  return userRoleWeight >= requiredRoleWeight;
}

/**
 * Mock function to simulate getting the current authenticated user.
 * In a real application, this would use NextAuth, Supabase Auth, or Clerk.
 * For now, we fallback to our seeded default user.
 */
export async function getCurrentUserId(): Promise<string | null> {
  // Try to find the default seeded user
  let user = await prisma.user.findFirst({
    where: { email: 'john@example.com' },
  });
  
  // Promote to admin for M16 testing if not already
  if (user && user.role !== 'admin') {
    user = await prisma.user.update({
      where: { id: user.id },
      data: { role: 'admin' },
    });
  }

  return user?.id || null;
}

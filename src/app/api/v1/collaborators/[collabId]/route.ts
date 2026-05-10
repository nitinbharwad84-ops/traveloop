import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma/client';
import { getCurrentUserId, requireTripAccess } from '@/lib/rbac';
import { CollaboratorRole, CollaboratorStatus } from '@prisma/client';

export async function PATCH(
  request: Request,
  { params }: { params: { collabId: string } }
) {
  try {
    const { collabId } = params;
    const body = await request.json();
    const { role, status } = body;

    const currentUserId = await getCurrentUserId();
    if (!currentUserId) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });

    const collaborator = await prisma.collaborator.findUnique({
      where: { id: collabId }
    });

    if (!collaborator) return NextResponse.json({ success: false, error: 'Not found' }, { status: 404 });

    // RBAC logic
    // 1. A user can accept their own invite
    if (status && status === 'accepted' && collaborator.userId === currentUserId) {
      const updated = await prisma.collaborator.update({
        where: { id: collabId },
        data: { status, joinedAt: new Date() }
      });
      return NextResponse.json({ success: true, data: updated });
    }

    // 2. Only owner can change roles
    if (role) {
      const isOwner = await requireTripAccess(collaborator.tripId, currentUserId, 'owner');
      if (!isOwner) return NextResponse.json({ success: false, error: 'Only owners can change roles' }, { status: 403 });
    }

    const updated = await prisma.collaborator.update({
      where: { id: collabId },
      data: {
        ...(role && { role: role as CollaboratorRole }),
        ...(status && { status: status as CollaboratorStatus }),
      }
    });

    return NextResponse.json({ success: true, data: updated });
  } catch (error) {
    console.error('Collaborator PATCH Error:', error);
    return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { collabId: string } }
) {
  try {
    const { collabId } = params;
    
    const currentUserId = await getCurrentUserId();
    if (!currentUserId) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });

    const collaborator = await prisma.collaborator.findUnique({
      where: { id: collabId }
    });

    if (!collaborator) return NextResponse.json({ success: false, error: 'Not found' }, { status: 404 });

    // A user can remove themselves, otherwise must be the owner
    if (collaborator.userId !== currentUserId) {
      const isOwner = await requireTripAccess(collaborator.tripId, currentUserId, 'owner');
      if (!isOwner) return NextResponse.json({ success: false, error: 'Only owners can remove collaborators' }, { status: 403 });
    }

    await prisma.collaborator.delete({
      where: { id: collabId }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Collaborator DELETE Error:', error);
    return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
  }
}

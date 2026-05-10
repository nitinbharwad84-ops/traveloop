import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma/client';
import { getCurrentUserId } from '@/lib/rbac';

export async function GET(
  request: Request,
  { params }: { params: { token: string } }
) {
  try {
    const { token } = params;

    const sharedLink = await prisma.sharedLink.findUnique({
      where: { token },
      include: {
        trip: {
          include: {
            owner: {
              select: { id: true, profile: { select: { firstName: true, lastName: true, avatarUrl: true } } }
            },
            stops: {
              orderBy: { orderIndex: 'asc' },
              include: {
                tripActivities: { orderBy: { orderIndex: 'asc' } }
              }
            },
            budgets: true,
          }
        }
      }
    });

    if (!sharedLink) return NextResponse.json({ success: false, error: 'Link not found' }, { status: 404 });

    // Check expiration
    if (sharedLink.expiresAt && sharedLink.expiresAt < new Date()) {
      return NextResponse.json({ success: false, error: 'Link expired' }, { status: 410 });
    }

    // Check auth if invite_only
    if (sharedLink.visibility === 'invite_only') {
      const currentUserId = await getCurrentUserId();
      if (!currentUserId) return NextResponse.json({ success: false, error: 'Authentication required' }, { status: 401 });
      
      // In a real app, you might also check if this specific user is allowed.
    }

    return NextResponse.json({ success: true, data: sharedLink.trip });
  } catch (error) {
    console.error('SharedLink GET Error:', error);
    return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { token: string } } // Reusing the same route for DELETE via linkId, but mapping it to token path for simplicity or using linkId
) {
  try {
    // Actually, PRD says DELETE /api/v1/share/:linkId. This file is [token], so we'll treat token parameter as linkId.
    const { token: linkId } = params; 
    
    const currentUserId = await getCurrentUserId();
    if (!currentUserId) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });

    const link = await prisma.sharedLink.findUnique({
      where: { id: linkId },
      include: { trip: true }
    });

    if (!link) return NextResponse.json({ success: false, error: 'Not found' }, { status: 404 });

    if (link.trip.ownerId !== currentUserId) {
      return NextResponse.json({ success: false, error: 'Only owners can revoke links' }, { status: 403 });
    }

    await prisma.sharedLink.delete({
      where: { id: linkId }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('SharedLink DELETE Error:', error);
    return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
  }
}

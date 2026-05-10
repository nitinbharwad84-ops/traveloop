import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma/client';
import { getCurrentUserId, requireTripAccess } from '@/lib/rbac';

export async function GET(
  request: Request,
  { params }: { params: { tripId: string } }
) {
  try {
    const { tripId } = params;
    
    const currentUserId = await getCurrentUserId();
    if (!currentUserId) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });

    const hasAccess = await requireTripAccess(tripId, currentUserId, 'viewer');
    if (!hasAccess) return NextResponse.json({ success: false, error: 'Insufficient permissions' }, { status: 403 });

    const collaborators = await prisma.collaborator.findMany({
      where: { tripId },
      include: {
        user: {
          select: { 
            id: true, 
            email: true, 
            profile: {
              select: { firstName: true, lastName: true, avatarUrl: true }
            }
          }
        }
      },
      orderBy: { createdAt: 'asc' }
    });

    return NextResponse.json({ success: true, data: collaborators });
  } catch (error) {
    console.error('Collaborators GET Error:', error);
    return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
  }
}

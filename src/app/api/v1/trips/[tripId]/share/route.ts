import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma/client';
import { getCurrentUserId, requireTripAccess } from '@/lib/rbac';
import crypto from 'crypto';

export async function GET(
  request: Request,
  { params }: { params: { tripId: string } }
) {
  try {
    const { tripId } = params;
    
    const currentUserId = await getCurrentUserId();
    if (!currentUserId) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });

    const hasAccess = await requireTripAccess(tripId, currentUserId, 'owner'); // Only owners can see share links
    if (!hasAccess) return NextResponse.json({ success: false, error: 'Insufficient permissions' }, { status: 403 });

    const links = await prisma.sharedLink.findMany({
      where: { tripId },
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json({ success: true, data: links });
  } catch (error) {
    console.error('ShareLinks GET Error:', error);
    return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(
  request: Request,
  { params }: { params: { tripId: string } }
) {
  try {
    const { tripId } = params;
    
    const currentUserId = await getCurrentUserId();
    if (!currentUserId) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });

    const hasAccess = await requireTripAccess(tripId, currentUserId, 'owner');
    if (!hasAccess) return NextResponse.json({ success: false, error: 'Insufficient permissions' }, { status: 403 });

    const body = await request.json();
    const { visibility, expiresAt } = body;

    const token = crypto.randomUUID().replace(/-/g, ''); // 32 chars secure hex

    const link = await prisma.sharedLink.create({
      data: {
        tripId,
        token,
        visibility: visibility || 'public_',
        expiresAt: expiresAt ? new Date(expiresAt) : null,
      }
    });

    return NextResponse.json({ success: true, data: link });
  } catch (error) {
    console.error('ShareLink POST Error:', error);
    return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
  }
}

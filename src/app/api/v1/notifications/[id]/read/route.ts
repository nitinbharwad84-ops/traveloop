import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma/client';
import { getCurrentUserId } from '@/lib/rbac';

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const userId = await getCurrentUserId();
    if (!userId) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    // Verify ownership
    const existing = await prisma.notification.findUnique({
      where: { id: params.id },
    });

    if (!existing) {
      return NextResponse.json({ success: false, error: 'Not found' }, { status: 404 });
    }
    if (existing.userId !== userId) {
      return NextResponse.json({ success: false, error: 'Forbidden' }, { status: 403 });
    }

    const updated = await prisma.notification.update({
      where: { id: params.id },
      data: { read: true },
    });

    return NextResponse.json({ success: true, data: updated });
  } catch (error) {
    console.error('PATCH Notification Read Error:', error);
    return NextResponse.json({ success: false, error: 'Failed to mark as read' }, { status: 500 });
  }
}

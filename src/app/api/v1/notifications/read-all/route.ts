import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma/client';
import { getCurrentUserId } from '@/lib/rbac';

export async function POST() {
  try {
    const userId = await getCurrentUserId();
    if (!userId) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const result = await prisma.notification.updateMany({
      where: { userId, read: false },
      data: { read: true },
    });

    return NextResponse.json({ success: true, data: { count: result.count } });
  } catch (error) {
    console.error('POST Notifications Read All Error:', error);
    return NextResponse.json({ success: false, error: 'Failed to mark all as read' }, { status: 500 });
  }
}

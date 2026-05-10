import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma/client';
import { getCurrentUserId } from '@/lib/rbac';

export async function requireAdmin() {
  const userId = await getCurrentUserId();
  if (!userId) {
    throw new Error('UNAUTHORIZED');
  }

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { role: true },
  });

  if (user?.role !== 'admin') {
    throw new Error('FORBIDDEN');
  }

  return userId;
}

export function handleAdminError(error: unknown) {
  if (error instanceof Error) {
    if (error.message === 'UNAUTHORIZED') {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }
    if (error.message === 'FORBIDDEN') {
      return NextResponse.json({ success: false, error: 'Forbidden: Admin access required' }, { status: 403 });
    }
  }
  console.error('Admin API Error:', error);
  return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
}

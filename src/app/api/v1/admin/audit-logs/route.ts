import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma/client';
import { requireAdmin, handleAdminError } from '@/lib/admin';

export async function GET() {
  try {
    await requireAdmin();

    const logs = await prisma.auditLog.findMany({
      orderBy: { createdAt: 'desc' },
      take: 100,
      include: {
        actor: { select: { email: true, profile: { select: { firstName: true } } } }
      }
    });

    return NextResponse.json({ success: true, data: logs });
  } catch (error) {
    return handleAdminError(error);
  }
}

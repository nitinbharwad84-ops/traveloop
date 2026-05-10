import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma/client';
import { requireAdmin, handleAdminError } from '@/lib/admin';

export async function GET(request: Request) {
  try {
    await requireAdmin();
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search') || '';

    const users = await prisma.user.findMany({
      where: search ? {
        OR: [
          { email: { contains: search, mode: 'insensitive' } },
          { profile: { firstName: { contains: search, mode: 'insensitive' } } },
          { profile: { lastName: { contains: search, mode: 'insensitive' } } }
        ]
      } : undefined,
      include: {
        profile: true,
        _count: { select: { trips: true, communityPosts: true } }
      },
      orderBy: { createdAt: 'desc' },
      take: 50
    });

    return NextResponse.json({ success: true, data: users });
  } catch (error) {
    return handleAdminError(error);
  }
}

export async function PATCH(request: Request) {
  try {
    const adminId = await requireAdmin();
    const { userId, status } = await request.json();

    if (!userId || !status) {
      return NextResponse.json({ success: false, error: 'userId and status are required' }, { status: 400 });
    }

    const user = await prisma.user.update({
      where: { id: userId },
      data: { status }
    });

    await prisma.auditLog.create({
      data: {
        actorId: adminId,
        action: `user_${status}`,
        resourceType: 'user',
        resourceId: userId,
        payload: { status }
      }
    });

    return NextResponse.json({ success: true, data: user });
  } catch (error) {
    return handleAdminError(error);
  }
}

export async function DELETE(request: Request) {
  try {
    const adminId = await requireAdmin();
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json({ success: false, error: 'userId required' }, { status: 400 });
    }

    await prisma.user.delete({ where: { id: userId } });

    await prisma.auditLog.create({
      data: {
        actorId: adminId,
        action: 'user_delete',
        resourceType: 'user',
        resourceId: userId
      }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return handleAdminError(error);
  }
}

import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma/client';
import { getCurrentUserId } from '@/lib/rbac';

export async function POST(request: Request) {
  try {
    const userId = await getCurrentUserId();
    if (!userId) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const { targetUserId } = await request.json();
    if (!targetUserId) {
      return NextResponse.json({ success: false, error: 'targetUserId is required' }, { status: 400 });
    }
    if (targetUserId === userId) {
      return NextResponse.json({ success: false, error: 'Cannot follow yourself' }, { status: 400 });
    }

    const existing = await prisma.follower.findUnique({
      where: { followerId_followingId: { followerId: userId, followingId: targetUserId } },
    });

    if (existing) {
      await prisma.follower.delete({
        where: { followerId_followingId: { followerId: userId, followingId: targetUserId } },
      });
      return NextResponse.json({ success: true, data: { following: false } });
    } else {
      await prisma.follower.create({ data: { followerId: userId, followingId: targetUserId } });
      return NextResponse.json({ success: true, data: { following: true } });
    }
  } catch (error) {
    console.error('Community Follow POST Error:', error);
    return NextResponse.json({ success: false, error: 'Failed to toggle follow' }, { status: 500 });
  }
}

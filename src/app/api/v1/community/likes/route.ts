import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma/client';
import { getCurrentUserId } from '@/lib/rbac';

export async function POST(request: Request) {
  try {
    const userId = await getCurrentUserId();
    if (!userId) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const { postId } = await request.json();
    if (!postId) {
      return NextResponse.json({ success: false, error: 'postId is required' }, { status: 400 });
    }

    // Toggle: check if like exists
    const existing = await prisma.like.findUnique({
      where: { postId_userId: { postId, userId } },
    });

    if (existing) {
      await prisma.like.delete({ where: { postId_userId: { postId, userId } } });
      return NextResponse.json({ success: true, data: { liked: false } });
    } else {
      await prisma.like.create({ data: { postId, userId } });
      return NextResponse.json({ success: true, data: { liked: true } });
    }
  } catch (error) {
    console.error('Community Likes POST Error:', error);
    return NextResponse.json({ success: false, error: 'Failed to toggle like' }, { status: 500 });
  }
}

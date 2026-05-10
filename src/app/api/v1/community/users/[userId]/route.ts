import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma/client';
import { getCurrentUserId } from '@/lib/rbac';

export async function GET(
  request: Request,
  { params }: { params: { userId: string } }
) {
  try {
    const currentUserId = await getCurrentUserId();
    if (!currentUserId) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const { userId } = params;

    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        profile: true,
        _count: {
          select: {
            communityPosts: true,
            followers: true,
            following: true,
          },
        },
        communityPosts: {
          where: { visibility: 'public' },
          orderBy: { createdAt: 'desc' },
          take: 12,
          include: {
            trip: { select: { id: true, title: true, coverImageUrl: true, tripType: true } },
            _count: { select: { likes: true, comments: true } },
          },
        },
        followers: {
          where: { followerId: currentUserId },
          select: { id: true },
        },
      },
    });

    if (!user) {
      return NextResponse.json({ success: false, error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      data: {
        ...user,
        isFollowing: user.followers.length > 0,
        followers: undefined,
      },
    });
  } catch (error) {
    console.error('Community User Profile GET Error:', error);
    return NextResponse.json({ success: false, error: 'Failed to load profile' }, { status: 500 });
  }
}

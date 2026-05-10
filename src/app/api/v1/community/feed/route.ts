import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma/client';
import { getCurrentUserId } from '@/lib/rbac';

export async function GET(request: Request) {
  try {
    const userId = await getCurrentUserId();
    if (!userId) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const cursor = searchParams.get('cursor') ?? undefined;
    const limit = parseInt(searchParams.get('limit') ?? '10', 10);
    const sort = searchParams.get('sort') ?? 'recent';

    // Build orderBy from sort param
    const orderBy =
      sort === 'popular'
        ? [{ likes: { _count: 'desc' as const } }, { createdAt: 'desc' as const }]
        : sort === 'trending'
        ? [{ likes: { _count: 'desc' as const } }, { createdAt: 'desc' as const }]
        : [{ createdAt: 'desc' as const }];

    const posts = await prisma.communityPost.findMany({
      where: {
        visibility: 'public',
        // For trending: only show posts from last 7 days
        ...(sort === 'trending'
          ? { createdAt: { gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) } }
          : {}),
      },
      orderBy,
      take: limit + 1, // take one extra to determine if there's a next page
      ...(cursor ? { skip: 1, cursor: { id: cursor } } : {}),
      include: {
        user: {
          include: { profile: true },
        },
        trip: {
          select: {
            id: true,
            title: true,
            description: true,
            coverImage: true,
            startDate: true,
            endDate: true,
            tripType: true,
            stops: {
              select: { cityName: true, countryName: true, orderIndex: true },
              orderBy: { orderIndex: 'asc' },
              take: 3,
            },
          },
        },
        _count: {
          select: { likes: true, comments: true },
        },
        likes: {
          where: { userId },
          select: { id: true },
        },
      },
    });

    const hasNextPage = posts.length > limit;
    const results = hasNextPage ? posts.slice(0, -1) : posts;
    const nextCursor = hasNextPage ? results[results.length - 1].id : null;

    const formatted = results.map((post) => ({
      ...post,
      isLiked: post.likes.length > 0,
      likes: undefined, // remove raw likes array, replaced by isLiked
    }));

    return NextResponse.json({
      success: true,
      data: formatted,
      nextCursor,
    });
  } catch (error) {
    console.error('Community Feed GET Error:', error);
    return NextResponse.json({ success: false, error: 'Failed to load feed' }, { status: 500 });
  }
}

import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma/client';
import { getCurrentUserId } from '@/lib/rbac';

export async function POST(request: Request) {
  try {
    const userId = await getCurrentUserId();
    if (!userId) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const { tripId, content } = await request.json();
    if (!tripId) {
      return NextResponse.json({ success: false, error: 'tripId is required' }, { status: 400 });
    }

    // Verify trip belongs to user
    const trip = await prisma.trip.findFirst({
      where: { id: tripId, ownerId: userId },
    });
    if (!trip) {
      return NextResponse.json({ success: false, error: 'Trip not found or not owned by you' }, { status: 403 });
    }

    // Check not already published
    const existing = await prisma.communityPost.findFirst({
      where: { tripId, userId },
    });
    if (existing) {
      return NextResponse.json({ success: false, error: 'This trip is already published' }, { status: 400 });
    }

    const post = await prisma.communityPost.create({
      data: { userId, tripId, content: content ?? null, visibility: 'public' },
      include: { _count: { select: { likes: true, comments: true } } },
    });

    return NextResponse.json({ success: true, data: post }, { status: 201 });
  } catch (error) {
    console.error('Community Posts POST Error:', error);
    return NextResponse.json({ success: false, error: 'Failed to publish post' }, { status: 500 });
  }
}

export async function GET(request: Request) {
  try {
    const userId = await getCurrentUserId();
    if (!userId) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const targetUserId = searchParams.get('userId') ?? userId;

    const posts = await prisma.communityPost.findMany({
      where: { userId: targetUserId, visibility: 'public' },
      orderBy: { createdAt: 'desc' },
      include: {
        trip: { select: { id: true, title: true, coverImage: true, tripType: true } },
        _count: { select: { likes: true, comments: true } },
      },
    });

    return NextResponse.json({ success: true, data: posts });
  } catch (error) {
    console.error('Community Posts GET Error:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch posts' }, { status: 500 });
  }
}

import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma/client';
import { requireAdmin, handleAdminError } from '@/lib/admin';

export async function GET() {
  try {
    await requireAdmin();
    
    // Fetch recent public community posts for moderation
    const posts = await prisma.communityPost.findMany({
      orderBy: { createdAt: 'desc' },
      take: 50,
      include: {
        user: { include: { profile: true } },
        trip: { select: { title: true } },
        _count: { select: { comments: true, likes: true } }
      }
    });

    return NextResponse.json({ success: true, data: posts });
  } catch (error) {
    return handleAdminError(error);
  }
}

export async function DELETE(request: Request) {
  try {
    const adminId = await requireAdmin();
    const { searchParams } = new URL(request.url);
    const postId = searchParams.get('postId');

    if (!postId) {
      return NextResponse.json({ success: false, error: 'postId required' }, { status: 400 });
    }

    const post = await prisma.communityPost.findUnique({ where: { id: postId } });
    if (post) {
      await prisma.communityPost.delete({ where: { id: postId } });
      
      await prisma.auditLog.create({
        data: {
          actorId: adminId,
          action: 'post_delete',
          resourceType: 'community_post',
          resourceId: postId,
          payload: { tripId: post.tripId, authorId: post.userId }
        }
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return handleAdminError(error);
  }
}

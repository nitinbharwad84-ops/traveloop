import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { requireAdmin, handleAdminError } from '@/lib/admin';

export async function GET() {
  try {
    await requireAdmin();
    const supabase = createClient();

    const { data: posts } = await supabase
      .from('community_posts')
      .select('*, users!community_posts_user_id_fkey(id, email, profiles(first_name, last_name, avatar_url)), trips!community_posts_trip_id_fkey(title)')
      .order('created_at', { ascending: false })
      .limit(50);

    // Get counts for each post
    const postsWithCounts = await Promise.all((posts || []).map(async (p) => {
      const [commentsRes, likesRes] = await Promise.all([
        supabase.from('comments').select('id', { count: 'exact', head: true }).eq('post_id', p.id),
        supabase.from('likes').select('id', { count: 'exact', head: true }).eq('post_id', p.id),
      ]);
      return { ...p, user: p.users, trip: p.trips, users: undefined, trips: undefined, _count: { comments: commentsRes.count ?? 0, likes: likesRes.count ?? 0 } };
    }));

    return NextResponse.json({ success: true, data: postsWithCounts });
  } catch (error) {
    return handleAdminError(error);
  }
}

export async function DELETE(request: Request) {
  try {
    const adminId = await requireAdmin();
    const supabase = createClient();
    const { searchParams } = new URL(request.url);
    const postId = searchParams.get('postId');

    if (!postId) return NextResponse.json({ success: false, error: 'postId required' }, { status: 400 });

    const { data: post } = await supabase.from('community_posts').select('*').eq('id', postId).single();
    if (post) {
      await supabase.from('community_posts').delete().eq('id', postId);
      await supabase.from('audit_logs').insert({ actor_id: adminId, action: 'post_delete', resource_type: 'community_post', resource_id: postId, payload: { trip_id: post.trip_id, author_id: post.user_id } });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return handleAdminError(error);
  }
}

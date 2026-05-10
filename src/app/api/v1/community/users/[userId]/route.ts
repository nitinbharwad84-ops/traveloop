import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(request: Request, { params }: { params: { userId: string } }) {
  try {
    const supabase = createClient();
    const { data: { user: currentUser } } = await supabase.auth.getUser();
    if (!currentUser) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });

    const { userId } = params;

    const { data: userData } = await supabase.from('users').select('id, email, profiles(*)').eq('id', userId).single();
    if (!userData) return NextResponse.json({ success: false, error: 'User not found' }, { status: 404 });

    // Get counts
    const [postsRes, followersRes, followingRes, isFollowingRes] = await Promise.all([
      supabase.from('community_posts').select('id', { count: 'exact', head: true }).eq('user_id', userId),
      supabase.from('followers').select('id', { count: 'exact', head: true }).eq('following_id', userId),
      supabase.from('followers').select('id', { count: 'exact', head: true }).eq('follower_id', userId),
      supabase.from('followers').select('id').eq('follower_id', currentUser.id).eq('following_id', userId).limit(1),
    ]);

    // Get recent posts
    const { data: posts } = await supabase
      .from('community_posts')
      .select('*, trips!community_posts_trip_id_fkey(id, title, cover_image_url, trip_type)')
      .eq('user_id', userId).eq('visibility', 'public')
      .order('created_at', { ascending: false }).limit(12);

    const postsWithCounts = await Promise.all((posts || []).map(async (p) => {
      const [likesR, commentsR] = await Promise.all([
        supabase.from('likes').select('id', { count: 'exact', head: true }).eq('post_id', p.id),
        supabase.from('comments').select('id', { count: 'exact', head: true }).eq('post_id', p.id),
      ]);
      return { ...p, trip: p.trips, trips: undefined, _count: { likes: likesR.count ?? 0, comments: commentsR.count ?? 0 } };
    }));

    return NextResponse.json({
      success: true,
      data: {
        ...userData,
        profile: userData.profiles,
        profiles: undefined,
        communityPosts: postsWithCounts,
        _count: { communityPosts: postsRes.count ?? 0, followers: followersRes.count ?? 0, following: followingRes.count ?? 0 },
        isFollowing: (isFollowingRes.data?.length ?? 0) > 0,
      },
    });
  } catch (error) {
    console.error('Community User Profile GET Error:', error);
    return NextResponse.json({ success: false, error: 'Failed to load profile' }, { status: 500 });
  }
}

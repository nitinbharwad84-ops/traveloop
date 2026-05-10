import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(request: Request) {
  try {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });

    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') ?? '10', 10);

    const query = supabase
      .from('community_posts')
      .select('*, users!community_posts_user_id_fkey(id, email, profiles(first_name, last_name, avatar_url)), trips!community_posts_trip_id_fkey(id, title, description, cover_image_url, start_date, end_date, trip_type)')
      .eq('visibility', 'public')
      .order('created_at', { ascending: false })
      .limit(limit);

    const { data: posts } = await query;

    const formatted = await Promise.all((posts || []).map(async (post) => {
      const [likesRes, commentsRes, userLikeRes, stopsRes] = await Promise.all([
        supabase.from('likes').select('id', { count: 'exact', head: true }).eq('post_id', post.id),
        supabase.from('comments').select('id', { count: 'exact', head: true }).eq('post_id', post.id),
        supabase.from('likes').select('id').eq('post_id', post.id).eq('user_id', user.id).limit(1),
        supabase.from('trip_stops').select('city_name, country_name, order_index').eq('trip_id', post.trip_id).order('order_index', { ascending: true }).limit(3),
      ]);
      return {
        ...post,
        user: post.users,
        trip: { ...post.trips, stops: stopsRes.data || [] },
        users: undefined, trips: undefined,
        _count: { likes: likesRes.count ?? 0, comments: commentsRes.count ?? 0 },
        isLiked: (userLikeRes.data?.length ?? 0) > 0,
      };
    }));

    return NextResponse.json({ success: true, data: formatted, nextCursor: null });
  } catch (error) {
    console.error('Community Feed GET Error:', error);
    return NextResponse.json({ success: false, error: 'Failed to load feed' }, { status: 500 });
  }
}

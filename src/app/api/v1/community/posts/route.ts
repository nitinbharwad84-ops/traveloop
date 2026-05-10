import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function POST(request: Request) {
  try {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });

    const { tripId, content } = await request.json();
    if (!tripId) return NextResponse.json({ success: false, error: 'tripId is required' }, { status: 400 });

    const { data: trip } = await supabase.from('trips').select('id').eq('id', tripId).eq('owner_id', user.id).single();
    if (!trip) return NextResponse.json({ success: false, error: 'Trip not found or not owned by you' }, { status: 403 });

    const { data: existing } = await supabase.from('community_posts').select('id').eq('trip_id', tripId).eq('user_id', user.id).limit(1);
    if (existing && existing.length > 0) return NextResponse.json({ success: false, error: 'This trip is already published' }, { status: 400 });

    const { data: post, error } = await supabase.from('community_posts').insert({ user_id: user.id, trip_id: tripId, content: content ?? null, visibility: 'public' }).select().single();
    if (error) throw error;
    return NextResponse.json({ success: true, data: { ...post, _count: { likes: 0, comments: 0 } } }, { status: 201 });
  } catch (error) {
    console.error('Community Posts POST Error:', error);
    return NextResponse.json({ success: false, error: 'Failed to publish post' }, { status: 500 });
  }
}

export async function GET(request: Request) {
  try {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });

    const { searchParams } = new URL(request.url);
    const targetUserId = searchParams.get('userId') ?? user.id;

    const { data: posts } = await supabase.from('community_posts')
      .select('*, trips!community_posts_trip_id_fkey(id, title, cover_image_url, trip_type)')
      .eq('user_id', targetUserId).eq('visibility', 'public')
      .order('created_at', { ascending: false });

    const postsWithCounts = await Promise.all((posts || []).map(async (p) => {
      const [likesRes, commentsRes] = await Promise.all([
        supabase.from('likes').select('id', { count: 'exact', head: true }).eq('post_id', p.id),
        supabase.from('comments').select('id', { count: 'exact', head: true }).eq('post_id', p.id),
      ]);
      return { ...p, trip: p.trips, trips: undefined, _count: { likes: likesRes.count ?? 0, comments: commentsRes.count ?? 0 } };
    }));

    return NextResponse.json({ success: true, data: postsWithCounts });
  } catch (error) {
    console.error('Community Posts GET Error:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch posts' }, { status: 500 });
  }
}

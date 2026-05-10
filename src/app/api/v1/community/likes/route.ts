import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function POST(request: Request) {
  try {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });

    const { postId } = await request.json();
    if (!postId) return NextResponse.json({ success: false, error: 'postId is required' }, { status: 400 });

    const { data: existing } = await supabase.from('likes').select('id').eq('post_id', postId).eq('user_id', user.id).limit(1);

    if (existing && existing.length > 0) {
      await supabase.from('likes').delete().eq('post_id', postId).eq('user_id', user.id);
      return NextResponse.json({ success: true, data: { liked: false } });
    } else {
      await supabase.from('likes').insert({ post_id: postId, user_id: user.id });
      return NextResponse.json({ success: true, data: { liked: true } });
    }
  } catch (error) {
    console.error('Community Likes POST Error:', error);
    return NextResponse.json({ success: false, error: 'Failed to toggle like' }, { status: 500 });
  }
}

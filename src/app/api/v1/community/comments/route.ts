import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(request: Request) {
  try {
    const supabase = createClient();
    const { searchParams } = new URL(request.url);
    const postId = searchParams.get('postId');
    if (!postId) return NextResponse.json({ success: false, error: 'postId is required' }, { status: 400 });

    const { data: comments } = await supabase
      .from('comments')
      .select('*, users!comments_user_id_fkey(id, email, profiles(first_name, last_name, avatar_url))')
      .eq('post_id', postId)
      .order('created_at', { ascending: true });

    const result = (comments || []).map(c => ({ ...c, user: c.users, users: undefined }));
    return NextResponse.json({ success: true, data: result });
  } catch (error) {
    console.error('Community Comments GET Error:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch comments' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });

    const { postId, content } = await request.json();
    if (!postId || !content?.trim()) return NextResponse.json({ success: false, error: 'postId and content are required' }, { status: 400 });

    const { data: comment, error } = await supabase
      .from('comments')
      .insert({ post_id: postId, user_id: user.id, content: content.trim() })
      .select('*, users!comments_user_id_fkey(id, email, profiles(first_name, last_name, avatar_url))')
      .single();

    if (error) throw error;
    return NextResponse.json({ success: true, data: { ...comment, user: comment.users, users: undefined } }, { status: 201 });
  } catch (error) {
    console.error('Community Comments POST Error:', error);
    return NextResponse.json({ success: false, error: 'Failed to add comment' }, { status: 500 });
  }
}

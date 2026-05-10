import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function POST(request: Request) {
  try {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });

    const { targetUserId } = await request.json();
    if (!targetUserId) return NextResponse.json({ success: false, error: 'targetUserId is required' }, { status: 400 });
    if (targetUserId === user.id) return NextResponse.json({ success: false, error: 'Cannot follow yourself' }, { status: 400 });

    const { data: existing } = await supabase.from('followers').select('id').eq('follower_id', user.id).eq('following_id', targetUserId).limit(1);

    if (existing && existing.length > 0) {
      await supabase.from('followers').delete().eq('follower_id', user.id).eq('following_id', targetUserId);
      return NextResponse.json({ success: true, data: { following: false } });
    } else {
      await supabase.from('followers').insert({ follower_id: user.id, following_id: targetUserId });
      return NextResponse.json({ success: true, data: { following: true } });
    }
  } catch (error) {
    console.error('Community Follow POST Error:', error);
    return NextResponse.json({ success: false, error: 'Failed to toggle follow' }, { status: 500 });
  }
}

import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function POST() {
  try {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });

    const { data, error } = await supabase
      .from('notifications')
      .update({ read: true })
      .eq('user_id', user.id)
      .eq('read', false)
      .select('id');

    if (error) throw error;
    return NextResponse.json({ success: true, data: { count: data?.length ?? 0 } });
  } catch (error) {
    console.error('POST Notifications Read All Error:', error);
    return NextResponse.json({ success: false, error: 'Failed to mark all as read' }, { status: 500 });
  }
}

import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  try {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });

    // Verify ownership
    const { data: existing } = await supabase.from('notifications').select('id, user_id').eq('id', params.id).single();
    if (!existing) return NextResponse.json({ success: false, error: 'Not found' }, { status: 404 });
    if (existing.user_id !== user.id) return NextResponse.json({ success: false, error: 'Forbidden' }, { status: 403 });

    const { data: updated } = await supabase.from('notifications').update({ read: true }).eq('id', params.id).select().single();
    return NextResponse.json({ success: true, data: updated });
  } catch (error) {
    console.error('PATCH Notification Read Error:', error);
    return NextResponse.json({ success: false, error: 'Failed to mark as read' }, { status: 500 });
  }
}

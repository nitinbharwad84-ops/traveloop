import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(request: Request, { params }: { params: { token: string } }) {
  try {
    const supabase = createClient();
    const { token } = params;

    const { data: sharedLink } = await supabase
      .from('shared_links')
      .select('*, trips(*, users!trips_owner_id_fkey(id, profiles(first_name, last_name, avatar_url)), trip_stops(*, trip_activities(*)), budgets(*))')
      .eq('token', token)
      .single();

    if (!sharedLink) return NextResponse.json({ success: false, error: 'Link not found' }, { status: 404 });
    if (sharedLink.expires_at && new Date(sharedLink.expires_at) < new Date()) {
      return NextResponse.json({ success: false, error: 'Link expired' }, { status: 410 });
    }

    return NextResponse.json({ success: true, data: sharedLink.trips });
  } catch (error) {
    console.error('SharedLink GET Error:', error);
    return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: { token: string } }) {
  try {
    const supabase = createClient();
    const { token: linkId } = params;
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });

    const { data: link } = await supabase.from('shared_links').select('*, trips(owner_id)').eq('id', linkId).single();
    if (!link) return NextResponse.json({ success: false, error: 'Not found' }, { status: 404 });
    if (link.trips?.owner_id !== user.id) return NextResponse.json({ success: false, error: 'Only owners can revoke links' }, { status: 403 });

    await supabase.from('shared_links').delete().eq('id', linkId);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('SharedLink DELETE Error:', error);
    return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
  }
}

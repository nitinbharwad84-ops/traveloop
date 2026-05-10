import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { requireTripAccess } from '@/lib/rbac';
import crypto from 'crypto';

export async function GET(request: Request, { params }: { params: { tripId: string } }) {
  try {
    const supabase = createClient();
    const { tripId } = params;
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });

    const hasAccess = await requireTripAccess(tripId, user.id, 'owner');
    if (!hasAccess) return NextResponse.json({ success: false, error: 'Insufficient permissions' }, { status: 403 });

    const { data: links } = await supabase
      .from('shared_links')
      .select('*')
      .eq('trip_id', tripId)
      .order('created_at', { ascending: false });

    return NextResponse.json({ success: true, data: links || [] });
  } catch (error) {
    console.error('ShareLinks GET Error:', error);
    return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(request: Request, { params }: { params: { tripId: string } }) {
  try {
    const supabase = createClient();
    const { tripId } = params;
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });

    const hasAccess = await requireTripAccess(tripId, user.id, 'owner');
    if (!hasAccess) return NextResponse.json({ success: false, error: 'Insufficient permissions' }, { status: 403 });

    const body = await request.json();
    const { visibility, expiresAt } = body;
    const token = crypto.randomUUID().replace(/-/g, '');

    const { data: link, error } = await supabase
      .from('shared_links')
      .insert({
        trip_id: tripId,
        token,
        visibility: visibility || 'public',
        expires_at: expiresAt ? new Date(expiresAt).toISOString() : null,
      })
      .select()
      .single();

    if (error) throw error;
    return NextResponse.json({ success: true, data: link });
  } catch (error) {
    console.error('ShareLink POST Error:', error);
    return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
  }
}

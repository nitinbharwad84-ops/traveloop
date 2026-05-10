import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function POST(request: Request, { params }: { params: { tripId: string } }) {
  try {
    const supabase = createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ success: false, error: { code: 'UNAUTHORIZED', message: 'Not authenticated' } }, { status: 401 });
    }

    const { data: existingTrip } = await supabase.from('trips').select('*').eq('id', params.tripId).single();
    if (!existingTrip) return NextResponse.json({ success: false, error: { code: 'NOT_FOUND', message: 'Trip not found' } }, { status: 404 });
    if (existingTrip.owner_id !== user.id) return NextResponse.json({ success: false, error: { code: 'FORBIDDEN', message: 'Access denied' } }, { status: 403 });

    const { data: archivedTrip, error } = await supabase
      .from('trips')
      .update({ status: 'archived' })
      .eq('id', params.tripId)
      .select('*, budgets(*)')
      .single();

    if (error) throw error;

    const [stopsRes, collabsRes] = await Promise.all([
      supabase.from('trip_stops').select('id', { count: 'exact', head: true }).eq('trip_id', params.tripId),
      supabase.from('collaborators').select('id', { count: 'exact', head: true }).eq('trip_id', params.tripId),
    ]);

    return NextResponse.json({ success: true, data: { ...archivedTrip, _count: { stops: stopsRes.count ?? 0, collaborators: collabsRes.count ?? 0 } } });
  } catch (error) {
    console.error('Archive trip error:', error);
    return NextResponse.json({ success: false, error: { code: 'INTERNAL_ERROR', message: 'An unexpected error occurred' } }, { status: 500 });
  }
}

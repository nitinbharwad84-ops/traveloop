import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function POST(request: Request, { params }: { params: { tripId: string } }) {
  try {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });

    const body = await request.json();
    const { stopIds } = body;

    if (!Array.isArray(stopIds)) {
      return NextResponse.json({ success: false, error: 'stopIds array is required' }, { status: 400 });
    }

    const { data: trip } = await supabase.from('trips').select('owner_id').eq('id', params.tripId).single();
    if (!trip) return NextResponse.json({ success: false, error: 'Trip not found' }, { status: 404 });
    if (trip.owner_id !== user.id) return NextResponse.json({ success: false, error: 'Access denied' }, { status: 403 });

    // Update each stop's order_index
    await Promise.all(
      stopIds.map((id: string, index: number) =>
        supabase.from('trip_stops').update({ order_index: index }).eq('id', id)
      )
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Reorder stops error:', error);
    return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
  }
}

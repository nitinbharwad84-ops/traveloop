import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { tripStopSchema } from '@/schemas/itinerary.schema';

export async function GET(request: Request, { params }: { params: { tripId: string } }) {
  try {
    const supabase = createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ success: false, error: { code: 'UNAUTHORIZED', message: 'Not authenticated' } }, { status: 401 });
    }

    // Verify trip ownership
    const { data: trip } = await supabase
      .from('trips')
      .select('id, owner_id')
      .eq('id', params.tripId)
      .single();

    if (!trip) {
      return NextResponse.json({ success: false, error: { code: 'NOT_FOUND', message: 'Trip not found' } }, { status: 404 });
    }
    if (trip.owner_id !== user.id) {
      return NextResponse.json({ success: false, error: { code: 'FORBIDDEN', message: 'Access denied' } }, { status: 403 });
    }

    // Get stops with activities
    const { data: stops, error } = await supabase
      .from('trip_stops')
      .select('*, trip_activities(*)') 
      .eq('trip_id', params.tripId)
      .order('order_index', { ascending: true });

    if (error) {
      console.error('Fetch stops DB error:', error);
      return NextResponse.json({ success: false, error: { code: 'INTERNAL_ERROR', message: 'Failed to fetch stops' } }, { status: 500 });
    }

    // Sort activities within each stop
    const stopsWithSortedActivities = (stops || []).map(stop => ({
      ...stop,
      trip_activities: (stop.trip_activities || []).sort((a: { day_number: number; order_index: number }, b: { day_number: number; order_index: number }) => {
        if ((a.day_number || 0) !== (b.day_number || 0)) return (a.day_number || 0) - (b.day_number || 0);
        return a.order_index - b.order_index;
      }),
    }));

    return NextResponse.json({ success: true, data: stopsWithSortedActivities });
  } catch (error) {
    console.error('Fetch stops error:', error);
    return NextResponse.json({ success: false, error: { code: 'INTERNAL_ERROR', message: 'An unexpected error occurred' } }, { status: 500 });
  }
}

export async function POST(request: Request, { params }: { params: { tripId: string } }) {
  try {
    const supabase = createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ success: false, error: { code: 'UNAUTHORIZED', message: 'Not authenticated' } }, { status: 401 });
    }

    const { data: trip } = await supabase
      .from('trips')
      .select('id, owner_id')
      .eq('id', params.tripId)
      .single();

    if (!trip) {
      return NextResponse.json({ success: false, error: { code: 'NOT_FOUND', message: 'Trip not found' } }, { status: 404 });
    }
    if (trip.owner_id !== user.id) {
      return NextResponse.json({ success: false, error: { code: 'FORBIDDEN', message: 'Access denied' } }, { status: 403 });
    }

    const body = await request.json();
    const result = tripStopSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json({ success: false, error: { code: 'VALIDATION_ERROR', message: 'Invalid stop data', details: result.error.flatten() } }, { status: 400 });
    }

    const { data } = result;

    // Determine orderIndex
    let orderIndex = data.orderIndex;
    if (orderIndex === 0) {
      const { data: lastStop } = await supabase
        .from('trip_stops')
        .select('order_index')
        .eq('trip_id', params.tripId)
        .order('order_index', { ascending: false })
        .limit(1)
        .single();

      orderIndex = lastStop ? lastStop.order_index + 1 : 0;
    }

    const { data: newStop, error } = await supabase
      .from('trip_stops')
      .insert({
        trip_id: params.tripId,
        city_name: data.cityName,
        country_name: data.countryName,
        arrival_date: data.arrivalDate || null,
        departure_date: data.departureDate || null,
        timezone: data.timezone,
        order_index: orderIndex,
        notes: data.notes,
        estimated_transport_cost: data.estimatedTransportCost,
        estimated_transport_time: data.estimatedTransportTime,
      })
      .select('*, trip_activities(*)')
      .single();

    if (error) {
      console.error('Create stop DB error:', error);
      return NextResponse.json({ success: false, error: { code: 'INTERNAL_ERROR', message: 'Failed to create stop' } }, { status: 500 });
    }

    return NextResponse.json({ success: true, data: newStop });
  } catch (error) {
    console.error('Create stop error:', error);
    return NextResponse.json({ success: false, error: { code: 'INTERNAL_ERROR', message: 'An unexpected error occurred' } }, { status: 500 });
  }
}

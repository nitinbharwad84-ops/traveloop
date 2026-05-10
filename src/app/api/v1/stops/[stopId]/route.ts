import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { tripStopUpdateSchema } from '@/schemas/itinerary.schema';

export async function PATCH(request: Request, { params }: { params: { stopId: string } }) {
  try {
    const supabase = createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ success: false, error: { code: 'UNAUTHORIZED', message: 'Not authenticated' } }, { status: 401 });
    }

    // Verify ownership via join
    const { data: stop } = await supabase
      .from('trip_stops')
      .select('*, trips!inner(owner_id)')
      .eq('id', params.stopId)
      .single();

    if (!stop) return NextResponse.json({ success: false, error: { code: 'NOT_FOUND', message: 'Stop not found' } }, { status: 404 });
    if (stop.trips.owner_id !== user.id) return NextResponse.json({ success: false, error: { code: 'FORBIDDEN', message: 'Access denied' } }, { status: 403 });

    const body = await request.json();
    const result = tripStopUpdateSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json({ success: false, error: { code: 'VALIDATION_ERROR', message: 'Invalid stop data', details: result.error.flatten() } }, { status: 400 });
    }

    const { data } = result;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const updateData: Record<string, any> = {};
    if (data.cityName !== undefined) updateData.city_name = data.cityName;
    if (data.countryName !== undefined) updateData.country_name = data.countryName;
    if (data.arrivalDate !== undefined) updateData.arrival_date = data.arrivalDate || null;
    if (data.departureDate !== undefined) updateData.departure_date = data.departureDate || null;
    if (data.timezone !== undefined) updateData.timezone = data.timezone;
    if (data.notes !== undefined) updateData.notes = data.notes;
    if (data.estimatedTransportCost !== undefined) updateData.estimated_transport_cost = data.estimatedTransportCost;
    if (data.estimatedTransportTime !== undefined) updateData.estimated_transport_time = data.estimatedTransportTime;

    const { data: updatedStop, error } = await supabase
      .from('trip_stops')
      .update(updateData)
      .eq('id', params.stopId)
      .select('*, trip_activities(*)')
      .single();

    if (error) throw error;
    return NextResponse.json({ success: true, data: updatedStop });
  } catch (error) {
    console.error('Update stop error:', error);
    return NextResponse.json({ success: false, error: { code: 'INTERNAL_ERROR', message: 'An unexpected error occurred' } }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: { stopId: string } }) {
  try {
    const supabase = createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ success: false, error: { code: 'UNAUTHORIZED', message: 'Not authenticated' } }, { status: 401 });
    }

    const { data: stop } = await supabase
      .from('trip_stops')
      .select('*, trips!inner(owner_id)')
      .eq('id', params.stopId)
      .single();

    if (!stop) return NextResponse.json({ success: false, error: { code: 'NOT_FOUND', message: 'Stop not found' } }, { status: 404 });
    if (stop.trips.owner_id !== user.id) return NextResponse.json({ success: false, error: { code: 'FORBIDDEN', message: 'Access denied' } }, { status: 403 });

    // CASCADE delete handles trip_activities
    await supabase.from('trip_stops').delete().eq('id', params.stopId);

    return NextResponse.json({ success: true, data: null });
  } catch (error) {
    console.error('Delete stop error:', error);
    return NextResponse.json({ success: false, error: { code: 'INTERNAL_ERROR', message: 'An unexpected error occurred' } }, { status: 500 });
  }
}

import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { tripActivitySchema } from '@/schemas/itinerary.schema';

export async function POST(request: Request, { params }: { params: { stopId: string } }) {
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

    const body = await request.json();
    const result = tripActivitySchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json({ success: false, error: { code: 'VALIDATION_ERROR', message: 'Invalid activity data', details: result.error.flatten() } }, { status: 400 });
    }

    const { data } = result;

    let orderIndex = data.orderIndex;
    if (orderIndex === 0) {
      const { data: lastActivity } = await supabase
        .from('trip_activities')
        .select('order_index')
        .eq('trip_stop_id', params.stopId)
        .eq('day_number', data.dayNumber)
        .order('order_index', { ascending: false })
        .limit(1)
        .single();

      orderIndex = lastActivity ? lastActivity.order_index + 1 : 0;
    }

    const { data: newActivity, error } = await supabase
      .from('trip_activities')
      .insert({
        trip_stop_id: params.stopId,
        activity_id: data.activityId || null,
        title: data.title,
        description: data.description,
        day_number: data.dayNumber,
        time_slot: data.timeSlot,
        custom_notes: data.customNotes,
        custom_cost: data.customCost,
        order_index: orderIndex,
      })
      .select()
      .single();

    if (error) throw error;
    return NextResponse.json({ success: true, data: newActivity });
  } catch (error) {
    console.error('Create activity error:', error);
    return NextResponse.json({ success: false, error: { code: 'INTERNAL_ERROR', message: 'An unexpected error occurred' } }, { status: 500 });
  }
}

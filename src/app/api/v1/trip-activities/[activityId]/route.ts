import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { tripActivityUpdateSchema } from '@/schemas/itinerary.schema';

export async function PATCH(request: Request, { params }: { params: { activityId: string } }) {
  try {
    const supabase = createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ success: false, error: { code: 'UNAUTHORIZED', message: 'Not authenticated' } }, { status: 401 });
    }

    // Verify ownership: activity → stop → trip → owner
    const { data: activity } = await supabase
      .from('trip_activities')
      .select('*, trip_stops!inner(*, trips!inner(owner_id))')
      .eq('id', params.activityId)
      .single();

    if (!activity) return NextResponse.json({ success: false, error: { code: 'NOT_FOUND', message: 'Activity not found' } }, { status: 404 });
    if (activity.trip_stops.trips.owner_id !== user.id) return NextResponse.json({ success: false, error: { code: 'FORBIDDEN', message: 'Access denied' } }, { status: 403 });

    const body = await request.json();
    const result = tripActivityUpdateSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json({ success: false, error: { code: 'VALIDATION_ERROR', message: 'Invalid activity data', details: result.error.flatten() } }, { status: 400 });
    }

    const { data } = result;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const updateData: Record<string, any> = {};
    if (data.title !== undefined) updateData.title = data.title;
    if (data.description !== undefined) updateData.description = data.description;
    if (data.dayNumber !== undefined) updateData.day_number = data.dayNumber;
    if (data.timeSlot !== undefined) updateData.time_slot = data.timeSlot;
    if (data.customNotes !== undefined) updateData.custom_notes = data.customNotes;
    if (data.customCost !== undefined) updateData.custom_cost = data.customCost;
    if (data.orderIndex !== undefined) updateData.order_index = data.orderIndex;

    const { data: updatedActivity, error } = await supabase
      .from('trip_activities')
      .update(updateData)
      .eq('id', params.activityId)
      .select()
      .single();

    if (error) throw error;
    return NextResponse.json({ success: true, data: updatedActivity });
  } catch (error) {
    console.error('Update activity error:', error);
    return NextResponse.json({ success: false, error: { code: 'INTERNAL_ERROR', message: 'An unexpected error occurred' } }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: { activityId: string } }) {
  try {
    const supabase = createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ success: false, error: { code: 'UNAUTHORIZED', message: 'Not authenticated' } }, { status: 401 });
    }

    const { data: activity } = await supabase
      .from('trip_activities')
      .select('*, trip_stops!inner(*, trips!inner(owner_id))')
      .eq('id', params.activityId)
      .single();

    if (!activity) return NextResponse.json({ success: false, error: { code: 'NOT_FOUND', message: 'Activity not found' } }, { status: 404 });
    if (activity.trip_stops.trips.owner_id !== user.id) return NextResponse.json({ success: false, error: { code: 'FORBIDDEN', message: 'Access denied' } }, { status: 403 });

    await supabase.from('trip_activities').delete().eq('id', params.activityId);
    return NextResponse.json({ success: true, data: null });
  } catch (error) {
    console.error('Delete activity error:', error);
    return NextResponse.json({ success: false, error: { code: 'INTERNAL_ERROR', message: 'An unexpected error occurred' } }, { status: 500 });
  }
}

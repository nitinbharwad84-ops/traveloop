import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function POST(request: Request, { params }: { params: { tripId: string } }) {
  try {
    const supabase = createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ success: false, error: { code: 'UNAUTHORIZED', message: 'Not authenticated' } }, { status: 401 });
    }

    const existingTrip = await supabase.from('trips').select('*').eq('id', params.tripId).single();
    if (!existingTrip.data) return NextResponse.json({ success: false, error: { code: 'NOT_FOUND', message: 'Trip not found' } }, { status: 404 });
    if (existingTrip.data.owner_id !== user.id) return NextResponse.json({ success: false, error: { code: 'FORBIDDEN', message: 'Access denied' } }, { status: 403 });

    const trip = existingTrip.data;

    // Create the duplicate trip
    const { data: newTrip, error } = await supabase
      .from('trips')
      .insert({
        owner_id: user.id,
        title: `${trip.title} (Copy)`,
        description: trip.description,
        cover_image_url: trip.cover_image_url,
        start_date: trip.start_date,
        end_date: trip.end_date,
        traveler_count: trip.traveler_count,
        budget_target: trip.budget_target,
        currency: trip.currency,
        trip_type: trip.trip_type,
        privacy: trip.privacy,
        status: 'draft',
        transport_preference: trip.transport_preference,
        accommodation_preference: trip.accommodation_preference,
        origin_city: trip.origin_city,
      })
      .select()
      .single();

    if (error || !newTrip) throw error;

    // Duplicate budgets
    const { data: budgets } = await supabase.from('budgets').select('*').eq('trip_id', params.tripId);
    if (budgets && budgets.length > 0) {
      await supabase.from('budgets').insert(
        budgets.map(b => ({ trip_id: newTrip.id, category: b.category, estimated_amount: b.estimated_amount, actual_amount: 0, currency: b.currency }))
      );
    }

    // Duplicate packing items
    const { data: packingItems } = await supabase.from('packing_items').select('*').eq('trip_id', params.tripId);
    if (packingItems && packingItems.length > 0) {
      await supabase.from('packing_items').insert(
        packingItems.map(p => ({ trip_id: newTrip.id, name: p.name, category: p.category, packed: false, created_by: user.id }))
      );
    }

    // Duplicate stops and activities
    const { data: stops } = await supabase.from('trip_stops').select('*, trip_activities(*)').eq('trip_id', params.tripId);
    if (stops) {
      for (const stop of stops) {
        const { data: newStop } = await supabase.from('trip_stops').insert({
          trip_id: newTrip.id, city_name: stop.city_name, country_name: stop.country_name,
          arrival_date: stop.arrival_date, departure_date: stop.departure_date,
          timezone: stop.timezone, order_index: stop.order_index, notes: stop.notes,
          estimated_transport_cost: stop.estimated_transport_cost, estimated_transport_time: stop.estimated_transport_time,
        }).select().single();

        if (newStop && stop.trip_activities?.length > 0) {
          await supabase.from('trip_activities').insert(
            stop.trip_activities.map((a: Record<string, unknown>) => ({
              trip_stop_id: newStop.id, activity_id: a.activity_id, title: a.title, description: a.description,
              day_number: a.day_number, time_slot: a.time_slot, custom_notes: a.custom_notes,
              custom_cost: a.custom_cost, order_index: a.order_index,
            }))
          );
        }
      }
    }

    // Return with counts
    const { count: stopsCount } = await supabase.from('trip_stops').select('id', { count: 'exact', head: true }).eq('trip_id', newTrip.id);
    const { data: newBudgets } = await supabase.from('budgets').select('*').eq('trip_id', newTrip.id);

    return NextResponse.json({ success: true, data: { ...newTrip, budgets: newBudgets || [], _count: { stops: stopsCount ?? 0, collaborators: 0 } } });
  } catch (error) {
    console.error('Duplicate trip error:', error);
    return NextResponse.json({ success: false, error: { code: 'INTERNAL_ERROR', message: 'An unexpected error occurred' } }, { status: 500 });
  }
}

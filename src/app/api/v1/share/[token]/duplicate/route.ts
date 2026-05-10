import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function POST(request: Request, { params }: { params: { token: string } }) {
  try {
    const supabase = createClient();
    const { token } = params;

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ success: false, error: 'You must be logged in to duplicate a trip' }, { status: 401 });

    const { data: sharedLink } = await supabase
      .from('shared_links')
      .select('*, trips(*, trip_stops(*, trip_activities(*)), packing_items(*))')
      .eq('token', token)
      .single();

    if (!sharedLink) return NextResponse.json({ success: false, error: 'Link not found' }, { status: 404 });
    if (sharedLink.expires_at && new Date(sharedLink.expires_at) < new Date()) return NextResponse.json({ success: false, error: 'Link expired' }, { status: 410 });

    const sourceTrip = sharedLink.trips;

    // Create duplicate trip
    const { data: newTrip } = await supabase.from('trips').insert({
      owner_id: user.id, title: `${sourceTrip.title} (Copy)`, description: sourceTrip.description,
      start_date: sourceTrip.start_date, end_date: sourceTrip.end_date, traveler_count: sourceTrip.traveler_count,
      currency: sourceTrip.currency, trip_type: sourceTrip.trip_type, privacy: 'private', status: 'draft',
      transport_preference: sourceTrip.transport_preference, accommodation_preference: sourceTrip.accommodation_preference,
      origin_city: sourceTrip.origin_city,
    }).select().single();

    if (!newTrip) throw new Error('Failed to create trip');

    // Duplicate stops & activities
    if (sourceTrip.trip_stops) {
      for (const stop of sourceTrip.trip_stops) {
        const { data: newStop } = await supabase.from('trip_stops').insert({
          trip_id: newTrip.id, city_name: stop.city_name, country_name: stop.country_name,
          arrival_date: stop.arrival_date, departure_date: stop.departure_date,
          timezone: stop.timezone, order_index: stop.order_index, notes: stop.notes,
          estimated_transport_cost: stop.estimated_transport_cost, estimated_transport_time: stop.estimated_transport_time,
        }).select().single();

        if (newStop && stop.trip_activities?.length > 0) {
          await supabase.from('trip_activities').insert(
            stop.trip_activities.map((act: Record<string, unknown>) => ({
              trip_stop_id: newStop.id, activity_id: act.activity_id, title: act.title, description: act.description,
              day_number: act.day_number, time_slot: act.time_slot, custom_notes: act.custom_notes,
              custom_cost: act.custom_cost, order_index: act.order_index,
            }))
          );
        }
      }
    }

    // Duplicate packing items
    if (sourceTrip.packing_items?.length > 0) {
      await supabase.from('packing_items').insert(
        sourceTrip.packing_items.map((item: Record<string, unknown>) => ({
          trip_id: newTrip.id, name: item.name, category: item.category, packed: false, created_by: user.id,
        }))
      );
    }

    return NextResponse.json({ success: true, data: newTrip });
  } catch (error) {
    console.error('Duplicate Trip POST Error:', error);
    return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
  }
}

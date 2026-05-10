import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { tripBaseSchema } from '@/schemas/trip.schema';
import { requireTripAccess } from '@/lib/rbac';
import type { TripType, TripPrivacy, TripStatus } from '@/types';

export async function GET(request: Request, { params }: { params: { tripId: string } }) {
  try {
    const supabase = createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    if (!(await requireTripAccess(params.tripId, user.id, 'viewer'))) {
      return NextResponse.json({ success: false, error: 'Access denied' }, { status: 403 });
    }

    const { data: trip, error } = await supabase
      .from('trips')
      .select('*, budgets(*), packing_items(*), notes(*), users!trips_owner_id_fkey(id, email, profiles(first_name, last_name, avatar_url))')
      .eq('id', params.tripId)
      .single();

    if (error || !trip) {
      return NextResponse.json({ success: false, error: 'Trip not found' }, { status: 404 });
    }

    // Get counts
    const [stopsRes, collabsRes] = await Promise.all([
      supabase.from('trip_stops').select('id', { count: 'exact', head: true }).eq('trip_id', params.tripId),
      supabase.from('collaborators').select('id', { count: 'exact', head: true }).eq('trip_id', params.tripId),
    ]);

    // Reshape owner field to match the expected frontend format
    const owner = trip.users;
    const tripData = {
      ...trip,
      owner,
      users: undefined,
      _count: {
        stops: stopsRes.count ?? 0,
        collaborators: collabsRes.count ?? 0,
      }
    };
    delete tripData.users;

    return NextResponse.json({ success: true, data: tripData });
  } catch (error) {
    console.error('Fetch trip error:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}

export async function PATCH(request: Request, { params }: { params: { tripId: string } }) {
  try {
    const supabase = createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    if (!(await requireTripAccess(params.tripId, user.id, 'editor'))) {
      return NextResponse.json({ success: false, error: 'Access denied' }, { status: 403 });
    }

    const body = await request.json();
    const result = tripBaseSchema.partial().safeParse(body);

    if (!result.success) {
      return NextResponse.json({ success: false, error: 'Invalid data', details: result.error.flatten() }, { status: 400 });
    }

    const { data } = result;

    // Build update object with only defined fields
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const updateData: Record<string, any> = {};
    if (data.title !== undefined) updateData.title = data.title;
    if (data.description !== undefined) updateData.description = data.description;
    if (data.startDate !== undefined) updateData.start_date = data.startDate;
    if (data.endDate !== undefined) updateData.end_date = data.endDate;
    if (data.travelerCount !== undefined) updateData.traveler_count = data.travelerCount;
    if (data.budgetTarget !== undefined) updateData.budget_target = data.budgetTarget;
    if (data.currency !== undefined) updateData.currency = data.currency;
    if (data.tripType !== undefined) updateData.trip_type = data.tripType as TripType;
    if (data.privacy !== undefined) updateData.privacy = data.privacy as TripPrivacy;
    if (data.status !== undefined) updateData.status = data.status as TripStatus;
    if (data.transportPreference !== undefined) updateData.transport_preference = data.transportPreference;
    if (data.accommodationPreference !== undefined) updateData.accommodation_preference = data.accommodationPreference;
    if (data.originCity !== undefined) updateData.origin_city = data.originCity;

    const { data: updatedTrip, error } = await supabase
      .from('trips')
      .update(updateData)
      .eq('id', params.tripId)
      .select('*, budgets(*)')
      .single();

    if (error) {
      console.error('Update trip DB error:', error);
      return NextResponse.json({ success: false, error: 'Failed to update trip' }, { status: 500 });
    }

    // Get counts
    const [stopsRes, collabsRes] = await Promise.all([
      supabase.from('trip_stops').select('id', { count: 'exact', head: true }).eq('trip_id', params.tripId),
      supabase.from('collaborators').select('id', { count: 'exact', head: true }).eq('trip_id', params.tripId),
    ]);

    return NextResponse.json({
      success: true,
      data: {
        ...updatedTrip,
        _count: { stops: stopsRes.count ?? 0, collaborators: collabsRes.count ?? 0 }
      }
    });
  } catch (error) {
    console.error('Update trip error:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: { tripId: string } }) {
  try {
    const supabase = createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    if (!(await requireTripAccess(params.tripId, user.id, 'owner'))) {
      return NextResponse.json({ success: false, error: 'Access denied' }, { status: 403 });
    }

    const { error } = await supabase
      .from('trips')
      .delete()
      .eq('id', params.tripId);

    if (error) {
      console.error('Delete trip DB error:', error);
      return NextResponse.json({ success: false, error: 'Failed to delete trip' }, { status: 500 });
    }

    return NextResponse.json({ success: true, message: 'Trip deleted' });
  } catch (error) {
    console.error('Delete trip error:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}

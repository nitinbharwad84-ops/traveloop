import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { tripSchema } from '@/schemas/trip.schema';
import type { TripType, TripPrivacy, TripStatus } from '@/types';

export async function GET(request: Request) {
  try {
    const supabase = createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ success: false, error: { code: 'UNAUTHORIZED', message: 'Not authenticated' } }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const filter = searchParams.get('filter');
    const status = searchParams.get('status');
    const q = searchParams.get('q');
    const sort = searchParams.get('sort');
    const limitParam = searchParams.get('limit');
    const limit = limitParam ? parseInt(limitParam, 10) : undefined;

    // Get trip IDs where user is an accepted collaborator
    const { data: collabTrips } = await supabase
      .from('collaborators')
      .select('trip_id')
      .eq('user_id', user.id)
      .eq('status', 'accepted');

    const collabTripIds = (collabTrips || []).map(c => c.trip_id);

    // Build the query
    let query = supabase
      .from('trips')
      .select('*, budgets(*)')
      .or(`owner_id.eq.${user.id}${collabTripIds.length > 0 ? `,id.in.(${collabTripIds.join(',')})` : ''}`);

    if (filter === 'upcoming') {
      query = query.gte('start_date', new Date().toISOString().split('T')[0]);
    }
    if (status && status !== 'all') {
      query = query.eq('status', status as TripStatus);
    }
    if (q) {
      query = query.ilike('title', `%${q}%`);
    }

    // Sorting
    if (sort === 'date_asc') query = query.order('start_date', { ascending: true });
    else if (sort === 'date_desc') query = query.order('start_date', { ascending: false });
    else if (sort === 'created_desc') query = query.order('created_at', { ascending: false });
    else if (filter === 'upcoming') query = query.order('start_date', { ascending: true });
    else query = query.order('updated_at', { ascending: false });

    if (limit) {
      query = query.limit(limit);
    }

    const { data: trips, error } = await query;

    if (error) {
      console.error('Fetch trips DB error:', error);
      return NextResponse.json({ success: false, error: { code: 'INTERNAL_ERROR', message: 'Failed to fetch trips' } }, { status: 500 });
    }

    // Get counts for each trip
    const tripsWithCounts = await Promise.all((trips || []).map(async (trip) => {
      const [stopsRes, collabsRes] = await Promise.all([
        supabase.from('trip_stops').select('id', { count: 'exact', head: true }).eq('trip_id', trip.id),
        supabase.from('collaborators').select('id', { count: 'exact', head: true }).eq('trip_id', trip.id),
      ]);
      return {
        ...trip,
        _count: {
          stops: stopsRes.count ?? 0,
          collaborators: collabsRes.count ?? 0,
        }
      };
    }));

    return NextResponse.json({ success: true, data: tripsWithCounts });
  } catch (error) {
    console.error('Fetch trips error:', error);
    return NextResponse.json({ success: false, error: { code: 'INTERNAL_ERROR', message: 'An unexpected error occurred' } }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const supabase = createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ success: false, error: { code: 'UNAUTHORIZED', message: 'Not authenticated' } }, { status: 401 });
    }

    const body = await request.json();
    const result = tripSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json({ success: false, error: { code: 'VALIDATION_ERROR', message: 'Invalid input data', details: result.error.flatten() } }, { status: 400 });
    }

    const { data } = result;

    const { data: trip, error } = await supabase
      .from('trips')
      .insert({
        owner_id: user.id,
        title: data.title,
        description: data.description,
        start_date: data.startDate || null,
        end_date: data.endDate || null,
        traveler_count: data.travelerCount,
        budget_target: data.budgetTarget || null,
        currency: data.currency,
        trip_type: data.tripType as TripType,
        privacy: data.privacy as TripPrivacy,
        status: (data.status || 'draft') as TripStatus,
        transport_preference: data.transportPreference,
        accommodation_preference: data.accommodationPreference,
        origin_city: data.originCity,
      })
      .select('*, budgets(*)')
      .single();

    if (error) {
      console.error('Create trip DB error:', error);
      return NextResponse.json({ success: false, error: { code: 'INTERNAL_ERROR', message: 'Failed to create trip' } }, { status: 500 });
    }

    return NextResponse.json({ success: true, data: { ...trip, _count: { stops: 0, collaborators: 0 } } });
  } catch (error) {
    console.error('Create trip error:', error);
    return NextResponse.json({ success: false, error: { code: 'INTERNAL_ERROR', message: 'An unexpected error occurred' } }, { status: 500 });
  }
}

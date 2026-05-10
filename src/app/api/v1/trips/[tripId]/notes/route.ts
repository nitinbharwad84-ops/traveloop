import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import type { NoteType } from '@/types';

export async function GET(request: Request, { params }: { params: { tripId: string } }) {
  try {
    const supabase = createClient();
    const { tripId } = params;
    if (!tripId) return NextResponse.json({ success: false, error: 'Trip ID is required' }, { status: 400 });

    const { data: notes, error } = await supabase
      .from('notes')
      .select('*')
      .eq('trip_id', tripId)
      .order('updated_at', { ascending: false });

    if (error) throw error;
    return NextResponse.json({ success: true, data: notes || [] });
  } catch (error) {
    console.error('Notes GET Error:', error);
    return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(request: Request, { params }: { params: { tripId: string } }) {
  try {
    const supabase = createClient();
    const { tripId } = params;
    if (!tripId) return NextResponse.json({ success: false, error: 'Trip ID is required' }, { status: 400 });

    // Get the authenticated user
    const { data: { user } } = await supabase.auth.getUser();

    // Fallback to trip owner if not authenticated
    let userId = user?.id;
    if (!userId) {
      const { data: trip } = await supabase
        .from('trips')
        .select('owner_id')
        .eq('id', tripId)
        .single();
      if (!trip) return NextResponse.json({ success: false, error: 'Trip not found' }, { status: 404 });
      userId = trip.owner_id;
    }

    const body = await request.json();
    const { content, noteType, linkedDay } = body;

    const { data: newNote, error } = await supabase
      .from('notes')
      .insert({
        trip_id: tripId,
        user_id: userId,
        content: content || '',
        note_type: (noteType as NoteType) || 'general',
        linked_day: linkedDay || null,
      })
      .select()
      .single();

    if (error) throw error;
    return NextResponse.json({ success: true, data: newNote });
  } catch (error) {
    console.error('Notes POST Error:', error);
    return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
  }
}

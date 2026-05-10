import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(request: Request, { params }: { params: { tripId: string } }) {
  try {
    const supabase = createClient();
    const { tripId } = params;

    const { data: collaborators, error } = await supabase
      .from('collaborators')
      .select('*, users!collaborators_user_id_fkey(id, email, profiles(first_name, last_name, avatar_url))')
      .eq('trip_id', tripId)
      .order('created_at', { ascending: true });

    if (error) throw error;

    // Reshape to match expected format
    const result = (collaborators || []).map(c => ({
      ...c,
      user: c.users,
      users: undefined,
    }));

    return NextResponse.json({ success: true, data: result });
  } catch (error) {
    console.error('Collaborators GET Error:', error);
    return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
  }
}

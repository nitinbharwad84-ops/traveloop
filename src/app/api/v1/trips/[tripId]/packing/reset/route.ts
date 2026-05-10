import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function POST(request: Request, { params }: { params: { tripId: string } }) {
  try {
    const supabase = createClient();
    await supabase.from('packing_items').update({ packed: false }).eq('trip_id', params.tripId);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Packing reset error:', error);
    return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
  }
}

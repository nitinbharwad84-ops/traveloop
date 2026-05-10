import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import type { PackingCategory } from '@/types';

export async function GET(request: Request, { params }: { params: { tripId: string } }) {
  try {
    const supabase = createClient();
    const { tripId } = params;
    if (!tripId) return NextResponse.json({ success: false, error: 'Trip ID is required' }, { status: 400 });

    const { data: items, error } = await supabase
      .from('packing_items')
      .select('*')
      .eq('trip_id', tripId)
      .order('category', { ascending: true })
      .order('created_at', { ascending: false });

    if (error) throw error;
    return NextResponse.json({ success: true, data: items || [] });
  } catch (error) {
    console.error('Packing GET Error:', error);
    return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(request: Request, { params }: { params: { tripId: string } }) {
  try {
    const supabase = createClient();
    const { tripId } = params;
    if (!tripId) return NextResponse.json({ success: false, error: 'Trip ID is required' }, { status: 400 });

    const body = await request.json();

    // Check if it's a bulk duplicate operation
    if (body.sourceTripId) {
      const { data: sourceItems } = await supabase
        .from('packing_items')
        .select('*')
        .eq('trip_id', body.sourceTripId);

      if (!sourceItems || sourceItems.length === 0) {
        return NextResponse.json({ success: true, data: [] });
      }

      await supabase.from('packing_items').insert(
        sourceItems.map(item => ({
          trip_id: tripId,
          name: item.name,
          category: item.category,
          packed: false,
        }))
      );

      const { data: newItems } = await supabase
        .from('packing_items')
        .select('*')
        .eq('trip_id', tripId)
        .order('category', { ascending: true })
        .order('created_at', { ascending: false });

      return NextResponse.json({ success: true, data: newItems || [] });
    }

    // Standard single item creation
    const { name, category } = body;
    if (!name) {
      return NextResponse.json({ success: false, error: 'Item name is required' }, { status: 400 });
    }

    const { data: newItem, error } = await supabase
      .from('packing_items')
      .insert({
        trip_id: tripId,
        name,
        category: (category as PackingCategory) || null,
        packed: false,
      })
      .select()
      .single();

    if (error) throw error;
    return NextResponse.json({ success: true, data: newItem });
  } catch (error) {
    console.error('Packing POST Error:', error);
    return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
  }
}

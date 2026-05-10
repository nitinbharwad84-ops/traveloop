import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import type { PackingCategory } from '@/types';

export async function PATCH(request: Request, { params }: { params: { itemId: string } }) {
  try {
    const supabase = createClient();
    const { itemId } = params;
    if (!itemId) return NextResponse.json({ success: false, error: 'Item ID is required' }, { status: 400 });

    const body = await request.json();
    const { name, category, packed } = body;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const updateData: Record<string, any> = {};
    if (name !== undefined) updateData.name = name;
    if (category !== undefined) updateData.category = category as PackingCategory;
    if (packed !== undefined) updateData.packed = packed;

    const { data: updated, error } = await supabase.from('packing_items').update(updateData).eq('id', itemId).select().single();

    if (error) {
      if (error.code === 'PGRST116') return NextResponse.json({ success: false, error: 'Packing item not found' }, { status: 404 });
      throw error;
    }
    return NextResponse.json({ success: true, data: updated });
  } catch (error) {
    console.error('Packing PATCH Error:', error);
    return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: { itemId: string } }) {
  try {
    const supabase = createClient();
    const { itemId } = params;
    if (!itemId) return NextResponse.json({ success: false, error: 'Item ID is required' }, { status: 400 });

    const { error } = await supabase.from('packing_items').delete().eq('id', itemId);
    if (error) {
      if (error.code === 'PGRST116') return NextResponse.json({ success: false, error: 'Packing item not found' }, { status: 404 });
      throw error;
    }
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Packing DELETE Error:', error);
    return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
  }
}

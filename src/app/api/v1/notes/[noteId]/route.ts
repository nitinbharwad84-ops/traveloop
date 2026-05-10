import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import type { NoteType } from '@/types';

export async function PATCH(request: Request, { params }: { params: { noteId: string } }) {
  try {
    const supabase = createClient();
    const { noteId } = params;
    if (!noteId) return NextResponse.json({ success: false, error: 'Note ID is required' }, { status: 400 });

    const body = await request.json();
    const { content, noteType, linkedDay } = body;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const updateData: Record<string, any> = {};
    if (content !== undefined) updateData.content = content;
    if (noteType !== undefined) updateData.note_type = noteType as NoteType;
    if (linkedDay !== undefined) updateData.linked_day = linkedDay;

    const { data: updated, error } = await supabase.from('notes').update(updateData).eq('id', noteId).select().single();

    if (error) {
      if (error.code === 'PGRST116') return NextResponse.json({ success: false, error: 'Note not found' }, { status: 404 });
      throw error;
    }
    return NextResponse.json({ success: true, data: updated });
  } catch (error) {
    console.error('Note PATCH Error:', error);
    return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: { noteId: string } }) {
  try {
    const supabase = createClient();
    const { noteId } = params;
    if (!noteId) return NextResponse.json({ success: false, error: 'Note ID is required' }, { status: 400 });

    const { error } = await supabase.from('notes').delete().eq('id', noteId);
    if (error) {
      if (error.code === 'PGRST116') return NextResponse.json({ success: false, error: 'Note not found' }, { status: 404 });
      throw error;
    }
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Note DELETE Error:', error);
    return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
  }
}

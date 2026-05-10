import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma/client';
import { NoteType } from '@prisma/client';

export async function PATCH(
  request: Request,
  { params }: { params: { noteId: string } }
) {
  try {
    const { noteId } = params;
    if (!noteId) return NextResponse.json({ success: false, error: 'Note ID is required' }, { status: 400 });

    const body = await request.json();
    const { content, noteType, linkedDay } = body;

    const updated = await prisma.note.update({
      where: { id: noteId },
      data: {
        ...(content !== undefined && { content }),
        ...(noteType !== undefined && { noteType: noteType as NoteType }),
        ...(linkedDay !== undefined && { linkedDay }),
      },
    });

    return NextResponse.json({ success: true, data: updated });
  } catch (error: unknown) {
    console.error('Note PATCH Error:', error);
    if (typeof error === 'object' && error !== null && 'code' in error && (error as { code: string }).code === 'P2025') {
      return NextResponse.json({ success: false, error: 'Note not found' }, { status: 404 });
    }
    return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { noteId: string } }
) {
  try {
    const { noteId } = params;
    if (!noteId) return NextResponse.json({ success: false, error: 'Note ID is required' }, { status: 400 });

    await prisma.note.delete({
      where: { id: noteId },
    });

    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    console.error('Note DELETE Error:', error);
    if (typeof error === 'object' && error !== null && 'code' in error && (error as { code: string }).code === 'P2025') {
      return NextResponse.json({ success: false, error: 'Note not found' }, { status: 404 });
    }
    return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
  }
}

import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma/client';
import { NoteType } from '@prisma/client';

export async function GET(
  request: Request,
  { params }: { params: { tripId: string } }
) {
  try {
    const { tripId } = params;
    if (!tripId) return NextResponse.json({ success: false, error: 'Trip ID is required' }, { status: 400 });

    const notes = await prisma.note.findMany({
      where: { tripId },
      orderBy: { updatedAt: 'desc' },
    });

    return NextResponse.json({ success: true, data: notes });
  } catch (error) {
    console.error('Notes GET Error:', error);
    return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(
  request: Request,
  { params }: { params: { tripId: string } }
) {
  try {
    const { tripId } = params;
    if (!tripId) return NextResponse.json({ success: false, error: 'Trip ID is required' }, { status: 400 });

    const trip = await prisma.trip.findUnique({
      where: { id: tripId },
      select: { ownerId: true },
    });

    if (!trip) return NextResponse.json({ success: false, error: 'Trip not found' }, { status: 404 });

    const body = await request.json();
    const { content, noteType, linkedDay } = body;

    const newNote = await prisma.note.create({
      data: {
        tripId,
        userId: trip.ownerId, // Using trip owner temporarily until Auth is fully established
        content: content || '',
        noteType: noteType as NoteType || 'general',
        linkedDay: linkedDay || null,
      },
    });

    return NextResponse.json({ success: true, data: newNote });
  } catch (error) {
    console.error('Notes POST Error:', error);
    return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
  }
}

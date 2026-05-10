import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { prisma } from '@/lib/prisma/client';
import { tripActivitySchema } from '@/schemas/itinerary.schema';

export async function POST(request: Request, { params }: { params: { stopId: string } }) {
  try {
    const supabase = createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ success: false, error: { code: 'UNAUTHORIZED', message: 'Not authenticated' } }, { status: 401 });
    }

    const stop = await prisma.tripStop.findUnique({
      where: { id: params.stopId },
      include: { trip: true }
    });

    if (!stop) return NextResponse.json({ success: false, error: { code: 'NOT_FOUND', message: 'Stop not found' } }, { status: 404 });
    if (stop.trip.ownerId !== user.id) return NextResponse.json({ success: false, error: { code: 'FORBIDDEN', message: 'Access denied' } }, { status: 403 });

    const body = await request.json();
    const result = tripActivitySchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json({ success: false, error: { code: 'VALIDATION_ERROR', message: 'Invalid activity data', details: result.error.flatten() } }, { status: 400 });
    }

    const { data } = result;

    let orderIndex = data.orderIndex;
    if (orderIndex === 0) {
      const lastActivity = await prisma.tripActivity.findFirst({
        where: { tripStopId: params.stopId, dayNumber: data.dayNumber },
        orderBy: { orderIndex: 'desc' },
      });
      orderIndex = lastActivity ? lastActivity.orderIndex + 1 : 0;
    }

    const newActivity = await prisma.tripActivity.create({
      data: {
        tripStopId: params.stopId,
        activityId: data.activityId, // Optional reference to master table
        title: data.title,
        description: data.description,
        dayNumber: data.dayNumber,
        timeSlot: data.timeSlot,
        customNotes: data.customNotes,
        customCost: data.customCost,
        orderIndex,
      }
    });

    return NextResponse.json({ success: true, data: newActivity });
  } catch (error) {
    console.error('Create activity error:', error);
    return NextResponse.json({ success: false, error: { code: 'INTERNAL_ERROR', message: 'An unexpected error occurred' } }, { status: 500 });
  }
}

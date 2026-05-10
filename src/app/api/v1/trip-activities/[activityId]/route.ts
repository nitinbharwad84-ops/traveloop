import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { prisma } from '@/lib/prisma/client';
import { tripActivityUpdateSchema } from '@/schemas/itinerary.schema';

export async function PATCH(request: Request, { params }: { params: { activityId: string } }) {
  try {
    const supabase = createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ success: false, error: { code: 'UNAUTHORIZED', message: 'Not authenticated' } }, { status: 401 });
    }

    const activity = await prisma.tripActivity.findUnique({
      where: { id: params.activityId },
      include: {
        tripStop: {
          include: { trip: true }
        }
      }
    });

    if (!activity) return NextResponse.json({ success: false, error: { code: 'NOT_FOUND', message: 'Activity not found' } }, { status: 404 });
    if (activity.tripStop.trip.ownerId !== user.id) return NextResponse.json({ success: false, error: { code: 'FORBIDDEN', message: 'Access denied' } }, { status: 403 });

    const body = await request.json();
    const result = tripActivityUpdateSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json({ success: false, error: { code: 'VALIDATION_ERROR', message: 'Invalid activity data', details: result.error.flatten() } }, { status: 400 });
    }

    const { data } = result;

    const updatedActivity = await prisma.tripActivity.update({
      where: { id: params.activityId },
      data: {
        title: data.title,
        description: data.description,
        dayNumber: data.dayNumber,
        timeSlot: data.timeSlot,
        customNotes: data.customNotes,
        customCost: data.customCost,
        orderIndex: data.orderIndex,
      }
    });

    return NextResponse.json({ success: true, data: updatedActivity });
  } catch (error) {
    console.error('Update activity error:', error);
    return NextResponse.json({ success: false, error: { code: 'INTERNAL_ERROR', message: 'An unexpected error occurred' } }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: { activityId: string } }) {
  try {
    const supabase = createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ success: false, error: { code: 'UNAUTHORIZED', message: 'Not authenticated' } }, { status: 401 });
    }

    const activity = await prisma.tripActivity.findUnique({
      where: { id: params.activityId },
      include: {
        tripStop: {
          include: { trip: true }
        }
      }
    });

    if (!activity) return NextResponse.json({ success: false, error: { code: 'NOT_FOUND', message: 'Activity not found' } }, { status: 404 });
    if (activity.tripStop.trip.ownerId !== user.id) return NextResponse.json({ success: false, error: { code: 'FORBIDDEN', message: 'Access denied' } }, { status: 403 });

    await prisma.tripActivity.delete({ where: { id: params.activityId } });

    return NextResponse.json({ success: true, data: null });
  } catch (error) {
    console.error('Delete activity error:', error);
    return NextResponse.json({ success: false, error: { code: 'INTERNAL_ERROR', message: 'An unexpected error occurred' } }, { status: 500 });
  }
}

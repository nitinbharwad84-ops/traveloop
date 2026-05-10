import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { prisma } from '@/lib/prisma/client';
import { tripStopUpdateSchema } from '@/schemas/itinerary.schema';

export async function PATCH(request: Request, { params }: { params: { stopId: string } }) {
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
    const result = tripStopUpdateSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json({ success: false, error: { code: 'VALIDATION_ERROR', message: 'Invalid stop data', details: result.error.flatten() } }, { status: 400 });
    }

    const { data } = result;

    const updatedStop = await prisma.tripStop.update({
      where: { id: params.stopId },
      data: {
        cityName: data.cityName,
        countryName: data.countryName,
        arrivalDate: data.arrivalDate !== undefined ? (data.arrivalDate ? new Date(data.arrivalDate) : null) : undefined,
        departureDate: data.departureDate !== undefined ? (data.departureDate ? new Date(data.departureDate) : null) : undefined,
        timezone: data.timezone,
        notes: data.notes,
        estimatedTransportCost: data.estimatedTransportCost,
        estimatedTransportTime: data.estimatedTransportTime,
      },
      include: {
        tripActivities: true
      }
    });

    return NextResponse.json({ success: true, data: updatedStop });
  } catch (error) {
    console.error('Update stop error:', error);
    return NextResponse.json({ success: false, error: { code: 'INTERNAL_ERROR', message: 'An unexpected error occurred' } }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: { stopId: string } }) {
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

    // Cascade delete happens in Prisma because of onDelete: Cascade on tripActivities
    await prisma.tripStop.delete({ where: { id: params.stopId } });

    // We should probably rebalance orderIndexes here, but it's not strictly necessary for simple cases
    // as the reorder endpoint explicitly sets indexes.
    
    return NextResponse.json({ success: true, data: null });
  } catch (error) {
    console.error('Delete stop error:', error);
    return NextResponse.json({ success: false, error: { code: 'INTERNAL_ERROR', message: 'An unexpected error occurred' } }, { status: 500 });
  }
}

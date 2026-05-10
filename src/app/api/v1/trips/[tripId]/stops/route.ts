import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { prisma } from '@/lib/prisma/client';
import { tripStopSchema } from '@/schemas/itinerary.schema';

export async function GET(request: Request, { params }: { params: { tripId: string } }) {
  try {
    const supabase = createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ success: false, error: { code: 'UNAUTHORIZED', message: 'Not authenticated' } }, { status: 401 });
    }

    const trip = await prisma.trip.findUnique({
      where: { id: params.tripId },
      include: {
        stops: {
          orderBy: { orderIndex: 'asc' },
          include: {
            tripActivities: {
              orderBy: [
                { dayNumber: 'asc' },
                { orderIndex: 'asc' }
              ]
            }
          }
        }
      }
    });

    if (!trip) {
      return NextResponse.json({ success: false, error: { code: 'NOT_FOUND', message: 'Trip not found' } }, { status: 404 });
    }

    if (trip.ownerId !== user.id) {
      return NextResponse.json({ success: false, error: { code: 'FORBIDDEN', message: 'Access denied' } }, { status: 403 });
    }

    return NextResponse.json({ success: true, data: trip.stops });
  } catch (error) {
    console.error('Fetch stops error:', error);
    return NextResponse.json({ success: false, error: { code: 'INTERNAL_ERROR', message: 'An unexpected error occurred' } }, { status: 500 });
  }
}

export async function POST(request: Request, { params }: { params: { tripId: string } }) {
  try {
    const supabase = createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ success: false, error: { code: 'UNAUTHORIZED', message: 'Not authenticated' } }, { status: 401 });
    }

    const trip = await prisma.trip.findUnique({ where: { id: params.tripId } });

    if (!trip) {
      return NextResponse.json({ success: false, error: { code: 'NOT_FOUND', message: 'Trip not found' } }, { status: 404 });
    }

    if (trip.ownerId !== user.id) {
      return NextResponse.json({ success: false, error: { code: 'FORBIDDEN', message: 'Access denied' } }, { status: 403 });
    }

    const body = await request.json();
    const result = tripStopSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json({ success: false, error: { code: 'VALIDATION_ERROR', message: 'Invalid stop data', details: result.error.flatten() } }, { status: 400 });
    }

    const { data } = result;

    // Determine orderIndex
    let orderIndex = data.orderIndex;
    if (orderIndex === 0) {
      const lastStop = await prisma.tripStop.findFirst({
        where: { tripId: params.tripId },
        orderBy: { orderIndex: 'desc' },
      });
      orderIndex = lastStop ? lastStop.orderIndex + 1 : 0;
    }

    const newStop = await prisma.tripStop.create({
      data: {
        tripId: params.tripId,
        cityName: data.cityName,
        countryName: data.countryName,
        arrivalDate: data.arrivalDate ? new Date(data.arrivalDate) : null,
        departureDate: data.departureDate ? new Date(data.departureDate) : null,
        timezone: data.timezone,
        orderIndex,
        notes: data.notes,
        estimatedTransportCost: data.estimatedTransportCost,
        estimatedTransportTime: data.estimatedTransportTime,
      },
      include: {
        tripActivities: true
      }
    });

    return NextResponse.json({ success: true, data: newStop });
  } catch (error) {
    console.error('Create stop error:', error);
    return NextResponse.json({ success: false, error: { code: 'INTERNAL_ERROR', message: 'An unexpected error occurred' } }, { status: 500 });
  }
}


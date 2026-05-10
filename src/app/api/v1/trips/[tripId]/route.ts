import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { prisma } from '@/lib/prisma/client';
import { tripBaseSchema } from '@/schemas/trip.schema';
import { TripPrivacy, TripType, TripStatus } from '@prisma/client';

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
        _count: {
          select: { stops: true, collaborators: true }
        },
        budgets: true,
        stops: {
          orderBy: { orderIndex: 'asc' }
        }
      }
    });

    if (!trip) {
      return NextResponse.json({ success: false, error: { code: 'NOT_FOUND', message: 'Trip not found' } }, { status: 404 });
    }

    // Only owner or shared logic could go here. For now, strict owner check.
    if (trip.ownerId !== user.id) {
      return NextResponse.json({ success: false, error: { code: 'FORBIDDEN', message: 'Access denied' } }, { status: 403 });
    }

    return NextResponse.json({ success: true, data: trip });
  } catch (error) {
    console.error('Fetch trip error:', error);
    return NextResponse.json({ success: false, error: { code: 'INTERNAL_ERROR', message: 'An unexpected error occurred' } }, { status: 500 });
  }
}

export async function PATCH(request: Request, { params }: { params: { tripId: string } }) {
  try {
    const supabase = createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ success: false, error: { code: 'UNAUTHORIZED', message: 'Not authenticated' } }, { status: 401 });
    }

    // Verify ownership
    const existingTrip = await prisma.trip.findUnique({ where: { id: params.tripId } });
    if (!existingTrip) return NextResponse.json({ success: false, error: { code: 'NOT_FOUND', message: 'Trip not found' } }, { status: 404 });
    if (existingTrip.ownerId !== user.id) return NextResponse.json({ success: false, error: { code: 'FORBIDDEN', message: 'Access denied' } }, { status: 403 });

    const body = await request.json();
    // Use partial schema for updates
    const result = tripBaseSchema.partial().safeParse(body);

    if (!result.success) {
      return NextResponse.json({ success: false, error: { code: 'VALIDATION_ERROR', message: 'Invalid input data', details: result.error.flatten() } }, { status: 400 });
    }

    const { data } = result;

    const updatedTrip = await prisma.trip.update({
      where: { id: params.tripId },
      data: {
        title: data.title,
        description: data.description,
        startDate: data.startDate !== undefined ? (data.startDate ? new Date(data.startDate) : null) : undefined,
        endDate: data.endDate !== undefined ? (data.endDate ? new Date(data.endDate) : null) : undefined,
        travelerCount: data.travelerCount,
        budgetTarget: data.budgetTarget !== undefined ? (data.budgetTarget || null) : undefined,
        currency: data.currency,
        tripType: data.tripType as TripType,
        privacy: data.privacy ? ((data.privacy === 'private' ? 'private_' : data.privacy === 'public' ? 'public_' : data.privacy) as TripPrivacy) : undefined,
        status: data.status as TripStatus,
        transportPreference: data.transportPreference !== undefined ? data.transportPreference : undefined,
        accommodationPreference: data.accommodationPreference !== undefined ? data.accommodationPreference : undefined,
        originCity: data.originCity !== undefined ? data.originCity : undefined,
      },
      include: {
        _count: {
          select: { stops: true, collaborators: true }
        },
        budgets: true,
      }
    });

    return NextResponse.json({ success: true, data: updatedTrip });
  } catch (error) {
    console.error('Update trip error:', error);
    return NextResponse.json({ success: false, error: { code: 'INTERNAL_ERROR', message: 'An unexpected error occurred' } }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: { tripId: string } }) {
  try {
    const supabase = createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ success: false, error: { code: 'UNAUTHORIZED', message: 'Not authenticated' } }, { status: 401 });
    }

    // Verify ownership
    const existingTrip = await prisma.trip.findUnique({ where: { id: params.tripId } });
    if (!existingTrip) return NextResponse.json({ success: false, error: { code: 'NOT_FOUND', message: 'Trip not found' } }, { status: 404 });
    if (existingTrip.ownerId !== user.id) return NextResponse.json({ success: false, error: { code: 'FORBIDDEN', message: 'Access denied' } }, { status: 403 });

    // Delete trip (Prisma schema has onDelete: Cascade for related entities)
    await prisma.trip.delete({
      where: { id: params.tripId }
    });

    return NextResponse.json({ success: true, data: null });
  } catch (error) {
    console.error('Delete trip error:', error);
    return NextResponse.json({ success: false, error: { code: 'INTERNAL_ERROR', message: 'An unexpected error occurred' } }, { status: 500 });
  }
}

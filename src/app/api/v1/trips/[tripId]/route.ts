import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { prisma } from '@/lib/prisma/client';
import { tripBaseSchema } from '@/schemas/trip.schema';
import { TripPrivacy, TripType, TripStatus } from '@prisma/client';
import { requireTripAccess } from '@/lib/rbac';

export async function GET(request: Request, { params }: { params: { tripId: string } }) {
  try {
    const supabase = createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    if (!(await requireTripAccess(params.tripId, user.id, 'viewer'))) {
      return NextResponse.json({ success: false, error: 'Access denied' }, { status: 403 });
    }

    const trip = await prisma.trip.findUnique({
      where: { id: params.tripId },
      include: {
        _count: {
          select: { stops: true, collaborators: true }
        },
        budgets: true,
        packingItems: true,
        notes: true,
        owner: {
          select: {
            id: true,
            email: true,
            profile: {
              select: { firstName: true, lastName: true, avatarUrl: true }
            }
          }
        }
      }
    });

    if (!trip) return NextResponse.json({ success: false, error: 'Trip not found' }, { status: 404 });

    return NextResponse.json({ success: true, data: trip });
  } catch (error) {
    console.error('Fetch trip error:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}

export async function PATCH(request: Request, { params }: { params: { tripId: string } }) {
  try {
    const supabase = createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    if (!(await requireTripAccess(params.tripId, user.id, 'editor'))) {
      return NextResponse.json({ success: false, error: 'Access denied' }, { status: 403 });
    }

    const body = await request.json();
    const result = tripBaseSchema.partial().safeParse(body);

    if (!result.success) {
      return NextResponse.json({ success: false, error: 'Invalid data', details: result.error.flatten() }, { status: 400 });
    }

    const { data } = result;

    const updatedTrip = await prisma.trip.update({
      where: { id: params.tripId },
      data: {
        title: data.title,
        description: data.description,
        startDate: data.startDate ? new Date(data.startDate) : undefined,
        endDate: data.endDate ? new Date(data.endDate) : undefined,
        travelerCount: data.travelerCount,
        budgetTarget: data.budgetTarget,
        currency: data.currency,
        tripType: data.tripType as TripType,
        privacy: (data.privacy === 'private' ? 'private_' : data.privacy === 'public' ? 'public_' : data.privacy) as TripPrivacy,
        status: data.status as TripStatus,
        transportPreference: data.transportPreference,
        accommodationPreference: data.accommodationPreference,
        originCity: data.originCity,
      },
      include: {
        _count: { select: { stops: true, collaborators: true } },
        budgets: true,
      }
    });

    return NextResponse.json({ success: true, data: updatedTrip });
  } catch (error) {
    console.error('Update trip error:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: { tripId: string } }) {
  try {
    const supabase = createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    if (!(await requireTripAccess(params.tripId, user.id, 'owner'))) {
      return NextResponse.json({ success: false, error: 'Access denied' }, { status: 403 });
    }

    await prisma.trip.delete({
      where: { id: params.tripId }
    });

    return NextResponse.json({ success: true, message: 'Trip deleted' });
  } catch (error) {
    console.error('Delete trip error:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}

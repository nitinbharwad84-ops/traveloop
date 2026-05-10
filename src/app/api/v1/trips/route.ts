import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { prisma } from '@/lib/prisma/client';
import { tripSchema } from '@/schemas/trip.schema';
import { TripPrivacy, TripType, TripStatus, Prisma } from '@prisma/client';

export async function GET(request: Request) {
  try {
    const supabase = createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ success: false, error: { code: 'UNAUTHORIZED', message: 'Not authenticated' } }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const filter = searchParams.get('filter'); // 'recent', 'upcoming'
    const status = searchParams.get('status'); // 'active', 'draft', 'archived', 'completed'
    const q = searchParams.get('q');
    const sort = searchParams.get('sort'); // 'date_asc', 'date_desc', 'created_desc'
    const limitParam = searchParams.get('limit');
    const limit = limitParam ? parseInt(limitParam, 10) : undefined;

    const whereClause: Prisma.TripWhereInput = {
      OR: [
        { ownerId: user.id },
        {
          collaborators: {
            some: {
              userId: user.id,
              status: 'accepted'
            }
          }
        }
      ]
    };

    if (filter === 'upcoming') {
      whereClause.startDate = { gte: new Date() };
    }
    if (status && status !== 'all') {
      whereClause.status = status as TripStatus;
    }
    if (q) {
      whereClause.title = { contains: q, mode: 'insensitive' };
    }

    let orderBy: Prisma.TripOrderByWithRelationInput = { updatedAt: 'desc' };
    if (sort === 'date_asc') orderBy = { startDate: 'asc' };
    else if (sort === 'date_desc') orderBy = { startDate: 'desc' };
    else if (sort === 'created_desc') orderBy = { createdAt: 'desc' };
    else if (filter === 'upcoming') orderBy = { startDate: 'asc' };

    const trips = await prisma.trip.findMany({
      where: whereClause,
      orderBy,
      take: limit,
      include: {
        _count: {
          select: { stops: true, collaborators: true }
        },
        budgets: true,
      }
    });

    return NextResponse.json({ success: true, data: trips });
  } catch (error) {
    console.error('Fetch trips error:', error);
    return NextResponse.json({ success: false, error: { code: 'INTERNAL_ERROR', message: 'An unexpected error occurred' } }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const supabase = createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ success: false, error: { code: 'UNAUTHORIZED', message: 'Not authenticated' } }, { status: 401 });
    }

    const body = await request.json();
    const result = tripSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json({ success: false, error: { code: 'VALIDATION_ERROR', message: 'Invalid input data', details: result.error.flatten() } }, { status: 400 });
    }

    const { data } = result;

    const trip = await prisma.trip.create({
      data: {
        ownerId: user.id,
        title: data.title,
        description: data.description,
        startDate: data.startDate ? new Date(data.startDate) : null,
        endDate: data.endDate ? new Date(data.endDate) : null,
        travelerCount: data.travelerCount,
        budgetTarget: data.budgetTarget || null,
        currency: data.currency,
        tripType: data.tripType as TripType,
        privacy: (data.privacy === 'private' ? 'private_' : data.privacy === 'public' ? 'public_' : data.privacy) as TripPrivacy,
        status: data.status as TripStatus,
        transportPreference: data.transportPreference,
        accommodationPreference: data.accommodationPreference,
        originCity: data.originCity,
      },
      include: {
        _count: {
          select: { stops: true, collaborators: true }
        },
        budgets: true,
      }
    });

    return NextResponse.json({ success: true, data: trip });
  } catch (error) {
    console.error('Create trip error:', error);
    return NextResponse.json({ success: false, error: { code: 'INTERNAL_ERROR', message: 'An unexpected error occurred' } }, { status: 500 });
  }
}

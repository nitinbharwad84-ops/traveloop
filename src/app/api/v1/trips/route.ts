import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { prisma } from '@/lib/prisma/client';

export async function GET(request: Request) {
  try {
    const supabase = createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ success: false, error: { code: 'UNAUTHORIZED', message: 'Not authenticated' } }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const filter = searchParams.get('filter'); // 'recent' or 'upcoming'
    const limitParam = searchParams.get('limit');
    const limit = limitParam ? parseInt(limitParam, 10) : undefined;

    const whereClause: { ownerId: string; startDate?: { gte: Date } } = { ownerId: user.id };

    if (filter === 'upcoming') {
      whereClause.startDate = { gte: new Date() };
    }

    const trips = await prisma.trip.findMany({
      where: whereClause,
      orderBy: filter === 'upcoming' ? { startDate: 'asc' } : { updatedAt: 'desc' },
      take: limit,
      include: {
        _count: {
          select: { stops: true, collaborators: true }
        },
        budgets: true, // Included so we can calculate alerts on the frontend
      }
    });

    return NextResponse.json({ success: true, data: trips });
  } catch (error) {
    console.error('Fetch trips error:', error);
    return NextResponse.json({ success: false, error: { code: 'INTERNAL_ERROR', message: 'An unexpected error occurred' } }, { status: 500 });
  }
}

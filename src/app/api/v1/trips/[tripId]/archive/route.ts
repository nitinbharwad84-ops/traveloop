import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { prisma } from '@/lib/prisma/client';

export async function POST(request: Request, { params }: { params: { tripId: string } }) {
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

    const archivedTrip = await prisma.trip.update({
      where: { id: params.tripId },
      data: { status: 'archived' },
      include: {
        _count: {
          select: { stops: true, collaborators: true }
        },
        budgets: true,
      }
    });

    return NextResponse.json({ success: true, data: archivedTrip });
  } catch (error) {
    console.error('Archive trip error:', error);
    return NextResponse.json({ success: false, error: { code: 'INTERNAL_ERROR', message: 'An unexpected error occurred' } }, { status: 500 });
  }
}

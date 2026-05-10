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

    const tripId = params.tripId;

    // Verify ownership and get the full trip with relations
    const existingTrip = await prisma.trip.findUnique({ 
      where: { id: tripId },
      include: {
        stops: {
          include: {
            tripActivities: true
          }
        },
        budgets: true,
        packingItems: true,
      }
    });

    if (!existingTrip) return NextResponse.json({ success: false, error: { code: 'NOT_FOUND', message: 'Trip not found' } }, { status: 404 });
    if (existingTrip.ownerId !== user.id) return NextResponse.json({ success: false, error: { code: 'FORBIDDEN', message: 'Access denied' } }, { status: 403 });

    // Perform deep copy in a transaction
    const duplicatedTrip = await prisma.$transaction(async (tx) => {
      // 1. Create the base trip
      const newTrip = await tx.trip.create({
        data: {
          ownerId: user.id,
          title: `${existingTrip.title} (Copy)`,
          description: existingTrip.description,
          coverImageUrl: existingTrip.coverImageUrl,
          startDate: existingTrip.startDate,
          endDate: existingTrip.endDate,
          travelerCount: existingTrip.travelerCount,
          budgetTarget: existingTrip.budgetTarget,
          currency: existingTrip.currency,
          tripType: existingTrip.tripType,
          privacy: existingTrip.privacy,
          status: 'draft', // Always draft when duplicated
          transportPreference: existingTrip.transportPreference,
          accommodationPreference: existingTrip.accommodationPreference,
          originCity: existingTrip.originCity,
        }
      });

      // 2. Duplicate budgets
      if (existingTrip.budgets.length > 0) {
        await tx.budget.createMany({
          data: existingTrip.budgets.map(b => ({
            tripId: newTrip.id,
            category: b.category,
            estimatedAmount: b.estimatedAmount,
            actualAmount: 0, // Reset actuals
            currency: b.currency,
          }))
        });
      }

      // 3. Duplicate packing items
      if (existingTrip.packingItems.length > 0) {
        await tx.packingItem.createMany({
          data: existingTrip.packingItems.map(p => ({
            tripId: newTrip.id,
            name: p.name,
            category: p.category,
            packed: false, // Reset packed status
            createdBy: user.id,
          }))
        });
      }

      // 4. Duplicate stops and activities
      for (const stop of existingTrip.stops) {
        const newStop = await tx.tripStop.create({
          data: {
            tripId: newTrip.id,
            cityName: stop.cityName,
            countryName: stop.countryName,
            arrivalDate: stop.arrivalDate,
            departureDate: stop.departureDate,
            timezone: stop.timezone,
            orderIndex: stop.orderIndex,
            notes: stop.notes,
            estimatedTransportCost: stop.estimatedTransportCost,
            estimatedTransportTime: stop.estimatedTransportTime,
          }
        });

        if (stop.tripActivities.length > 0) {
          await tx.tripActivity.createMany({
            data: stop.tripActivities.map(a => ({
              tripStopId: newStop.id,
              activityId: a.activityId,
              title: a.title,
              description: a.description,
              dayNumber: a.dayNumber,
              timeSlot: a.timeSlot,
              customNotes: a.customNotes,
              customCost: a.customCost,
              orderIndex: a.orderIndex,
            }))
          });
        }
      }

      // Fetch the newly created full trip to return
      return tx.trip.findUnique({
        where: { id: newTrip.id },
        include: {
          _count: { select: { stops: true, collaborators: true } },
          budgets: true
        }
      });
    });

    return NextResponse.json({ success: true, data: duplicatedTrip });
  } catch (error) {
    console.error('Duplicate trip error:', error);
    return NextResponse.json({ success: false, error: { code: 'INTERNAL_ERROR', message: 'An unexpected error occurred' } }, { status: 500 });
  }
}

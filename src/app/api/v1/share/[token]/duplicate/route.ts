import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma/client';
import { getCurrentUserId } from '@/lib/rbac';

export async function POST(
  request: Request,
  { params }: { params: { token: string } }
) {
  try {
    const { token } = params;
    
    const currentUserId = await getCurrentUserId();
    if (!currentUserId) {
      return NextResponse.json({ success: false, error: 'You must be logged in to duplicate a trip' }, { status: 401 });
    }

    const sharedLink = await prisma.sharedLink.findUnique({
      where: { token },
      include: {
        trip: {
          include: {
            stops: {
              include: { tripActivities: true }
            },
            packingItems: true,
            // Skipping budgets, notes, and collaborators as they are personal
          }
        }
      }
    });

    if (!sharedLink) return NextResponse.json({ success: false, error: 'Link not found' }, { status: 404 });
    if (sharedLink.expiresAt && sharedLink.expiresAt < new Date()) return NextResponse.json({ success: false, error: 'Link expired' }, { status: 410 });

    const sourceTrip = sharedLink.trip;

    // Use a transaction for duplication
    const duplicatedTrip = await prisma.$transaction(async (tx) => {
      // 1. Create the new trip
      const newTrip = await tx.trip.create({
        data: {
          ownerId: currentUserId,
          title: `${sourceTrip.title} (Copy)`,
          description: sourceTrip.description,
          startDate: sourceTrip.startDate,
          endDate: sourceTrip.endDate,
          travelerCount: sourceTrip.travelerCount,
          currency: sourceTrip.currency,
          tripType: sourceTrip.tripType,
          privacy: 'private_', // Always default to private for copies
          status: 'draft',
          transportPreference: sourceTrip.transportPreference,
          accommodationPreference: sourceTrip.accommodationPreference,
          originCity: sourceTrip.originCity,
        }
      });

      // 2. Duplicate Stops & Activities
      for (const stop of sourceTrip.stops) {
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

        // Activities for this stop
        if (stop.tripActivities.length > 0) {
          await tx.tripActivity.createMany({
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            data: stop.tripActivities.map((act: any) => ({
              tripStopId: newStop.id,
              activityId: act.activityId, // link to global activity catalog
              title: act.title,
              description: act.description,
              dayNumber: act.dayNumber,
              timeSlot: act.timeSlot,
              customNotes: act.customNotes,
              customCost: act.customCost,
              orderIndex: act.orderIndex,
            }))
          });
        }
      }

      // 3. Duplicate Packing Items
      if (sourceTrip.packingItems.length > 0) {
        await tx.packingItem.createMany({
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          data: sourceTrip.packingItems.map((item: any) => ({
            tripId: newTrip.id,
            name: item.name,
            category: item.category,
            packed: false, // Reset packed status
            createdBy: currentUserId,
          }))
        });
      }

      return newTrip;
    });

    return NextResponse.json({ success: true, data: duplicatedTrip });
  } catch (error) {
    console.error('Duplicate Trip POST Error:', error);
    return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
  }
}

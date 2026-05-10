import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma/client';
import { PackingCategory } from '@prisma/client';

export async function GET(
  request: Request,
  { params }: { params: { tripId: string } }
) {
  try {
    const { tripId } = params;
    if (!tripId) return NextResponse.json({ success: false, error: 'Trip ID is required' }, { status: 400 });

    const items = await prisma.packingItem.findMany({
      where: { tripId },
      orderBy: [
        { category: 'asc' },
        { createdAt: 'desc' },
      ],
    });

    return NextResponse.json({ success: true, data: items });
  } catch (error) {
    console.error('Packing GET Error:', error);
    return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(
  request: Request,
  { params }: { params: { tripId: string } }
) {
  try {
    const { tripId } = params;
    if (!tripId) return NextResponse.json({ success: false, error: 'Trip ID is required' }, { status: 400 });

    const body = await request.json();
    
    // Check if it's a bulk duplicate operation
    if (body.sourceTripId) {
      const sourceItems = await prisma.packingItem.findMany({
        where: { tripId: body.sourceTripId },
      });

      if (sourceItems.length === 0) {
        return NextResponse.json({ success: true, data: [] }); // Nothing to copy
      }

      const newItemsData = sourceItems.map(item => ({
        tripId,
        name: item.name,
        category: item.category,
        packed: false, // Reset packed status for the new trip
      }));

      await prisma.packingItem.createMany({ data: newItemsData });

      const newItems = await prisma.packingItem.findMany({
        where: { tripId },
        orderBy: [{ category: 'asc' }, { createdAt: 'desc' }],
      });

      return NextResponse.json({ success: true, data: newItems });
    }

    // Standard single item creation
    const { name, category } = body;
    if (!name) {
      return NextResponse.json({ success: false, error: 'Item name is required' }, { status: 400 });
    }

    const newItem = await prisma.packingItem.create({
      data: {
        tripId,
        name,
        category: category as PackingCategory || null,
        packed: false,
      },
    });

    return NextResponse.json({ success: true, data: newItem });
  } catch (error) {
    console.error('Packing POST Error:', error);
    return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
  }
}

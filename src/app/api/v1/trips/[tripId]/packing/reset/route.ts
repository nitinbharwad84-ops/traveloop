import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma/client';

export async function POST(
  request: Request,
  { params }: { params: { tripId: string } }
) {
  try {
    const { tripId } = params;
    if (!tripId) return NextResponse.json({ success: false, error: 'Trip ID is required' }, { status: 400 });

    await prisma.packingItem.updateMany({
      where: { tripId },
      data: { packed: false },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Packing Reset Error:', error);
    return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
  }
}

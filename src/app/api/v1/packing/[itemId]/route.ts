import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma/client';
import { PackingCategory } from '@prisma/client';

export async function PATCH(
  request: Request,
  { params }: { params: { itemId: string } }
) {
  try {
    const { itemId } = params;
    if (!itemId) return NextResponse.json({ success: false, error: 'Item ID is required' }, { status: 400 });

    const body = await request.json();
    const { name, category, packed } = body;

    const updated = await prisma.packingItem.update({
      where: { id: itemId },
      data: {
        ...(name !== undefined && { name }),
        ...(category !== undefined && { category: category as PackingCategory }),
        ...(packed !== undefined && { packed }),
      },
    });

    return NextResponse.json({ success: true, data: updated });
  } catch (error: unknown) {
    console.error('Packing PATCH Error:', error);
    if (typeof error === 'object' && error !== null && 'code' in error && (error as { code: string }).code === 'P2025') {
      return NextResponse.json({ success: false, error: 'Packing item not found' }, { status: 404 });
    }
    return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { itemId: string } }
) {
  try {
    const { itemId } = params;
    if (!itemId) return NextResponse.json({ success: false, error: 'Item ID is required' }, { status: 400 });

    await prisma.packingItem.delete({
      where: { id: itemId },
    });

    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    console.error('Packing DELETE Error:', error);
    if (typeof error === 'object' && error !== null && 'code' in error && (error as { code: string }).code === 'P2025') {
      return NextResponse.json({ success: false, error: 'Packing item not found' }, { status: 404 });
    }
    return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
  }
}

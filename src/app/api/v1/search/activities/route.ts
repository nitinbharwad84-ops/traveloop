import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma/client';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get('q') || '';
  const category = searchParams.get('category') || '';
  const maxPrice = searchParams.get('maxPrice');
  const maxDuration = searchParams.get('maxDuration');
  const sortBy = searchParams.get('sort') || 'name';
  const page = parseInt(searchParams.get('page') || '1');
  const limit = 24;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const where: any = {};
  if (q) {
    where.OR = [
      { name: { contains: q, mode: 'insensitive' } },
      { description: { contains: q, mode: 'insensitive' } },
    ];
  }
  if (category) where.category = category;
  if (maxPrice) where.estimatedCost = { lte: parseFloat(maxPrice) };
  if (maxDuration) where.estimatedDuration = { lte: parseInt(maxDuration) };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const orderBy: any =
    sortBy === 'price' ? { estimatedCost: 'asc' }
    : sortBy === 'rating' ? { rating: 'desc' }
    : sortBy === 'duration' ? { estimatedDuration: 'asc' }
    : { name: 'asc' };

  const [activities, total] = await Promise.all([
    prisma.activity.findMany({ where, skip: (page - 1) * limit, take: limit, orderBy }),
    prisma.activity.count({ where }),
  ]);

  return NextResponse.json({ success: true, data: activities, meta: { total, page, limit, totalPages: Math.ceil(total / limit) } });
}

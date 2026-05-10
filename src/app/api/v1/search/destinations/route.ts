import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma/client';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get('q') || '';
  const region = searchParams.get('region') || '';
  const budget = searchParams.get('budget');
  const page = parseInt(searchParams.get('page') || '1');
  const limit = 24;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const where: any = {};
  if (q) {
    where.OR = [
      { cityName: { contains: q, mode: 'insensitive' } },
      { countryName: { contains: q, mode: 'insensitive' } },
      { tags: { has: q.toLowerCase() } },
    ];
  }
  if (region) where.region = { contains: region, mode: 'insensitive' };
  if (budget) where.estimatedBudgetIndex = parseInt(budget);

  const [destinations, total] = await Promise.all([
    prisma.destination.findMany({
      where,
      skip: (page - 1) * limit,
      take: limit,
      orderBy: [{ trending: 'desc' }, { cityName: 'asc' }],
    }),
    prisma.destination.count({ where }),
  ]);

  return NextResponse.json({ success: true, data: destinations, meta: { total, page, limit, totalPages: Math.ceil(total / limit) } });
}

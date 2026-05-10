import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma/client';
import { BudgetCategory } from '@prisma/client';

const ALL_CATEGORIES = Object.values(BudgetCategory);

export async function GET(
  request: Request,
  { params }: { params: { tripId: string } }
) {
  try {
    const tripId = params.tripId;
    if (!tripId) return NextResponse.json({ success: false, error: 'Trip ID is required' }, { status: 400 });

    const trip = await prisma.trip.findUnique({
      where: { id: tripId },
      select: { id: true, currency: true, ownerId: true },
    });

    if (!trip) return NextResponse.json({ success: false, error: 'Trip not found' }, { status: 404 });

    // TODO: Verify user ownership when Auth is integrated
    // Right now we trust the client

    let budgets = await prisma.budget.findMany({
      where: { tripId },
      orderBy: { category: 'asc' },
    });

    // Auto-initialize categories if missing
    if (budgets.length === 0) {
      const defaultBudgets = ALL_CATEGORIES.map(category => ({
        tripId,
        category,
        estimatedAmount: 0,
        actualAmount: 0,
        currency: trip.currency,
      }));
      
      await prisma.budget.createMany({ data: defaultBudgets });
      
      budgets = await prisma.budget.findMany({
        where: { tripId },
        orderBy: { category: 'asc' },
      });
    } else if (budgets.length < ALL_CATEGORIES.length) {
      // Initialize any newly added categories missing from old trips
      const existingCats = new Set(budgets.map(b => b.category));
      const missingCats = ALL_CATEGORIES.filter(c => !existingCats.has(c));
      if (missingCats.length > 0) {
        await prisma.budget.createMany({
          data: missingCats.map(category => ({
            tripId,
            category,
            estimatedAmount: 0,
            actualAmount: 0,
            currency: trip.currency,
          }))
        });
        budgets = await prisma.budget.findMany({
          where: { tripId },
          orderBy: { category: 'asc' },
        });
      }
    }

    return NextResponse.json({ success: true, data: budgets });
  } catch (error) {
    console.error('Budget GET Error:', error);
    return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
  }
}

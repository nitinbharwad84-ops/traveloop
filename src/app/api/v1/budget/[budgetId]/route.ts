import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma/client';
import { z } from 'zod';

const updateBudgetSchema = z.object({
  estimatedAmount: z.number().min(0).optional(),
  actualAmount: z.number().min(0).optional(),
});

export async function PATCH(
  request: Request,
  { params }: { params: { budgetId: string } }
) {
  try {
    const budgetId = params.budgetId;
    if (!budgetId) return NextResponse.json({ success: false, error: 'Budget ID is required' }, { status: 400 });

    const body = await request.json();
    const result = updateBudgetSchema.safeParse(body);
    
    if (!result.success) {
      return NextResponse.json({ success: false, error: 'Invalid input data', details: result.error.format() }, { status: 400 });
    }

    const { estimatedAmount, actualAmount } = result.data;

    // TODO: Verify ownership via tripId
    
    const updated = await prisma.budget.update({
      where: { id: budgetId },
      data: {
        ...(estimatedAmount !== undefined && { estimatedAmount }),
        ...(actualAmount !== undefined && { actualAmount }),
      },
    });

    return NextResponse.json({ success: true, data: updated });
  } catch (error: any) {
    console.error('Budget PATCH Error:', error);
    if (error.code === 'P2025') {
      return NextResponse.json({ success: false, error: 'Budget item not found' }, { status: 404 });
    }
    return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
  }
}

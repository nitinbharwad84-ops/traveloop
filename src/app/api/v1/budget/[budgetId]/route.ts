import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { z } from 'zod';

const updateBudgetSchema = z.object({
  estimatedAmount: z.number().min(0).optional(),
  actualAmount: z.number().min(0).optional(),
});

export async function PATCH(request: Request, { params }: { params: { budgetId: string } }) {
  try {
    const supabase = createClient();
    const budgetId = params.budgetId;
    if (!budgetId) return NextResponse.json({ success: false, error: 'Budget ID is required' }, { status: 400 });

    const body = await request.json();
    const result = updateBudgetSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json({ success: false, error: 'Invalid input data', details: result.error.format() }, { status: 400 });
    }

    const { estimatedAmount, actualAmount } = result.data;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const updateData: Record<string, any> = {};
    if (estimatedAmount !== undefined) updateData.estimated_amount = estimatedAmount;
    if (actualAmount !== undefined) updateData.actual_amount = actualAmount;

    const { data: updated, error } = await supabase
      .from('budgets')
      .update(updateData)
      .eq('id', budgetId)
      .select()
      .single();

    if (error) {
      if (error.code === 'PGRST116') return NextResponse.json({ success: false, error: 'Budget item not found' }, { status: 404 });
      throw error;
    }

    return NextResponse.json({ success: true, data: updated });
  } catch (error) {
    console.error('Budget PATCH Error:', error);
    return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
  }
}

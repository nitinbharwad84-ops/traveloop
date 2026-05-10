import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import type { BudgetCategory } from '@/types';

const ALL_CATEGORIES: BudgetCategory[] = ['flights', 'accommodation', 'food', 'activities', 'local_transport', 'shopping', 'insurance', 'emergency', 'miscellaneous'];

export async function GET(
  request: Request,
  { params }: { params: { tripId: string } }
) {
  try {
    const supabase = createClient();
    const tripId = params.tripId;
    if (!tripId) return NextResponse.json({ success: false, error: 'Trip ID is required' }, { status: 400 });

    const { data: trip } = await supabase
      .from('trips')
      .select('id, currency, owner_id')
      .eq('id', tripId)
      .single();

    if (!trip) return NextResponse.json({ success: false, error: 'Trip not found' }, { status: 404 });

    let { data: budgets } = await supabase
      .from('budgets')
      .select('*')
      .eq('trip_id', tripId)
      .order('category', { ascending: true });

    budgets = budgets || [];

    // Auto-initialize categories if missing
    if (budgets.length === 0) {
      const defaultBudgets = ALL_CATEGORIES.map(category => ({
        trip_id: tripId,
        category,
        estimated_amount: 0,
        actual_amount: 0,
        currency: trip.currency,
      }));

      await supabase.from('budgets').insert(defaultBudgets);

      const { data: newBudgets } = await supabase
        .from('budgets')
        .select('*')
        .eq('trip_id', tripId)
        .order('category', { ascending: true });

      budgets = newBudgets || [];
    } else if (budgets.length < ALL_CATEGORIES.length) {
      const existingCats = new Set(budgets.map(b => b.category));
      const missingCats = ALL_CATEGORIES.filter(c => !existingCats.has(c));
      if (missingCats.length > 0) {
        await supabase.from('budgets').insert(
          missingCats.map(category => ({
            trip_id: tripId,
            category,
            estimated_amount: 0,
            actual_amount: 0,
            currency: trip.currency,
          }))
        );

        const { data: allBudgets } = await supabase
          .from('budgets')
          .select('*')
          .eq('trip_id', tripId)
          .order('category', { ascending: true });

        budgets = allBudgets || [];
      }
    }

    return NextResponse.json({ success: true, data: budgets });
  } catch (error) {
    console.error('Budget GET Error:', error);
    return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
  }
}

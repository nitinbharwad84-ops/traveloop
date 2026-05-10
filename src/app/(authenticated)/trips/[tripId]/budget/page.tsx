'use client';

import { useTrip } from '@/features/trips/hooks/useTrip';
import { useBudget } from '@/features/budget/hooks/useBudget';
import { useBudgetMutations } from '@/features/budget/hooks/useBudgetMutations';
import { BudgetSummaryCard } from '@/features/budget/components/BudgetSummaryCard';
import { BudgetAlerts } from '@/features/budget/components/BudgetAlerts';
import { BudgetCharts } from '@/features/budget/components/BudgetCharts';
import { CategoryCard } from '@/features/budget/components/CategoryCard';
import { DashboardSkeleton } from '@/features/dashboard/components/DashboardSkeleton';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

export default function BudgetPlannerPage({ params }: { params: { tripId: string } }) {
  const { tripId } = params;
  const { trip, isLoading: isTripLoading } = useTrip(tripId);
  const { budgets, isLoading: isBudgetLoading } = useBudget(tripId);
  const { updateBudget } = useBudgetMutations(tripId);

  if (isTripLoading || isBudgetLoading) {
    return <div className="container max-w-7xl py-8"><DashboardSkeleton /></div>;
  }

  if (!trip) {
    return <div className="container py-20 text-center">Trip not found</div>;
  }

  const currency = trip.currency || 'USD';

  return (
    <div className="container max-w-7xl py-8 animate-in fade-in zoom-in-95 duration-300 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href={`/trips/${trip.id}`}><ArrowLeft className="h-5 w-5" /></Link>
          </Button>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Budget Planner</h1>
            <p className="text-muted-foreground">{trip.title}</p>
          </div>
        </div>
      </div>

      <BudgetSummaryCard 
        budgets={budgets} 
        budgetTarget={trip.budgetTarget as string | null} 
        currency={currency}
        startDate={trip.startDate as string | null}
        endDate={trip.endDate as string | null}
      />

      <BudgetAlerts 
        budgets={budgets}
        budgetTarget={trip.budgetTarget as string | null}
        currency={currency}
      />

      {/* Visualizations */}
      <BudgetCharts budgets={budgets} currency={currency} />

      {/* Categories Grid */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold tracking-tight">Categories</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {budgets.map((budget) => (
            <CategoryCard 
              key={budget.id} 
              budget={budget} 
              onUpdate={(budgetId, data) => updateBudget({ budgetId, data })} 
              currency={currency}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { BudgetData } from '@/services/budget.service';
import { Wallet, Target, TrendingDown, Calendar } from 'lucide-react';
import { differenceInDays, parseISO } from 'date-fns';

interface Props {
  budgets: BudgetData[];
  budgetTarget: string | number | null;
  currency: string;
  startDate: string | null;
  endDate: string | null;
}

export function BudgetSummaryCard({ budgets, budgetTarget, currency, startDate, endDate }: Props) {
  const target = budgetTarget ? Number(budgetTarget) : 0;
  
  const totalEstimated = budgets.reduce((acc, curr) => acc + Number(curr.estimatedAmount), 0);
  const totalActual = budgets.reduce((acc, curr) => acc + Number(curr.actualAmount), 0);
  
  const remaining = target > 0 ? target - totalActual : 0;
  const progressPercent = target > 0 ? Math.min((totalActual / target) * 100, 100) : 0;

  let dailyAvg = 0;
  if (startDate && endDate && totalActual > 0) {
    const days = differenceInDays(parseISO(endDate), parseISO(startDate)) || 1; // At least 1 day
    dailyAvg = totalActual / days;
  }

  const formatCurrency = (val: number) => 
    new Intl.NumberFormat('en-US', { style: 'currency', currency, maximumFractionDigits: 0 }).format(val);

  return (
    <div className="space-y-6">
      {/* Primary Target Progress */}
      {target > 0 && (
        <div className="bg-card p-6 rounded-2xl border shadow-sm space-y-4">
          <div className="flex justify-between items-end">
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-1">Total Trip Budget</p>
              <p className="text-3xl font-bold tracking-tight">{formatCurrency(target)}</p>
            </div>
            <div className="text-right">
              <p className="text-sm font-medium text-muted-foreground mb-1">Remaining</p>
              <p className={`text-xl font-bold ${remaining < 0 ? 'text-destructive' : 'text-primary'}`}>
                {formatCurrency(remaining)}
              </p>
            </div>
          </div>
          <Progress 
            value={progressPercent} 
            className="h-3"
            // Apply red color if over budget, otherwise default primary
            indicatorClassName={totalActual > target ? 'bg-destructive' : 'bg-primary'}
          />
          <div className="flex justify-between text-xs text-muted-foreground font-medium">
            <span>Spent: {formatCurrency(totalActual)} ({progressPercent.toFixed(1)}%)</span>
            {totalActual > target && <span className="text-destructive font-semibold">Over by {formatCurrency(Math.abs(remaining))}</span>}
          </div>
        </div>
      )}

      {/* Grid Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="bg-muted/30 border-none shadow-none">
          <CardContent className="p-5 flex flex-col items-center text-center gap-2">
            <div className="p-3 bg-blue-500/10 text-blue-500 rounded-xl"><Target className="h-5 w-5" /></div>
            <p className="text-xs uppercase tracking-wider text-muted-foreground font-semibold mt-1">Est. Total</p>
            <p className="text-lg font-bold">{formatCurrency(totalEstimated)}</p>
          </CardContent>
        </Card>
        <Card className="bg-muted/30 border-none shadow-none">
          <CardContent className="p-5 flex flex-col items-center text-center gap-2">
            <div className="p-3 bg-purple-500/10 text-purple-500 rounded-xl"><Wallet className="h-5 w-5" /></div>
            <p className="text-xs uppercase tracking-wider text-muted-foreground font-semibold mt-1">Actual Total</p>
            <p className="text-lg font-bold">{formatCurrency(totalActual)}</p>
          </CardContent>
        </Card>
        <Card className="bg-muted/30 border-none shadow-none">
          <CardContent className="p-5 flex flex-col items-center text-center gap-2">
            <div className="p-3 bg-green-500/10 text-green-500 rounded-xl"><TrendingDown className="h-5 w-5" /></div>
            <p className="text-xs uppercase tracking-wider text-muted-foreground font-semibold mt-1">Variance</p>
            <p className={`text-lg font-bold ${totalEstimated - totalActual >= 0 ? 'text-green-600' : 'text-red-500'}`}>
              {totalEstimated - totalActual >= 0 ? '+' : ''}{formatCurrency(totalEstimated - totalActual)}
            </p>
          </CardContent>
        </Card>
        <Card className="bg-muted/30 border-none shadow-none">
          <CardContent className="p-5 flex flex-col items-center text-center gap-2">
            <div className="p-3 bg-amber-500/10 text-amber-500 rounded-xl"><Calendar className="h-5 w-5" /></div>
            <p className="text-xs uppercase tracking-wider text-muted-foreground font-semibold mt-1">Daily Avg</p>
            <p className="text-lg font-bold">{formatCurrency(dailyAvg)}</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { BudgetData } from '@/services/budget.service';
import { AlertCircle, AlertTriangle } from 'lucide-react';

interface Props {
  budgets: BudgetData[];
  budgetTarget: string | number | null;
  currency: string;
}

export function BudgetAlerts({ budgets, budgetTarget, currency }: Props) {
  const target = budgetTarget ? Number(budgetTarget) : 0;
  const totalActual = budgets.reduce((acc, curr) => acc + Number(curr.actualAmount), 0);
  
  const isOverBudget = target > 0 && totalActual > target;
  const isApproachingLimit = target > 0 && !isOverBudget && totalActual > target * 0.8;
  
  const overspentCategories = budgets.filter(
    b => Number(b.estimatedAmount) > 0 && Number(b.actualAmount) > Number(b.estimatedAmount)
  );

  const formatCurrency = (val: number) => 
    new Intl.NumberFormat('en-US', { style: 'currency', currency, maximumFractionDigits: 0 }).format(val);

  if (!isOverBudget && !isApproachingLimit && overspentCategories.length === 0) {
    return null;
  }

  return (
    <div className="space-y-4">
      {isOverBudget && (
        <Alert variant="destructive" className="bg-destructive/10 text-destructive border-destructive/20">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Budget Exceeded</AlertTitle>
          <AlertDescription>
            You are {formatCurrency(totalActual - target)} over your total trip budget!
          </AlertDescription>
        </Alert>
      )}

      {isApproachingLimit && (
        <Alert className="bg-amber-500/10 text-amber-600 border-amber-500/20">
          <AlertTriangle className="h-4 w-4 text-amber-600" />
          <AlertTitle>Approaching Budget Limit</AlertTitle>
          <AlertDescription>
            You have spent {((totalActual / target) * 100).toFixed(1)}% of your total budget.
          </AlertDescription>
        </Alert>
      )}

      {overspentCategories.length > 0 && !isOverBudget && (
        <Alert className="bg-yellow-500/10 text-yellow-700 border-yellow-500/20">
          <AlertTriangle className="h-4 w-4 text-yellow-700" />
          <AlertTitle>Category Overspend</AlertTitle>
          <AlertDescription>
            You have exceeded estimates in: {overspentCategories.map(c => c.category).join(', ')}
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
}

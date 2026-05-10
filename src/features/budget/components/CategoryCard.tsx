import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { BudgetData } from '@/services/budget.service';
import { useDebounce } from '@/hooks/useDebounce';
import { useEffect } from 'react';
import { Plane, Home, Utensils, Map, Bus, ShoppingBag, ShieldAlert, HeartPulse, MoreHorizontal } from 'lucide-react';

interface Props {
  budget: BudgetData;
  onUpdate: (budgetId: string, data: { estimatedAmount?: number; actualAmount?: number }) => void;
  currency: string;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const CATEGORY_ICONS: Record<string, any> = {
  flights: Plane,
  accommodation: Home,
  food: Utensils,
  activities: Map,
  local_transport: Bus,
  shopping: ShoppingBag,
  insurance: ShieldAlert,
  emergency: HeartPulse,
  miscellaneous: MoreHorizontal,
};

const CATEGORY_COLORS: Record<string, string> = {
  flights: 'bg-blue-500/10 text-blue-500',
  accommodation: 'bg-purple-500/10 text-purple-500',
  food: 'bg-orange-500/10 text-orange-500',
  activities: 'bg-green-500/10 text-green-500',
  local_transport: 'bg-yellow-500/10 text-yellow-600',
  shopping: 'bg-pink-500/10 text-pink-500',
  insurance: 'bg-slate-500/10 text-slate-500',
  emergency: 'bg-red-500/10 text-red-500',
  miscellaneous: 'bg-zinc-500/10 text-zinc-500',
};

export function CategoryCard({ budget, onUpdate, currency }: Props) {
  const [estimated, setEstimated] = useState(String(budget.estimatedAmount));
  const [actual, setActual] = useState(String(budget.actualAmount));

  // Sync state if external data changes (e.g., initial load)
  useEffect(() => {
    setEstimated(String(budget.estimatedAmount));
    setActual(String(budget.actualAmount));
  }, [budget.estimatedAmount, budget.actualAmount]);

  const debouncedEstimated = useDebounce(estimated, 500);
  const debouncedActual = useDebounce(actual, 500);

  // Trigger update when debounced values change and are valid numbers
  useEffect(() => {
    const estNum = Number(debouncedEstimated);
    const actNum = Number(debouncedActual);
    
    let needsUpdate = false;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const updateData: any = {};

    if (!isNaN(estNum) && estNum !== Number(budget.estimatedAmount)) {
      updateData.estimatedAmount = estNum;
      needsUpdate = true;
    }
    
    if (!isNaN(actNum) && actNum !== Number(budget.actualAmount)) {
      updateData.actualAmount = actNum;
      needsUpdate = true;
    }

    if (needsUpdate) {
      onUpdate(budget.id, updateData);
    }
  }, [debouncedEstimated, debouncedActual, budget.id, budget.estimatedAmount, budget.actualAmount, onUpdate]);

  const Icon = CATEGORY_ICONS[budget.category] || MoreHorizontal;
  const colorClass = CATEGORY_COLORS[budget.category] || 'bg-muted text-foreground';

  const isOverspent = Number(actual) > Number(estimated) && Number(estimated) > 0;

  return (
    <Card className={`overflow-hidden transition-all duration-200 ${isOverspent ? 'border-amber-500/50 shadow-sm' : ''}`}>
      <CardContent className="p-5">
        <div className="flex items-center gap-3 mb-5">
          <div className={`p-2.5 rounded-xl ${colorClass}`}>
            <Icon className="h-5 w-5" />
          </div>
          <h3 className="font-semibold capitalize text-lg tracking-tight">
            {budget.category.replace('_', ' ')}
          </h3>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Estimated ({currency})</Label>
            <div className="relative">
              <Input 
                type="number" 
                min="0"
                step="0.01"
                className="pl-8 font-medium" 
                value={estimated}
                onChange={(e) => setEstimated(e.target.value)}
              />
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground font-medium">$</span>
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Actual Spent ({currency})</Label>
            <div className="relative">
              <Input 
                type="number" 
                min="0"
                step="0.01"
                className={`pl-8 font-medium ${isOverspent ? 'border-amber-500/50 focus-visible:ring-amber-500' : ''}`}
                value={actual}
                onChange={(e) => setActual(e.target.value)}
              />
              <span className={`absolute left-3 top-1/2 -translate-y-1/2 font-medium ${isOverspent ? 'text-amber-500' : 'text-muted-foreground'}`}>$</span>
            </div>
            {isOverspent && (
              <p className="text-xs text-amber-600 font-medium mt-1.5 flex items-center gap-1">
                Over by {(Number(actual) - Number(estimated)).toFixed(2)}
              </p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

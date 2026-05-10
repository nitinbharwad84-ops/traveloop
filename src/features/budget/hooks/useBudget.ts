import { useQuery } from '@tanstack/react-query';
import { budgetService } from '@/services/budget.service';

export function useBudget(tripId: string) {
  const { data, isLoading, error } = useQuery({
    queryKey: ['trips', tripId, 'budget'],
    queryFn: () => budgetService.getBudgets(tripId),
    enabled: !!tripId,
  });

  return {
    budgets: data?.data || [],
    isLoading,
    error,
  };
}

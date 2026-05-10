import { useMutation, useQueryClient } from '@tanstack/react-query';
import { budgetService, BudgetData } from '@/services/budget.service';

export function useBudgetMutations(tripId: string) {
  const queryClient = useQueryClient();

  const updateMutation = useMutation({
    mutationFn: ({ budgetId, data }: { budgetId: string, data: { estimatedAmount?: number; actualAmount?: number } }) => 
      budgetService.updateBudget(budgetId, data),
    onMutate: async ({ budgetId, data }) => {
      // Cancel any outgoing refetches so they don't overwrite optimistic update
      await queryClient.cancelQueries({ queryKey: ['trips', tripId, 'budget'] });

      // Snapshot previous value
      const previous = queryClient.getQueryData<{ success: boolean; data: BudgetData[] }>(['trips', tripId, 'budget']);

      // Optimistically update
      if (previous?.data) {
        queryClient.setQueryData<{ success: boolean; data: BudgetData[] }>(
          ['trips', tripId, 'budget'],
          {
            success: true,
            data: previous.data.map(b => {
              if (b.id === budgetId) {
                return {
                  ...b,
                  estimatedAmount: data.estimatedAmount !== undefined ? data.estimatedAmount : b.estimatedAmount,
                  actualAmount: data.actualAmount !== undefined ? data.actualAmount : b.actualAmount,
                };
              }
              return b;
            })
          }
        );
      }

      // Return context with previous data for rollback
      return { previous };
    },
    onError: (err, variables, context) => {
      if (context?.previous) {
        queryClient.setQueryData(['trips', tripId, 'budget'], context.previous);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['trips', tripId, 'budget'] });
    },
  });

  return {
    updateBudget: updateMutation.mutate,
    updateBudgetAsync: updateMutation.mutateAsync,
  };
}

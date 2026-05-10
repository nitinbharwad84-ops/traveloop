import { useMutation, useQueryClient } from '@tanstack/react-query';
import { packingService, PackingItemData } from '@/services/packing.service';

export function usePackingMutations(tripId: string) {
  const queryClient = useQueryClient();
  const queryKey = ['trips', tripId, 'packing'];

  const updateMutation = useMutation({
    mutationFn: ({ itemId, data }: { itemId: string, data: Partial<PackingItemData> }) => 
      packingService.updateItem(itemId, data),
    onMutate: async ({ itemId, data }) => {
      await queryClient.cancelQueries({ queryKey });
      const previous = queryClient.getQueryData<{ success: boolean; data: PackingItemData[] }>(queryKey);

      if (previous?.data) {
        queryClient.setQueryData(queryKey, {
          success: true,
          data: previous.data.map(item => 
            item.id === itemId ? { ...item, ...data } : item
          )
        });
      }
      return { previous };
    },
    onError: (err, variables, context) => {
      if (context?.previous) {
        queryClient.setQueryData(queryKey, context.previous);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey });
    },
  });

  const addMutation = useMutation({
    mutationFn: (data: { name: string; category: string }) => packingService.addItem(tripId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (itemId: string) => packingService.deleteItem(itemId),
    onMutate: async (itemId) => {
      await queryClient.cancelQueries({ queryKey });
      const previous = queryClient.getQueryData<{ success: boolean; data: PackingItemData[] }>(queryKey);

      if (previous?.data) {
        queryClient.setQueryData(queryKey, {
          success: true,
          data: previous.data.filter(item => item.id !== itemId)
        });
      }
      return { previous };
    },
    onError: (err, variables, context) => {
      if (context?.previous) {
        queryClient.setQueryData(queryKey, context.previous);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey });
    },
  });

  const resetMutation = useMutation({
    mutationFn: () => packingService.resetChecklist(tripId),
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey });
      const previous = queryClient.getQueryData<{ success: boolean; data: PackingItemData[] }>(queryKey);

      if (previous?.data) {
        queryClient.setQueryData(queryKey, {
          success: true,
          data: previous.data.map(item => ({ ...item, packed: false }))
        });
      }
      return { previous };
    },
    onError: (err, variables, context) => {
      if (context?.previous) {
        queryClient.setQueryData(queryKey, context.previous);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey });
    },
  });

  const duplicateMutation = useMutation({
    mutationFn: (sourceTripId: string) => packingService.duplicateChecklist(tripId, sourceTripId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey });
    },
  });

  return {
    updateItem: updateMutation.mutate,
    addItem: addMutation.mutateAsync,
    isAdding: addMutation.isPending,
    deleteItem: deleteMutation.mutate,
    resetChecklist: resetMutation.mutate,
    duplicateChecklist: duplicateMutation.mutateAsync,
    isDuplicating: duplicateMutation.isPending,
  };
}

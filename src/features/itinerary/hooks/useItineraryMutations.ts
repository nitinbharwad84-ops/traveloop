import { useMutation, useQueryClient } from '@tanstack/react-query';
import { itineraryService, TripStopData } from '@/services/itinerary.service';
import { TripStopInput, TripStopUpdateInput, TripActivityInput, TripActivityUpdateInput, ReorderInput } from '@/schemas/itinerary.schema';
import { useToast } from '@/hooks/use-toast';

export function useItineraryMutations(tripId: string) {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const addStopMutation = useMutation({
    mutationFn: (data: TripStopInput) => itineraryService.addStop(tripId, data),
    onSuccess: (res) => {
      if (res.success) {
        queryClient.invalidateQueries({ queryKey: ['itinerary', tripId] });
        toast({ title: 'Stop added' });
      } else {
        toast({ title: 'Failed to add stop', description: res.error?.message, variant: 'destructive' });
      }
    }
  });

  const updateStopMutation = useMutation({
    mutationFn: ({ stopId, data }: { stopId: string; data: TripStopUpdateInput }) => itineraryService.updateStop(stopId, data),
    onSuccess: (res) => {
      if (res.success) {
        queryClient.invalidateQueries({ queryKey: ['itinerary', tripId] });
        toast({ title: 'Stop updated' });
      }
    }
  });

  const deleteStopMutation = useMutation({
    mutationFn: (stopId: string) => itineraryService.deleteStop(stopId),
    onSuccess: (res) => {
      if (res.success) {
        queryClient.invalidateQueries({ queryKey: ['itinerary', tripId] });
        toast({ title: 'Stop removed' });
      }
    }
  });

  const reorderStopsMutation = useMutation({
    mutationFn: (data: ReorderInput) => itineraryService.reorderStops(tripId, data),
    onMutate: async (data) => {
      await queryClient.cancelQueries({ queryKey: ['itinerary', tripId] });
      const previousStops = queryClient.getQueryData<{ success: boolean; data: TripStopData[] }>(['itinerary', tripId]);

      // Optimistically update
      if (previousStops?.data) {
        const sortedStops = [...previousStops.data].sort((a, b) => {
          const orderA = data.items.find(i => i.id === a.id)?.orderIndex ?? a.orderIndex;
          const orderB = data.items.find(i => i.id === b.id)?.orderIndex ?? b.orderIndex;
          return orderA - orderB;
        });
        
        queryClient.setQueryData(['itinerary', tripId], {
          ...previousStops,
          data: sortedStops
        });
      }

      return { previousStops };
    },
    onError: (err, newTodo, context) => {
      if (context?.previousStops) {
        queryClient.setQueryData(['itinerary', tripId], context.previousStops);
      }
      toast({ title: 'Reorder failed', variant: 'destructive' });
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['itinerary', tripId] });
    }
  });

  const addActivityMutation = useMutation({
    mutationFn: ({ stopId, data }: { stopId: string; data: TripActivityInput }) => itineraryService.addActivity(stopId, data),
    onSuccess: (res) => {
      if (res.success) {
        queryClient.invalidateQueries({ queryKey: ['itinerary', tripId] });
        toast({ title: 'Activity added' });
      }
    }
  });

  const updateActivityMutation = useMutation({
    mutationFn: ({ activityId, data }: { activityId: string; data: TripActivityUpdateInput }) => itineraryService.updateActivity(activityId, data),
    onSuccess: (res) => {
      if (res.success) {
        queryClient.invalidateQueries({ queryKey: ['itinerary', tripId] });
        toast({ title: 'Activity updated' });
      }
    }
  });

  const deleteActivityMutation = useMutation({
    mutationFn: (activityId: string) => itineraryService.deleteActivity(activityId),
    onSuccess: (res) => {
      if (res.success) {
        queryClient.invalidateQueries({ queryKey: ['itinerary', tripId] });
        toast({ title: 'Activity removed' });
      }
    }
  });

  return {
    addStop: addStopMutation.mutateAsync,
    isAddingStop: addStopMutation.isPending,
    
    updateStop: updateStopMutation.mutateAsync,
    isUpdatingStop: updateStopMutation.isPending,
    
    deleteStop: deleteStopMutation.mutateAsync,
    isDeletingStop: deleteStopMutation.isPending,

    reorderStops: reorderStopsMutation.mutateAsync,
    
    addActivity: addActivityMutation.mutateAsync,
    isAddingActivity: addActivityMutation.isPending,

    updateActivity: updateActivityMutation.mutateAsync,
    isUpdatingActivity: updateActivityMutation.isPending,

    deleteActivity: deleteActivityMutation.mutateAsync,
    isDeletingActivity: deleteActivityMutation.isPending,
  };
}

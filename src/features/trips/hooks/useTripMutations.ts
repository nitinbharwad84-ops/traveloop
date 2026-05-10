import { useMutation, useQueryClient } from '@tanstack/react-query';
import { tripService } from '@/services/trip.service';
import { TripInput } from '@/schemas/trip.schema';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';

export function useTripMutations() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const router = useRouter();

  const createMutation = useMutation({
    mutationFn: (data: TripInput) => tripService.createTrip(data),
    onSuccess: (res) => {
      if (res.success) {
        queryClient.invalidateQueries({ queryKey: ['trips'] });
        toast({ title: 'Trip created', description: 'Your new adventure has been started.' });
      } else {
        toast({ title: 'Failed to create trip', description: res.error?.message, variant: 'destructive' });
      }
    }
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<TripInput> }) => tripService.updateTrip(id, data),
    onMutate: async ({ id, data }) => {
      await queryClient.cancelQueries({ queryKey: ['trip', id] });
      const previousTrip = queryClient.getQueryData(['trip', id]);

      queryClient.setQueryData(['trip', id], (old: { data?: unknown } | undefined) => {
        if (!old?.data) return old;
        return {
          ...old,
          data: { ...old.data, ...data }
        };
      });

      return { previousTrip };
    },
    onError: (err, variables, context) => {
      if (context?.previousTrip) {
        queryClient.setQueryData(['trip', variables.id], context.previousTrip);
      }
      toast({ title: 'Update failed', description: 'Could not save changes.', variant: 'destructive' });
    },
    onSettled: (data, error, variables) => {
      queryClient.invalidateQueries({ queryKey: ['trip', variables.id] });
      queryClient.invalidateQueries({ queryKey: ['trips'] });
    }
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => tripService.deleteTrip(id),
    onSuccess: (res) => {
      if (res.success) {
        queryClient.invalidateQueries({ queryKey: ['trips'] });
        router.push('/trips');
        toast({ title: 'Trip deleted' });
      }
    }
  });

  const duplicateMutation = useMutation({
    mutationFn: (id: string) => tripService.duplicateTrip(id),
    onSuccess: (res) => {
      if (res.success) {
        queryClient.invalidateQueries({ queryKey: ['trips'] });
        toast({ title: 'Trip duplicated', description: 'You can now edit your copied trip.' });
        router.push(`/trips/${res.data?.id}`);
      }
    }
  });

  const archiveMutation = useMutation({
    mutationFn: (id: string) => tripService.archiveTrip(id),
    onSuccess: (res) => {
      if (res.success) {
        queryClient.invalidateQueries({ queryKey: ['trips'] });
        queryClient.invalidateQueries({ queryKey: ['trip', res.data?.id] });
        toast({ title: 'Trip archived' });
      }
    }
  });

  const uploadCoverMutation = useMutation({
    mutationFn: ({ id, file }: { id: string; file: File }) => tripService.uploadCover(id, file),
    onSuccess: (res) => {
      if (res.success) {
        queryClient.invalidateQueries({ queryKey: ['trip', res.data?.id] });
        queryClient.invalidateQueries({ queryKey: ['trips'] });
        toast({ title: 'Cover updated' });
      } else {
        toast({ title: 'Upload failed', description: res.error?.message, variant: 'destructive' });
      }
    }
  });

  return {
    createTrip: createMutation.mutateAsync,
    isCreating: createMutation.isPending,
    
    updateTrip: updateMutation.mutateAsync,
    isUpdating: updateMutation.isPending,
    
    deleteTrip: deleteMutation.mutateAsync,
    isDeleting: deleteMutation.isPending,
    
    duplicateTrip: duplicateMutation.mutateAsync,
    isDuplicating: duplicateMutation.isPending,

    archiveTrip: archiveMutation.mutateAsync,
    isArchiving: archiveMutation.isPending,

    uploadCover: uploadCoverMutation.mutateAsync,
    isUploadingCover: uploadCoverMutation.isPending,
  };
}

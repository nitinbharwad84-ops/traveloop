import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { shareService, SharedLinkData } from '@/services/share.service';

export function useShareLinks(tripId: string) {
  const queryClient = useQueryClient();
  const queryKey = ['trips', tripId, 'shareLinks'];

  const { data, isLoading, error } = useQuery({
    queryKey,
    queryFn: () => shareService.getShareLinks(tripId),
    enabled: !!tripId,
  });

  const createMutation = useMutation({
    mutationFn: (data: { visibility: string; expiresAt: string | null }) => 
      shareService.createShareLink(tripId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey });
    },
  });

  const revokeMutation = useMutation({
    mutationFn: (linkId: string) => shareService.revokeShareLink(linkId),
    onMutate: async (linkId) => {
      await queryClient.cancelQueries({ queryKey });
      const previous = queryClient.getQueryData<{ success: boolean; data: SharedLinkData[] }>(queryKey);

      if (previous?.data) {
        queryClient.setQueryData(queryKey, {
          success: true,
          data: previous.data.filter(link => link.id !== linkId)
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

  return {
    shareLinks: data?.data || [],
    isLoading,
    error,
    createShareLink: createMutation.mutateAsync,
    isCreating: createMutation.isPending,
    revokeShareLink: revokeMutation.mutate,
    isRevoking: revokeMutation.isPending,
  };
}

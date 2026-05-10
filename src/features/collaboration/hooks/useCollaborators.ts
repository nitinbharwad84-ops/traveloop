import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { collaborationService, CollaboratorData } from '@/services/collaboration.service';

export function useCollaborators(tripId: string) {
  const queryClient = useQueryClient();
  const queryKey = ['trips', tripId, 'collaborators'];

  const { data, isLoading, error } = useQuery({
    queryKey,
    queryFn: () => collaborationService.getCollaborators(tripId),
    enabled: !!tripId,
  });

  const inviteMutation = useMutation({
    mutationFn: ({ email, role }: { email: string; role: string }) => 
      collaborationService.inviteCollaborator(tripId, email, role),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ collabId, data }: { collabId: string; data: { role?: string; status?: string } }) => 
      collaborationService.updateCollaborator(collabId, data),
    onMutate: async ({ collabId, data }) => {
      await queryClient.cancelQueries({ queryKey });
      const previous = queryClient.getQueryData<{ success: boolean; data: CollaboratorData[] }>(queryKey);

      if (previous?.data) {
        queryClient.setQueryData(queryKey, {
          success: true,
          data: previous.data.map(collab => 
            collab.id === collabId ? { ...collab, ...data } : collab
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

  const removeMutation = useMutation({
    mutationFn: (collabId: string) => collaborationService.removeCollaborator(collabId),
    onMutate: async (collabId) => {
      await queryClient.cancelQueries({ queryKey });
      const previous = queryClient.getQueryData<{ success: boolean; data: CollaboratorData[] }>(queryKey);

      if (previous?.data) {
        queryClient.setQueryData(queryKey, {
          success: true,
          data: previous.data.filter(collab => collab.id !== collabId)
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
    collaborators: data?.data || [],
    isLoading,
    error,
    inviteCollaborator: inviteMutation.mutateAsync,
    isInviting: inviteMutation.isPending,
    updateCollaborator: updateMutation.mutate,
    removeCollaborator: removeMutation.mutate,
  };
}

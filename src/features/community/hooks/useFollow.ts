import { useMutation, useQueryClient } from '@tanstack/react-query';
import { communityService } from '@/services/community.service';
import { toast } from 'sonner';

export const profileKeys = {
  profile: (userId: string) => ['community', 'profile', userId] as const,
};

export function useFollow(targetUserId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => communityService.toggleFollow(targetUserId),
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: profileKeys.profile(targetUserId) });
      const previous = queryClient.getQueryData<{ isFollowing: boolean; _count: { followers: number } }>(
        profileKeys.profile(targetUserId)
      );

      if (previous) {
        queryClient.setQueryData(profileKeys.profile(targetUserId), {
          ...previous,
          isFollowing: !previous.isFollowing,
          _count: {
            ...previous._count,
            followers: previous.isFollowing
              ? previous._count.followers - 1
              : previous._count.followers + 1,
          },
        });
      }

      return { previous };
    },
    onError: (_err, _vars, context) => {
      if (context?.previous) {
        queryClient.setQueryData(profileKeys.profile(targetUserId), context.previous);
      }
      toast.error('Failed to update follow status');
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: profileKeys.profile(targetUserId) });
    },
  });
}

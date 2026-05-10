import { useMutation, useQueryClient, InfiniteData } from '@tanstack/react-query';
import { communityService } from '@/services/community.service';
import { feedKeys } from './useFeed';
import { toast } from 'sonner';

interface FeedPage {
  posts: FeedPost[];
  nextCursor: string | null;
}

interface FeedPost {
  id: string;
  isLiked: boolean;
  _count: { likes: number; comments: number };
  [key: string]: unknown;
}

export function useLike(sort: string = 'recent') {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (postId: string) => communityService.toggleLike(postId),
    onMutate: async (postId) => {
      await queryClient.cancelQueries({ queryKey: feedKeys.feed(sort) });
      const previous = queryClient.getQueryData<InfiniteData<FeedPage>>(feedKeys.feed(sort));

      if (previous) {
        queryClient.setQueryData<InfiniteData<FeedPage>>(feedKeys.feed(sort), {
          ...previous,
          pages: previous.pages.map((page) => ({
            ...page,
            posts: page.posts.map((post) =>
              post.id === postId
                ? {
                    ...post,
                    isLiked: !post.isLiked,
                    _count: {
                      ...post._count,
                      likes: post.isLiked ? post._count.likes - 1 : post._count.likes + 1,
                    },
                  }
                : post
            ),
          })),
        });
      }

      return { previous };
    },
    onError: (_err, _id, context) => {
      if (context?.previous) {
        queryClient.setQueryData(feedKeys.feed(sort), context.previous);
      }
      toast.error('Failed to update like');
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: feedKeys.feed(sort) });
    },
  });
}

import { useInfiniteQuery } from '@tanstack/react-query';
import { communityService } from '@/services/community.service';

export const feedKeys = {
  feed: (sort: string) => ['community', 'feed', sort] as const,
};

export function useFeed(sort: string = 'recent') {
  return useInfiniteQuery({
    queryKey: feedKeys.feed(sort),
    queryFn: ({ pageParam }) =>
      communityService.getFeed({ cursor: pageParam as string | undefined, limit: 10, sort }),
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined,
  });
}

'use client';

import { useRef, useEffect, useState, useCallback } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useFeed } from '@/features/community/hooks/useFeed';
import { FeedSort } from '@/features/community/components/FeedSort';
import { PostCard } from '@/features/community/components/PostCard';
import { communityService } from '@/services/community.service';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, Globe, Plus, Plane } from 'lucide-react';
import { toast } from 'sonner';

export default function CommunityFeedPage() {
  const [sort, setSort] = useState('recent');
  const [showPublishDialog, setShowPublishDialog] = useState(false);
  const [selectedTripId, setSelectedTripId] = useState('');
  const [postContent, setPostContent] = useState('');
  const sentinelRef = useRef<HTMLDivElement>(null);
  const queryClient = useQueryClient();

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading, isError } = useFeed(sort);

  // Fetch user's trips for the publish dialog
  const myTripsQuery = useQuery({
    queryKey: ['my-trips'],
    queryFn: async () => {
      const res = await fetch('/api/v1/trips');
      const data = await res.json();
      return data.data ?? [];
    },
    enabled: showPublishDialog,
  });

  const publishMutation = useMutation({
    mutationFn: () => communityService.publishPost(selectedTripId, postContent),
    onSuccess: () => {
      toast.success('Trip published to community!');
      setShowPublishDialog(false);
      setSelectedTripId('');
      setPostContent('');
      queryClient.invalidateQueries({ queryKey: ['community', 'feed', sort] });
    },
    onError: (e: Error) => toast.error(e.message || 'Failed to publish'),
  });

  // Infinite scroll via IntersectionObserver
  const handleObserver = useCallback((entries: IntersectionObserverEntry[]) => {
    const [entry] = entries;
    if (entry?.isIntersecting && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;
    const observer = new IntersectionObserver(handleObserver, { threshold: 0.1 });
    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [handleObserver]);

  const allPosts = data?.pages.flatMap((page) => page.posts) ?? [];

  return (
    <div className="container max-w-2xl py-8 space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <Globe className="h-7 w-7 text-primary" /> Community
          </h1>
          <p className="text-muted-foreground text-sm mt-1">Discover trips shared by the Traveloop community</p>
        </div>
        <Button onClick={() => setShowPublishDialog(true)} size="sm">
          <Plus className="h-4 w-4 mr-1.5" /> Share Trip
        </Button>
      </div>

      <FeedSort value={sort} onChange={setSort} />

      {/* Feed */}
      {isLoading ? (
        <div className="flex flex-col items-center py-20 text-muted-foreground gap-3">
          <Loader2 className="h-8 w-8 animate-spin" />
          <p>Loading community feed...</p>
        </div>
      ) : isError ? (
        <div className="text-center py-16 text-muted-foreground">
          <p>Failed to load feed. Please try again.</p>
        </div>
      ) : allPosts.length === 0 ? (
        <div className="text-center py-20 space-y-3">
          <Plane className="h-12 w-12 mx-auto text-muted-foreground opacity-20" />
          <p className="font-medium text-lg">No posts yet</p>
          <p className="text-muted-foreground text-sm">Be the first to share your itinerary with the community!</p>
        </div>
      ) : (
        <div className="space-y-5">
          {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
          {allPosts.map((post: any) => (
            <PostCard key={post.id} post={post} sort={sort} />
          ))}
        </div>
      )}

      {/* Sentinel for infinite scroll */}
      <div ref={sentinelRef} className="flex justify-center py-4">
        {isFetchingNextPage && <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />}
        {!hasNextPage && allPosts.length > 0 && (
          <p className="text-xs text-muted-foreground">You&apos;ve seen all posts!</p>
        )}
      </div>

      {/* Publish Dialog */}
      <Dialog open={showPublishDialog} onOpenChange={setShowPublishDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Share a Trip</DialogTitle>
            <DialogDescription>Publish one of your trips to the community feed.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <label className="text-sm font-medium">Select a Trip</label>
              {myTripsQuery.isLoading ? (
                <div className="flex justify-center py-4"><Loader2 className="h-5 w-5 animate-spin" /></div>
              ) : (
                <div className="grid gap-2 max-h-52 overflow-y-auto">
                  {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                  {(myTripsQuery.data ?? []).map((trip: any) => (
                    <button
                      key={trip.id}
                      onClick={() => setSelectedTripId(trip.id)}
                      className={`text-left px-4 py-3 rounded-xl border text-sm transition-all ${
                        selectedTripId === trip.id
                          ? 'border-primary bg-primary/5 font-medium'
                          : 'border-border hover:bg-muted/40'
                      }`}
                    >
                      {trip.title}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Caption (optional)</label>
              <Textarea
                value={postContent}
                onChange={(e) => setPostContent(e.target.value)}
                placeholder="Share what made this trip special..."
                className="resize-none bg-muted/30 h-24"
              />
            </div>

            <Button
              onClick={() => publishMutation.mutate()}
              disabled={!selectedTripId || publishMutation.isPending}
              className="w-full"
            >
              {publishMutation.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : (
                <Globe className="h-4 w-4 mr-2" />
              )}
              Publish to Community
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

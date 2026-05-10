'use client';

import { useFeed } from '@/features/community/hooks/useFeed';
import { PostCard } from '@/features/community/components/PostCard';
import { Loader2, LayoutGrid, Sparkles } from 'lucide-react';

export default function CommunityTemplatesPage() {
  const { data, isLoading, isError } = useFeed('popular');

  const allPosts = data?.pages.flatMap((page) => page.posts) ?? [];

  return (
    <div className="container max-w-6xl py-8 space-y-8 animate-in fade-in duration-300">
      <div className="text-center space-y-3">
        <div className="inline-flex items-center justify-center h-14 w-14 rounded-2xl bg-primary/10 mb-2">
          <LayoutGrid className="h-7 w-7 text-primary" />
        </div>
        <h1 className="text-4xl font-bold tracking-tight">Trip Templates</h1>
        <p className="text-muted-foreground text-lg max-w-lg mx-auto">
          Browse popular community itineraries and use them as a starting point for your next trip.
        </p>
        <div className="inline-flex items-center gap-1.5 text-xs text-primary bg-primary/10 px-3 py-1 rounded-full">
          <Sparkles className="h-3.5 w-3.5" /> Sorted by community popularity
        </div>
      </div>

      {isLoading ? (
        <div className="flex flex-col items-center py-20 text-muted-foreground gap-3">
          <Loader2 className="h-8 w-8 animate-spin" />
          <p>Loading templates...</p>
        </div>
      ) : isError ? (
        <div className="text-center py-16 text-muted-foreground">
          <p>Failed to load templates. Please try again.</p>
        </div>
      ) : allPosts.length === 0 ? (
        <div className="text-center py-20 text-muted-foreground">
          <p>No templates available yet. Be the first to share a trip!</p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
          {allPosts.map((post: any) => (
            <PostCard key={post.id} post={post} sort="popular" showCopyButton />
          ))}
        </div>
      )}
    </div>
  );
}

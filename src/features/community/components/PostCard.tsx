'use client';

import { useState } from 'react';
import Link from 'next/link';
import { formatDistanceToNow } from 'date-fns';
import { Heart, MessageCircle, Share2, MapPin, Copy, ChevronDown, ChevronUp, Send, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { communityService } from '@/services/community.service';
import { useLike } from '../hooks/useLike';

const TRIP_TYPE_COLORS: Record<string, string> = {
  adventure: 'bg-orange-500/10 text-orange-600',
  cultural: 'bg-purple-500/10 text-purple-600',
  relaxation: 'bg-green-500/10 text-green-600',
  business: 'bg-blue-500/10 text-blue-600',
  family: 'bg-pink-500/10 text-pink-600',
};

interface PostCardProps {
  post: {
    id: string;
    content: string | null;
    createdAt: string;
    isLiked: boolean;
    _count: { likes: number; comments: number };
    user: {
      id: string;
      email: string;
      profile: { firstName: string; lastName: string } | null;
    };
    trip: {
      id: string;
      title: string;
      description: string | null;
      coverImage: string | null;
      tripType: string | null;
      stops: { cityName: string; countryName: string }[];
    };
  };
  sort?: string;
  showCopyButton?: boolean;
}

export function PostCard({ post, sort = 'recent', showCopyButton = false }: PostCardProps) {
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState('');
  const queryClient = useQueryClient();

  const likeMutation = useLike(sort);

  const authorName = post.user.profile
    ? `${post.user.profile.firstName} ${post.user.profile.lastName}`.trim()
    : post.user.email.split('@')[0];

  const destinations = post.trip.stops
    .slice(0, 3)
    .map((s) => `${s.cityName}`)
    .join(' → ');

  const commentsQuery = useQuery({
    queryKey: ['community', 'comments', post.id],
    queryFn: () => communityService.getComments(post.id),
    enabled: showComments,
  });

  const addCommentMutation = useMutation({
    mutationFn: (content: string) => communityService.addComment(post.id, content),
    onSuccess: () => {
      setCommentText('');
      queryClient.invalidateQueries({ queryKey: ['community', 'comments', post.id] });
    },
    onError: () => toast.error('Failed to add comment'),
  });

  const copyMutation = useMutation({
    mutationFn: () => communityService.copyTrip(post.trip.id),
    onSuccess: () => toast.success('Trip copied to your dashboard!'),
    onError: (e: Error) => toast.error(e.message || 'Failed to copy trip'),
  });

  const handleShare = async () => {
    await navigator.clipboard.writeText(`${window.location.origin}/community/feed`);
    toast.success('Link copied to clipboard!');
  };

  return (
    <div className="bg-card border border-border/60 rounded-2xl shadow-sm overflow-hidden hover:shadow-md transition-shadow">
      {/* Cover Image */}
      {post.trip.coverImage && (
        <div className="relative h-48 overflow-hidden bg-muted">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={post.trip.coverImage} alt={post.trip.title} className="w-full h-full object-cover" />
          {post.trip.tripType && (
            <span className={`absolute top-3 left-3 px-2 py-0.5 rounded-full text-xs font-semibold capitalize backdrop-blur-sm ${TRIP_TYPE_COLORS[post.trip.tripType] || 'bg-muted text-muted-foreground'}`}>
              {post.trip.tripType}
            </span>
          )}
        </div>
      )}

      {/* Post Body */}
      <div className="p-5 space-y-4">
        {/* Author Row */}
        <div className="flex items-center justify-between gap-3">
          <Link href={`/community/users/${post.user.id}`} className="flex items-center gap-2.5 hover:opacity-80 transition-opacity">
            <div className="h-9 w-9 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-sm shrink-0">
              {authorName?.[0]?.toUpperCase()}
            </div>
            <div>
              <p className="font-semibold text-sm leading-none">{authorName}</p>
              <p className="text-[11px] text-muted-foreground mt-0.5">
                {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}
              </p>
            </div>
          </Link>
          {showCopyButton && (
            <Button size="sm" variant="secondary" onClick={() => copyMutation.mutate()} disabled={copyMutation.isPending}>
              {copyMutation.isPending ? <Loader2 className="h-3.5 w-3.5 animate-spin mr-1.5" /> : <Copy className="h-3.5 w-3.5 mr-1.5" />}
              Use Template
            </Button>
          )}
        </div>

        {/* Trip Info */}
        <div>
          <h3 className="font-bold text-lg leading-tight">{post.trip.title}</h3>
          {destinations && (
            <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
              <MapPin className="h-3.5 w-3.5 shrink-0" />
              {destinations}
              {post.trip.stops.length > 3 && ` +${post.trip.stops.length - 3} more`}
            </p>
          )}
          {post.content && (
            <p className="text-sm text-muted-foreground mt-2 line-clamp-2">{post.content}</p>
          )}
        </div>

        {/* Action Bar */}
        <div className="flex items-center gap-1 pt-1 border-t border-border/50">
          <Button
            variant="ghost"
            size="sm"
            className={`gap-1.5 ${post.isLiked ? 'text-red-500 hover:text-red-600' : 'text-muted-foreground'}`}
            onClick={() => likeMutation.mutate(post.id)}
            disabled={likeMutation.isPending}
          >
            <Heart className={`h-4 w-4 ${post.isLiked ? 'fill-current' : ''}`} />
            <span className="text-xs font-medium">{post._count.likes}</span>
          </Button>

          <Button
            variant="ghost"
            size="sm"
            className="gap-1.5 text-muted-foreground"
            onClick={() => setShowComments(!showComments)}
          >
            <MessageCircle className="h-4 w-4" />
            <span className="text-xs font-medium">{post._count.comments}</span>
            {showComments ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
          </Button>

          <Button variant="ghost" size="sm" className="gap-1.5 text-muted-foreground ml-auto" onClick={handleShare}>
            <Share2 className="h-4 w-4" />
          </Button>
        </div>

        {/* Comments Section */}
        {showComments && (
          <div className="space-y-3 pt-2 border-t border-border/50">
            {commentsQuery.isLoading ? (
              <div className="flex justify-center py-3"><Loader2 className="h-4 w-4 animate-spin text-muted-foreground" /></div>
            ) : commentsQuery.data?.length > 0 ? (
              <div className="space-y-2.5 max-h-48 overflow-y-auto">
                {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                {commentsQuery.data.map((c: any) => (
                  <div key={c.id} className="flex gap-2.5">
                    <div className="h-7 w-7 rounded-full bg-muted text-muted-foreground flex items-center justify-center text-xs font-bold shrink-0">
                      {(c.user.profile?.firstName?.[0] || c.user.email[0]).toUpperCase()}
                    </div>
                    <div className="bg-muted/40 rounded-xl px-3 py-2 flex-1">
                      <p className="text-xs font-semibold text-foreground">
                        {c.user.profile ? `${c.user.profile.firstName} ${c.user.profile.lastName}`.trim() : c.user.email.split('@')[0]}
                      </p>
                      <p className="text-sm text-muted-foreground">{c.content}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-center text-muted-foreground py-2">No comments yet. Be the first!</p>
            )}

            {/* Add Comment */}
            <form
              className="flex gap-2"
              onSubmit={(e) => {
                e.preventDefault();
                if (commentText.trim()) addCommentMutation.mutate(commentText);
              }}
            >
              <Input
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder="Add a comment..."
                className="h-8 text-sm bg-muted/30"
              />
              <Button type="submit" size="sm" className="h-8 w-8 p-0 shrink-0" disabled={addCommentMutation.isPending || !commentText.trim()}>
                {addCommentMutation.isPending ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Send className="h-3.5 w-3.5" />}
              </Button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}

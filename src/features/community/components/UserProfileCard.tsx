'use client';

import { Users, Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useFollow } from '../hooks/useFollow';

interface UserProfileCardProps {
  user: {
    id: string;
    email: string;
    profile: { firstName: string; lastName: string; bio?: string | null } | null;
    isFollowing: boolean;
    _count: { communityPosts: number; followers: number; following: number };
  };
}

export function UserProfileCard({ user }: UserProfileCardProps) {
  const followMutation = useFollow(user.id);

  const displayName = user.profile
    ? `${user.profile.firstName} ${user.profile.lastName}`.trim()
    : user.email.split('@')[0];

  return (
    <div className="bg-card border rounded-2xl p-6 space-y-4">
      {/* Avatar & Name */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="h-16 w-16 rounded-full bg-primary/10 text-primary flex items-center justify-center text-2xl font-bold shrink-0">
            {displayName?.[0]?.toUpperCase()}
          </div>
          <div>
            <h2 className="text-xl font-bold">{displayName}</h2>
            <p className="text-sm text-muted-foreground flex items-center gap-1">
              <Globe className="h-3 w-3" />
              Traveloop Traveler
            </p>
          </div>
        </div>

        <Button
          variant={user.isFollowing ? 'outline' : 'default'}
          size="sm"
          onClick={() => followMutation.mutate()}
          disabled={followMutation.isPending}
          className="shrink-0"
        >
          {user.isFollowing ? 'Following' : 'Follow'}
        </Button>
      </div>

      {/* Bio */}
      {user.profile?.bio && (
        <p className="text-sm text-muted-foreground">{user.profile.bio}</p>
      )}

      {/* Stats */}
      <div className="flex gap-6 pt-2 border-t border-border/50">
        <div className="text-center">
          <p className="text-lg font-bold">{user._count.communityPosts}</p>
          <p className="text-xs text-muted-foreground">Posts</p>
        </div>
        <div className="text-center">
          <p className="text-lg font-bold">{user._count.followers}</p>
          <p className="text-xs text-muted-foreground flex items-center gap-1">
            <Users className="h-3 w-3" /> Followers
          </p>
        </div>
        <div className="text-center">
          <p className="text-lg font-bold">{user._count.following}</p>
          <p className="text-xs text-muted-foreground">Following</p>
        </div>
      </div>
    </div>
  );
}

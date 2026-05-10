'use client';

import { useQuery } from '@tanstack/react-query';
import { useParams } from 'next/navigation';
import { communityService } from '@/services/community.service';
import { UserProfileCard } from '@/features/community/components/UserProfileCard';
import { PostCard } from '@/features/community/components/PostCard';
import { profileKeys } from '@/features/community/hooks/useFollow';
import { Loader2 } from 'lucide-react';

export default function UserProfilePage() {
  const { userId } = useParams<{ userId: string }>();

  const profileQuery = useQuery({
    queryKey: profileKeys.profile(userId),
    queryFn: () => communityService.getUserProfile(userId),
    enabled: !!userId,
  });

  if (profileQuery.isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-muted-foreground gap-3">
        <Loader2 className="h-8 w-8 animate-spin" />
        <p>Loading profile...</p>
      </div>
    );
  }

  if (profileQuery.isError || !profileQuery.data) {
    return (
      <div className="text-center py-20 text-muted-foreground">
        <p>Could not load this profile. The user may not exist.</p>
      </div>
    );
  }

  const user = profileQuery.data;

  return (
    <div className="container max-w-4xl py-8 space-y-8 animate-in fade-in duration-300">
      <UserProfileCard user={user} />

      <div>
        <h2 className="text-xl font-bold mb-5">Published Trips</h2>
        {user.communityPosts.length === 0 ? (
          <div className="text-center py-16 text-muted-foreground">
            <p>This traveler hasn&apos;t published any trips yet.</p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 gap-5">
            {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
            {user.communityPosts.map((post: any) => (
              <PostCard key={post.id} post={{ ...post, user }} sort="recent" />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

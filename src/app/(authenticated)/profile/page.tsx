'use client';

import Link from 'next/link';
import { useProfile } from '@/features/profile/hooks/useProfile';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, MapPin, Edit3, Map, Plane, Flag } from 'lucide-react';

export default function ProfilePage() {
  const { profile, isLoading } = useProfile();

  if (isLoading) {
    return (
      <div className="flex h-full min-h-[50vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="flex h-full min-h-[50vh] items-center justify-center flex-col gap-4">
        <p className="text-muted-foreground">Could not load profile.</p>
        <Button onClick={() => window.location.reload()}>Retry</Button>
      </div>
    );
  }

  const initials = `${profile.firstName.charAt(0)}${profile.lastName.charAt(0)}`;
  const fullName = `${profile.firstName} ${profile.lastName}`;

  return (
    <div className="container max-w-4xl py-8 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Profile</h1>
        <Button asChild variant="outline">
          <Link href="/profile/edit">
            <Edit3 className="mr-2 h-4 w-4" />
            Edit Profile
          </Link>
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-[1fr_300px]">
        {/* Main Info */}
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-6 items-start md:items-center">
              <Avatar className="h-24 w-24 border-4 border-background shadow-sm">
                <AvatarImage src={profile.avatarUrl || ''} alt={fullName} />
                <AvatarFallback className="text-2xl bg-primary/10 text-primary">
                  {initials}
                </AvatarFallback>
              </Avatar>
              <div className="space-y-2 flex-1">
                <h2 className="text-2xl font-semibold">{fullName}</h2>
                <div className="flex flex-wrap gap-y-2 gap-x-4 text-sm text-muted-foreground">
                  {profile.city || profile.country ? (
                    <div className="flex items-center">
                      <MapPin className="mr-1 h-4 w-4" />
                      {profile.city ? `${profile.city}, ` : ''}{profile.country || ''}
                    </div>
                  ) : null}
                  {profile.language && (
                    <div className="flex items-center">
                      <Flag className="mr-1 h-4 w-4" />
                      Speaks {profile.language.toUpperCase()}
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="mt-8">
              <h3 className="font-medium mb-3">Travel Style</h3>
              <div className="flex flex-wrap gap-2">
                {profile.travelPreferences.length > 0 ? (
                  profile.travelPreferences.map((pref) => (
                    <Badge key={pref} variant="secondary" className="capitalize">
                      {pref.replace('_', ' ')}
                    </Badge>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground italic">No travel preferences added yet.</p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stats Sidebar */}
        <div className="space-y-6">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Travel Stats</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between border-b pb-3 mb-3">
                <div className="flex items-center text-muted-foreground">
                  <Map className="mr-2 h-4 w-4" />
                  Trips Planned
                </div>
                <span className="font-semibold">{profile.user._count.trips}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center text-muted-foreground">
                  <Plane className="mr-2 h-4 w-4" />
                  Status
                </div>
                <Badge variant="outline" className="text-primary border-primary/20 bg-primary/5">Active Explorer</Badge>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

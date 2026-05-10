'use client';

import { useTrip } from '@/features/trips/hooks/useTrip';
import { useShareLinks } from '@/features/share/hooks/useShareLinks';
import { DashboardSkeleton } from '@/features/dashboard/components/DashboardSkeleton';
import { CreateShareLinkForm } from '@/features/share/components/CreateShareLinkForm';
import { ShareLinkList } from '@/features/share/components/ShareLinkList';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

export default function ShareManagementPage({ params }: { params: { tripId: string } }) {
  const { tripId } = params;
  const { trip, isLoading: isTripLoading } = useTrip(tripId);
  const { 
    shareLinks, 
    isLoading: isLinksLoading, 
    createShareLink, 
    isCreating,
    revokeShareLink
  } = useShareLinks(tripId);

  if (isTripLoading || isLinksLoading) {
    return <div className="container max-w-3xl py-8"><DashboardSkeleton /></div>;
  }

  if (!trip) {
    return <div className="container py-20 text-center">Trip not found</div>;
  }

  return (
    <div className="container max-w-3xl py-8 animate-in fade-in zoom-in-95 duration-300 space-y-8">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href={`/trips/${trip.id}`}><ArrowLeft className="h-5 w-5" /></Link>
        </Button>
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Share Trip</h1>
          <p className="text-muted-foreground">{trip.title}</p>
        </div>
      </div>

      <div className="space-y-8">
        <CreateShareLinkForm onCreate={async (data) => { await createShareLink(data); }} isCreating={isCreating} />

        <div>
          <h2 className="text-xl font-bold tracking-tight mb-4">Active Links</h2>
          <ShareLinkList 
            links={shareLinks} 
            onRevoke={revokeShareLink}
          />
        </div>
      </div>
    </div>
  );
}

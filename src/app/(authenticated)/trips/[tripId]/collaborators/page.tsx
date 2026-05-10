'use client';

import { useState, useEffect } from 'react';
import { useTrip } from '@/features/trips/hooks/useTrip';
import { useCollaborators } from '@/features/collaboration/hooks/useCollaborators';
import { DashboardSkeleton } from '@/features/dashboard/components/DashboardSkeleton';
import { InviteForm } from '@/features/collaboration/components/InviteForm';
import { CollaboratorList } from '@/features/collaboration/components/CollaboratorList';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

export default function CollaboratorsPage({ params }: { params: { tripId: string } }) {
  const { tripId } = params;
  const { trip, isLoading: isTripLoading } = useTrip(tripId);
  const { 
    collaborators, 
    isLoading: isCollabLoading, 
    inviteCollaborator, 
    isInviting,
    updateCollaborator,
    removeCollaborator
  } = useCollaborators(tripId);

  // We need to fetch the current user to know which actions they can perform
  // For the sake of the mock RBAC, we'll fetch the actual Supabase user if available,
  // or rely on the backend RBAC to deny if there's a mismatch. 
  // In a real app, this comes from a central AuthProvider.
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      const supabase = createClient();
      const { data } = await supabase.auth.getUser();
      // If we don't have a supabase user, we are relying on the backend mock logic
      // But we should try to match the ownerId or the dummy ID for UI display.
      setCurrentUserId(data.user?.id || 'dummymockid'); 
    };
    fetchUser();
  }, []);

  if (isTripLoading || isCollabLoading) {
    return <div className="container max-w-4xl py-8"><DashboardSkeleton /></div>;
  }

  if (!trip) {
    return <div className="container py-20 text-center">Trip not found</div>;
  }

  // To display the invite form and action menus accurately in the UI, 
  // we check if the current user is the owner.
  // Note: We use the actual ownerId from the trip object to be accurate.
  const isOwner = trip.ownerId === currentUserId || currentUserId === 'dummymockid'; 
  const isEditor = collaborators.some(c => c.userId === currentUserId && c.role === 'editor' && c.status === 'accepted');
  const canInvite = isOwner || isEditor;

  return (
    <div className="container max-w-4xl py-8 animate-in fade-in zoom-in-95 duration-300 space-y-8">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href={`/trips/${trip.id}`}><ArrowLeft className="h-5 w-5" /></Link>
        </Button>
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Collaborators</h1>
          <p className="text-muted-foreground">{trip.title}</p>
        </div>
      </div>

      <div className="space-y-6">
        {canInvite && (
          <InviteForm onInvite={async (email, role) => { await inviteCollaborator({ email, role }); }} isInviting={isInviting} />
        )}

        <div>
          <h2 className="text-xl font-bold tracking-tight mb-4">Team Members</h2>
          <CollaboratorList 
            collaborators={collaborators} 
            currentUserId={currentUserId}
            onUpdateRole={(collabId, role) => updateCollaborator({ collabId, data: { role } })}
            onRemove={removeCollaborator}
            isOwner={isOwner}
          />
        </div>
      </div>
    </div>
  );
}

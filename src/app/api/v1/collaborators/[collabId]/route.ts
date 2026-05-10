import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { requireTripAccess } from '@/lib/rbac';
import type { CollaboratorRole, CollaboratorStatus } from '@/types';

export async function PATCH(request: Request, { params }: { params: { collabId: string } }) {
  try {
    const supabase = createClient();
    const { collabId } = params;
    const body = await request.json();
    const { role, status } = body;

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });

    const { data: collaborator } = await supabase.from('collaborators').select('*').eq('id', collabId).single();
    if (!collaborator) return NextResponse.json({ success: false, error: 'Not found' }, { status: 404 });

    // A user can accept their own invite
    if (status && status === 'accepted' && collaborator.user_id === user.id) {
      const { data: updated } = await supabase.from('collaborators').update({ status, joined_at: new Date().toISOString() }).eq('id', collabId).select().single();
      return NextResponse.json({ success: true, data: updated });
    }

    // Only owner can change roles
    if (role) {
      const isOwner = await requireTripAccess(collaborator.trip_id, user.id, 'owner');
      if (!isOwner) return NextResponse.json({ success: false, error: 'Only owners can change roles' }, { status: 403 });
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const updateData: Record<string, any> = {};
    if (role) updateData.role = role as CollaboratorRole;
    if (status) updateData.status = status as CollaboratorStatus;

    const { data: updated } = await supabase.from('collaborators').update(updateData).eq('id', collabId).select().single();
    return NextResponse.json({ success: true, data: updated });
  } catch (error) {
    console.error('Collaborator PATCH Error:', error);
    return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: { collabId: string } }) {
  try {
    const supabase = createClient();
    const { collabId } = params;
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });

    const { data: collaborator } = await supabase.from('collaborators').select('*').eq('id', collabId).single();
    if (!collaborator) return NextResponse.json({ success: false, error: 'Not found' }, { status: 404 });

    if (collaborator.user_id !== user.id) {
      const isOwner = await requireTripAccess(collaborator.trip_id, user.id, 'owner');
      if (!isOwner) return NextResponse.json({ success: false, error: 'Only owners can remove collaborators' }, { status: 403 });
    }

    await supabase.from('collaborators').delete().eq('id', collabId);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Collaborator DELETE Error:', error);
    return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
  }
}

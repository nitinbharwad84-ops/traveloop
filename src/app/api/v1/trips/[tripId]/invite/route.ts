import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { sendEmail } from '@/lib/mail';
import { requireTripAccess } from '@/lib/rbac';
import type { CollaboratorRole } from '@/types';
import { createNotification } from '@/lib/notifications';

export async function POST(request: Request, { params }: { params: { tripId: string } }) {
  try {
    const supabase = createClient();
    const { tripId } = params;
    const body = await request.json();
    const { email, role } = body;

    if (!email || !role) {
      return NextResponse.json({ success: false, error: 'Email and role are required' }, { status: 400 });
    }

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const hasAccess = await requireTripAccess(tripId, user.id, 'editor');
    if (!hasAccess) {
      return NextResponse.json({ success: false, error: 'Insufficient permissions' }, { status: 403 });
    }

    const { data: trip } = await supabase
      .from('trips')
      .select('*, users!trips_owner_id_fkey(*)')
      .eq('id', tripId)
      .single();

    if (!trip) return NextResponse.json({ success: false, error: 'Trip not found' }, { status: 404 });

    // Find or create the invited user
    let { data: targetUser } = await supabase.from('users').select('*').eq('email', email).single();
    if (!targetUser) {
      const { data: newUser } = await supabase.from('users').insert({ email }).select().single();
      if (newUser) {
        await supabase.from('profiles').insert({ user_id: newUser.id, first_name: email.split('@')[0], last_name: '' });
        targetUser = newUser;
      }
    }
    if (!targetUser) return NextResponse.json({ success: false, error: 'Failed to find/create user' }, { status: 500 });

    // Check if already a collaborator
    const { data: existing } = await supabase
      .from('collaborators')
      .select('id')
      .eq('trip_id', tripId)
      .eq('user_id', targetUser.id)
      .single();

    if (existing) {
      return NextResponse.json({ success: false, error: 'User is already a collaborator' }, { status: 400 });
    }

    const { data: collaborator, error } = await supabase
      .from('collaborators')
      .insert({
        trip_id: tripId,
        user_id: targetUser.id,
        role: role as CollaboratorRole,
        status: 'pending',
        invited_by: user.id,
      })
      .select('*, users!collaborators_user_id_fkey(*)')
      .single();

    if (error) throw error;

    await createNotification({
      userId: targetUser.id,
      type: 'collab_invite',
      payload: { tripId: trip.id, tripTitle: trip.title, inviterId: user.id, role },
    });

    const acceptUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/trips/${tripId}`;
    try {
      await sendEmail({
        to: email,
        subject: `You've been invited to ${trip.title}`,
        html: `<div style="font-family: sans-serif; padding: 20px;"><h2>You're invited to plan a trip!</h2><p>You have been invited to collaborate on <strong>${trip.title}</strong> as an ${role}.</p><a href="${acceptUrl}" style="display: inline-block; background-color: #3b82f6; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; margin-top: 15px;">View Trip</a></div>`
      });
    } catch (emailError) {
      console.error('Failed to send email:', emailError);
    }

    return NextResponse.json({ success: true, data: collaborator });
  } catch (error) {
    console.error('Invite POST Error:', error);
    return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
  }
}

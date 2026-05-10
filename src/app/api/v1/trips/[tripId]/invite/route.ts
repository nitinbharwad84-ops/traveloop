import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma/client';
import { Resend } from 'resend';
import { getCurrentUserId, requireTripAccess } from '@/lib/rbac';
import { CollaboratorRole } from '@prisma/client';
import { createNotification } from '@/lib/notifications';

const resend = new Resend(process.env.RESEND_API_KEY || 're_dummy_key');

export async function POST(
  request: Request,
  { params }: { params: { tripId: string } }
) {
  try {
    const { tripId } = params;
    const body = await request.json();
    const { email, role } = body;

    if (!email || !role) {
      return NextResponse.json({ success: false, error: 'Email and role are required' }, { status: 400 });
    }

    const currentUserId = await getCurrentUserId();
    if (!currentUserId) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    // RBAC: Only owner or editor can invite
    const hasAccess = await requireTripAccess(tripId, currentUserId, 'editor');
    if (!hasAccess) {
      return NextResponse.json({ success: false, error: 'Insufficient permissions' }, { status: 403 });
    }

    const trip = await prisma.trip.findUnique({
      where: { id: tripId },
      include: { owner: true }
    });

    if (!trip) return NextResponse.json({ success: false, error: 'Trip not found' }, { status: 404 });

    // 1. Find or create the invited user (since we don't have full auth, we simulate it)
    let targetUser = await prisma.user.findUnique({ where: { email } });
    if (!targetUser) {
      // Mock creation for the sake of the invite flow
      targetUser = await prisma.user.create({
        data: {
          email,
          profile: {
            create: {
              firstName: email.split('@')[0],
              lastName: '',
            }
          }
        }
      });
    }

    // 2. Check if already a collaborator
    const existing = await prisma.collaborator.findUnique({
      where: { tripId_userId: { tripId, userId: targetUser.id } }
    });

    if (existing) {
      return NextResponse.json({ success: false, error: 'User is already a collaborator' }, { status: 400 });
    }

    const collaborator = await prisma.collaborator.create({
      data: {
        tripId,
        userId: targetUser.id,
        role: role as CollaboratorRole,
        status: 'pending',
        invitedBy: currentUserId,
      },
      include: { user: true }
    });

    // 4. Create in-app notification
    await createNotification({
      userId: targetUser.id,
      type: 'collab_invite',
      payload: {
        tripId: trip.id,
        tripTitle: trip.title,
        inviterId: currentUserId,
        role,
      }
    });

    // 4. Send Email via Resend
    const acceptUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/trips/${tripId}`;
    
    try {
      if (process.env.RESEND_API_KEY) {
        await resend.emails.send({
          from: 'Traveloop <invites@traveloop.app>', // Note: requires verified domain in Resend
          to: email,
          subject: `You've been invited to ${trip.title}`,
          html: `
            <div style="font-family: sans-serif; padding: 20px;">
              <h2>You're invited to plan a trip!</h2>
              <p>You have been invited to collaborate on <strong>${trip.title}</strong> as an ${role}.</p>
              <a href="${acceptUrl}" style="display: inline-block; background-color: #3b82f6; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; margin-top: 15px;">
                View Trip
              </a>
            </div>
          `
        });
      } else {
        console.log(`[Mock Email] Invite sent to ${email} for trip ${tripId}. Link: ${acceptUrl}`);
      }
    } catch (emailError) {
      console.error('Failed to send email:', emailError);
      // We don't fail the request if the email fails, just log it.
    }

    return NextResponse.json({ success: true, data: collaborator });
  } catch (error) {
    console.error('Invite POST Error:', error);
    return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
  }
}

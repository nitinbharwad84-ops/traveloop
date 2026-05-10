import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { prisma } from '@/lib/prisma/client';
import { profileSchema } from '@/schemas/profile.schema';

export async function GET() {
  try {
    const supabase = createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ success: false, error: { code: 'UNAUTHORIZED', message: 'Not authenticated' } }, { status: 401 });
    }

    const profile = await prisma.profile.findUnique({
      where: { userId: user.id },
      include: {
        user: {
          include: {
            _count: {
              select: { trips: true }
            }
          }
        }
      }
    });

    if (!profile) {
      return NextResponse.json({ success: false, error: { code: 'NOT_FOUND', message: 'Profile not found' } }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: profile });
  } catch (error) {
    console.error('Fetch profile error:', error);
    return NextResponse.json({ success: false, error: { code: 'INTERNAL_ERROR', message: 'An unexpected error occurred' } }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const supabase = createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ success: false, error: { code: 'UNAUTHORIZED', message: 'Not authenticated' } }, { status: 401 });
    }

    const body = await request.json();
    const result = profileSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json({ success: false, error: { code: 'VALIDATION_ERROR', message: 'Invalid input data', details: result.error.flatten() } }, { status: 400 });
    }

    const updatedProfile = await prisma.profile.update({
      where: { userId: user.id },
      data: {
        firstName: result.data.firstName,
        lastName: result.data.lastName,
        phone: result.data.phone,
        city: result.data.city,
        country: result.data.country,
        language: result.data.language,
        travelPreferences: result.data.travelPreferences,
        notificationPreferences: result.data.notificationPreferences,
      },
      include: {
        user: {
          include: {
            _count: {
              select: { trips: true }
            }
          }
        }
      }
    });

    return NextResponse.json({ success: true, data: updatedProfile });
  } catch (error) {
    console.error('Update profile error:', error);
    return NextResponse.json({ success: false, error: { code: 'INTERNAL_ERROR', message: 'An unexpected error occurred' } }, { status: 500 });
  }
}

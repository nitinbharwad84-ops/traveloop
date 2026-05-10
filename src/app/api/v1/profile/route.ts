import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { profileSchema } from '@/schemas/profile.schema';

export async function GET() {
  try {
    const supabase = createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ success: false, error: { code: 'UNAUTHORIZED', message: 'Not authenticated' } }, { status: 401 });
    }

    const { data: profile, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('user_id', user.id)
      .single();

    if (error || !profile) {
      return NextResponse.json({ success: false, error: { code: 'NOT_FOUND', message: 'Profile not found' } }, { status: 404 });
    }

    const { count: tripCount } = await supabase.from('trips').select('id', { count: 'exact', head: true }).eq('owner_id', user.id);

    const profileData = {
      ...profile,
      user: { email: user.email, _count: { trips: tripCount ?? 0 } },
    };

    return NextResponse.json({ success: true, data: profileData });
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

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const updateData: Record<string, any> = {};
    if (result.data.firstName !== undefined) updateData.first_name = result.data.firstName;
    if (result.data.lastName !== undefined) updateData.last_name = result.data.lastName;
    if (result.data.phone !== undefined) updateData.phone = result.data.phone;
    if (result.data.city !== undefined) updateData.city = result.data.city;
    if (result.data.country !== undefined) updateData.country = result.data.country;
    if (result.data.language !== undefined) updateData.language = result.data.language;
    if (result.data.travelPreferences !== undefined) updateData.travel_preferences = result.data.travelPreferences;
    if (result.data.notificationPreferences !== undefined) updateData.notification_preferences = result.data.notificationPreferences;

    const { data: updatedProfile, error } = await supabase
      .from('profiles')
      .update(updateData)
      .eq('user_id', user.id)
      .select('*')
      .single();

    if (error) {
      console.error('Update profile DB error:', error);
      return NextResponse.json({ success: false, error: { code: 'INTERNAL_ERROR', message: 'Failed to update profile' } }, { status: 500 });
    }

    const { count: tripCount } = await supabase.from('trips').select('id', { count: 'exact', head: true }).eq('owner_id', user.id);

    const profileData = {
      ...updatedProfile,
      user: { email: user.email, _count: { trips: tripCount ?? 0 } },
    };

    return NextResponse.json({ success: true, data: profileData });
  } catch (error) {
    console.error('Update profile error:', error);
    return NextResponse.json({ success: false, error: { code: 'INTERNAL_ERROR', message: 'An unexpected error occurred' } }, { status: 500 });
  }
}

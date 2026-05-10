import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function POST(request: Request) {
  try {
    const supabase = createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ success: false, error: { code: 'UNAUTHORIZED', message: 'Not authenticated' } }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json({ success: false, error: { code: 'VALIDATION_ERROR', message: 'No file provided' } }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const fileExt = file.name.split('.').pop() || 'png';
    const fileName = `${user.id}-${Date.now()}.${fileExt}`;
    const filePath = `users/${user.id}/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('avatars')
      .upload(filePath, buffer, { contentType: file.type, upsert: true });

    if (uploadError) {
      console.error('Supabase storage upload error:', uploadError);
      return NextResponse.json({ success: false, error: { code: 'UPLOAD_ERROR', message: 'Failed to upload avatar image' } }, { status: 500 });
    }

    const { data: { publicUrl } } = supabase.storage.from('avatars').getPublicUrl(filePath);

    const { data: updatedProfile, error } = await supabase
      .from('profiles')
      .update({ avatar_url: publicUrl })
      .eq('user_id', user.id)
      .select('*, users!profiles_user_id_fkey(email)')
      .single();

    if (error) throw error;

    const { count: tripCount } = await supabase.from('trips').select('id', { count: 'exact', head: true }).eq('owner_id', user.id);

    const profileData = {
      ...updatedProfile,
      user: { email: updatedProfile.users?.email || user.email, _count: { trips: tripCount ?? 0 } },
      users: undefined,
    };
    delete profileData.users;

    return NextResponse.json({ success: true, data: profileData });
  } catch (error) {
    console.error('Avatar upload error:', error);
    return NextResponse.json({ success: false, error: { code: 'INTERNAL_ERROR', message: 'An unexpected error occurred' } }, { status: 500 });
  }
}

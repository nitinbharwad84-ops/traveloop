import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { prisma } from '@/lib/prisma/client';

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

    // Convert file to array buffer for Supabase upload
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Generate unique filename
    const fileExt = file.name.split('.').pop() || 'png';
    const fileName = `${user.id}-${Date.now()}.${fileExt}`;
    const filePath = `users/${user.id}/${fileName}`;

    // Upload to Supabase Storage
    const { error: uploadError } = await supabase.storage
      .from('avatars')
      .upload(filePath, buffer, {
        contentType: file.type,
        upsert: true,
      });

    if (uploadError) {
      console.error('Supabase storage upload error:', uploadError);
      return NextResponse.json({ success: false, error: { code: 'UPLOAD_ERROR', message: 'Failed to upload avatar image' } }, { status: 500 });
    }

    // Get public URL
    const { data: { publicUrl } } = supabase.storage.from('avatars').getPublicUrl(filePath);

    // Update profile record in Prisma
    const updatedProfile = await prisma.profile.update({
      where: { userId: user.id },
      data: { avatarUrl: publicUrl },
      include: {
        user: {
          include: {
            _count: { select: { trips: true } }
          }
        }
      }
    });

    return NextResponse.json({ success: true, data: updatedProfile });
  } catch (error) {
    console.error('Avatar upload error:', error);
    return NextResponse.json({ success: false, error: { code: 'INTERNAL_ERROR', message: 'An unexpected error occurred' } }, { status: 500 });
  }
}

import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { prisma } from '@/lib/prisma/client';

export async function POST(request: Request, { params }: { params: { tripId: string } }) {
  try {
    const supabase = createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ success: false, error: { code: 'UNAUTHORIZED', message: 'Not authenticated' } }, { status: 401 });
    }

    // Verify ownership
    const existingTrip = await prisma.trip.findUnique({ where: { id: params.tripId } });
    if (!existingTrip) return NextResponse.json({ success: false, error: { code: 'NOT_FOUND', message: 'Trip not found' } }, { status: 404 });
    if (existingTrip.ownerId !== user.id) return NextResponse.json({ success: false, error: { code: 'FORBIDDEN', message: 'Access denied' } }, { status: 403 });

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
    const fileName = `${params.tripId}-${Date.now()}.${fileExt}`;
    const filePath = `trips/${user.id}/${fileName}`;

    // Upload to Supabase Storage
    const { error: uploadError } = await supabase.storage
      .from('trip-covers')
      .upload(filePath, buffer, {
        contentType: file.type,
        upsert: true,
      });

    if (uploadError) {
      console.error('Supabase storage upload error:', uploadError);
      return NextResponse.json({ success: false, error: { code: 'UPLOAD_ERROR', message: 'Failed to upload cover image' } }, { status: 500 });
    }

    // Get public URL
    const { data: { publicUrl } } = supabase.storage.from('trip-covers').getPublicUrl(filePath);

    // Update trip record
    const updatedTrip = await prisma.trip.update({
      where: { id: params.tripId },
      data: { coverImageUrl: publicUrl },
      include: {
        _count: { select: { stops: true, collaborators: true } },
        budgets: true,
      }
    });

    return NextResponse.json({ success: true, data: updatedTrip });
  } catch (error) {
    console.error('Cover upload error:', error);
    return NextResponse.json({ success: false, error: { code: 'INTERNAL_ERROR', message: 'An unexpected error occurred' } }, { status: 500 });
  }
}

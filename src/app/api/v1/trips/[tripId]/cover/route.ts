import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function POST(request: Request, { params }: { params: { tripId: string } }) {
  try {
    const supabase = createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ success: false, error: { code: 'UNAUTHORIZED', message: 'Not authenticated' } }, { status: 401 });
    }

    const { data: existingTrip } = await supabase.from('trips').select('*').eq('id', params.tripId).single();
    if (!existingTrip) return NextResponse.json({ success: false, error: { code: 'NOT_FOUND', message: 'Trip not found' } }, { status: 404 });
    if (existingTrip.owner_id !== user.id) return NextResponse.json({ success: false, error: { code: 'FORBIDDEN', message: 'Access denied' } }, { status: 403 });

    const formData = await request.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json({ success: false, error: { code: 'VALIDATION_ERROR', message: 'No file provided' } }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const fileExt = file.name.split('.').pop() || 'png';
    const fileName = `${params.tripId}-${Date.now()}.${fileExt}`;
    const filePath = `trips/${user.id}/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('trip-covers')
      .upload(filePath, buffer, { contentType: file.type, upsert: true });

    if (uploadError) {
      console.error('Supabase storage upload error:', uploadError);
      return NextResponse.json({ success: false, error: { code: 'UPLOAD_ERROR', message: 'Failed to upload cover image' } }, { status: 500 });
    }

    const { data: { publicUrl } } = supabase.storage.from('trip-covers').getPublicUrl(filePath);

    const { data: updatedTrip, error } = await supabase
      .from('trips')
      .update({ cover_image_url: publicUrl })
      .eq('id', params.tripId)
      .select('*, budgets(*)')
      .single();

    if (error) throw error;

    const [stopsRes, collabsRes] = await Promise.all([
      supabase.from('trip_stops').select('id', { count: 'exact', head: true }).eq('trip_id', params.tripId),
      supabase.from('collaborators').select('id', { count: 'exact', head: true }).eq('trip_id', params.tripId),
    ]);

    return NextResponse.json({ success: true, data: { ...updatedTrip, _count: { stops: stopsRes.count ?? 0, collaborators: collabsRes.count ?? 0 } } });
  } catch (error) {
    console.error('Cover upload error:', error);
    return NextResponse.json({ success: false, error: { code: 'INTERNAL_ERROR', message: 'An unexpected error occurred' } }, { status: 500 });
  }
}

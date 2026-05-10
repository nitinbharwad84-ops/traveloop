import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const supabase = createClient();
    const { data: { user }, error } = await supabase.auth.getUser();

    if (error || !user) {
      return NextResponse.json(
        { success: false, error: { code: 'UNAUTHORIZED', message: 'Not authenticated' } },
        { status: 401 }
      );
    }

    // Fetch user record with profile
    const { data: userData } = await supabase
      .from('users')
      .select('id, email, role, status, profiles(first_name, last_name, avatar_url)')
      .eq('id', user.id)
      .single();

    return NextResponse.json({
      success: true,
      data: {
        user: userData || { id: user.id, email: user.email }
      }
    });
  } catch (error) {
    console.error('Auth me error:', error);
    return NextResponse.json(
      { success: false, error: { code: 'INTERNAL_ERROR', message: 'An unexpected error occurred' } },
      { status: 500 }
    );
  }
}

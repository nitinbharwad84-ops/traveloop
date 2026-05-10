import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { createClient as createSupabaseAdmin } from '@supabase/supabase-js';

export async function DELETE() {
  try {
    const supabase = createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ success: false, error: { code: 'UNAUTHORIZED', message: 'Not authenticated' } }, { status: 401 });
    }

    // To completely delete a user from Supabase Auth, we need the Service Role Key.
    // If NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are not present, this will fail.
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;

    if (!serviceRoleKey || !supabaseUrl) {
      return NextResponse.json({ 
        success: false, 
        error: { code: 'CONFIGURATION_ERROR', message: 'Server misconfigured for account deletion' } 
      }, { status: 500 });
    }

    const supabaseAdmin = createSupabaseAdmin(supabaseUrl, serviceRoleKey);
    
    // Delete user from Supabase Auth (this should cascade delete related Prisma records via DB triggers/FK constraints)
    const { error: deleteError } = await supabaseAdmin.auth.admin.deleteUser(user.id);

    if (deleteError) {
      console.error('Failed to delete user via admin api:', deleteError);
      return NextResponse.json({ success: false, error: { code: 'DELETE_FAILED', message: deleteError.message } }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Account deletion error:', error);
    return NextResponse.json({ success: false, error: { code: 'INTERNAL_ERROR', message: 'An unexpected error occurred' } }, { status: 500 });
  }
}

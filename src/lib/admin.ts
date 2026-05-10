import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function requireAdmin() {
  const supabase = createClient();
  const { data: { user }, error } = await supabase.auth.getUser();

  if (error || !user) {
    throw new Error('UNAUTHORIZED');
  }

  const { data: userData } = await supabase
    .from('users')
    .select('role')
    .eq('id', user.id)
    .single();

  if (userData?.role !== 'admin') {
    throw new Error('FORBIDDEN');
  }

  return user.id;
}

export function handleAdminError(error: unknown) {
  if (error instanceof Error) {
    if (error.message === 'UNAUTHORIZED') {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }
    if (error.message === 'FORBIDDEN') {
      return NextResponse.json({ success: false, error: 'Forbidden: Admin access required' }, { status: 403 });
    }
  }
  console.error('Admin API Error:', error);
  return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
}

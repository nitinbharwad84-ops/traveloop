import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { requireAdmin, handleAdminError } from '@/lib/admin';

export async function GET() {
  try {
    await requireAdmin();
    const supabase = createClient();

    const { data: logs } = await supabase
      .from('audit_logs')
      .select('*, users!audit_logs_actor_id_fkey(email, profiles(first_name))')
      .order('created_at', { ascending: false })
      .limit(100);

    // Reshape
    const result = (logs || []).map(l => ({
      ...l,
      actor: l.users ? { email: l.users.email, profile: l.users.profiles } : null,
      users: undefined,
    }));

    return NextResponse.json({ success: true, data: result });
  } catch (error) {
    return handleAdminError(error);
  }
}

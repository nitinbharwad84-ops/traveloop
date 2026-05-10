import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export const dynamic = 'force-dynamic';
import { requireAdmin, handleAdminError } from '@/lib/admin';

export async function GET() {
  try {
    await requireAdmin();
    const supabase = createClient();

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const [usersRes, tripsRes, activeUsersRes, aiCallsRes] = await Promise.all([
      supabase.from('users').select('id', { count: 'exact', head: true }),
      supabase.from('trips').select('id', { count: 'exact', head: true }),
      supabase.from('users').select('id', { count: 'exact', head: true }).gte('last_login_at', today.toISOString()),
      supabase.from('ai_usage_logs').select('id', { count: 'exact', head: true }).gte('created_at', today.toISOString()),
    ]);

    return NextResponse.json({
      success: true,
      data: {
        totalUsers: usersRes.count ?? 0,
        totalTrips: tripsRes.count ?? 0,
        activeUsersToday: activeUsersRes.count ?? 0,
        aiCallsToday: aiCallsRes.count ?? 0,
      }
    });
  } catch (error) {
    return handleAdminError(error);
  }
}

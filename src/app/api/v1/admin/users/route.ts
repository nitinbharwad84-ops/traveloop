import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { requireAdmin, handleAdminError } from '@/lib/admin';

export async function GET(request: Request) {
  try {
    await requireAdmin();
    const supabase = createClient();
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search') || '';

    let query = supabase.from('users').select('*, profiles(*)').order('created_at', { ascending: false }).limit(50);
    if (search) {
      query = query.or(`email.ilike.%${search}%`);
    }

    const { data: users } = await query;

    // Get counts for each user
    const usersWithCounts = await Promise.all((users || []).map(async (u) => {
      const [tripsRes, postsRes] = await Promise.all([
        supabase.from('trips').select('id', { count: 'exact', head: true }).eq('owner_id', u.id),
        supabase.from('community_posts').select('id', { count: 'exact', head: true }).eq('user_id', u.id),
      ]);
      return { ...u, profile: u.profiles, profiles: undefined, _count: { trips: tripsRes.count ?? 0, communityPosts: postsRes.count ?? 0 } };
    }));

    return NextResponse.json({ success: true, data: usersWithCounts });
  } catch (error) {
    return handleAdminError(error);
  }
}

export async function PATCH(request: Request) {
  try {
    const adminId = await requireAdmin();
    const supabase = createClient();
    const { userId, status } = await request.json();

    if (!userId || !status) return NextResponse.json({ success: false, error: 'userId and status are required' }, { status: 400 });

    const { data: user } = await supabase.from('users').update({ status }).eq('id', userId).select().single();
    await supabase.from('audit_logs').insert({ actor_id: adminId, action: `user_${status}`, resource_type: 'user', resource_id: userId, payload: { status } });

    return NextResponse.json({ success: true, data: user });
  } catch (error) {
    return handleAdminError(error);
  }
}

export async function DELETE(request: Request) {
  try {
    const adminId = await requireAdmin();
    const supabase = createClient();
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) return NextResponse.json({ success: false, error: 'userId required' }, { status: 400 });

    await supabase.from('users').delete().eq('id', userId);
    await supabase.from('audit_logs').insert({ actor_id: adminId, action: 'user_delete', resource_type: 'user', resource_id: userId });

    return NextResponse.json({ success: true });
  } catch (error) {
    return handleAdminError(error);
  }
}

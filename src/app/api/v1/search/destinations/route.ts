import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(request: Request) {
  const supabase = createClient();
  const { searchParams } = new URL(request.url);
  const q = searchParams.get('q') || '';
  const region = searchParams.get('region') || '';
  const budget = searchParams.get('budget');
  const page = parseInt(searchParams.get('page') || '1');
  const limit = 24;
  const offset = (page - 1) * limit;

  let query = supabase.from('destinations').select('*', { count: 'exact' });

  if (q) {
    query = query.or(`city_name.ilike.%${q}%,country_name.ilike.%${q}%`);
  }
  if (region) {
    query = query.ilike('region', `%${region}%`);
  }
  if (budget) {
    query = query.eq('estimated_budget_index', parseInt(budget));
  }

  query = query
    .order('trending', { ascending: false })
    .order('city_name', { ascending: true })
    .range(offset, offset + limit - 1);

  const { data: destinations, count, error } = await query;

  if (error) {
    console.error('Search destinations error:', error);
    return NextResponse.json({ success: false, error: 'Failed to search destinations' }, { status: 500 });
  }

  const total = count ?? 0;
  return NextResponse.json({ success: true, data: destinations || [], meta: { total, page, limit, totalPages: Math.ceil(total / limit) } });
}

import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(request: Request) {
  const supabase = createClient();
  const { searchParams } = new URL(request.url);
  const q = searchParams.get('q') || '';
  const category = searchParams.get('category') || '';
  const maxPrice = searchParams.get('maxPrice');
  const maxDuration = searchParams.get('maxDuration');
  const sortBy = searchParams.get('sort') || 'name';
  const page = parseInt(searchParams.get('page') || '1');
  const limit = 24;
  const offset = (page - 1) * limit;

  let query = supabase.from('activities').select('*', { count: 'exact' });

  if (q) {
    query = query.or(`name.ilike.%${q}%,description.ilike.%${q}%`);
  }
  if (category) {
    query = query.eq('category', category);
  }
  if (maxPrice) {
    query = query.lte('estimated_cost', parseFloat(maxPrice));
  }
  if (maxDuration) {
    query = query.lte('estimated_duration', parseInt(maxDuration));
  }

  if (sortBy === 'price') query = query.order('estimated_cost', { ascending: true });
  else if (sortBy === 'rating') query = query.order('rating', { ascending: false });
  else if (sortBy === 'duration') query = query.order('estimated_duration', { ascending: true });
  else query = query.order('name', { ascending: true });

  query = query.range(offset, offset + limit - 1);

  const { data: activities, count, error } = await query;

  if (error) {
    console.error('Search activities error:', error);
    return NextResponse.json({ success: false, error: 'Failed to search activities' }, { status: 500 });
  }

  const total = count ?? 0;
  return NextResponse.json({ success: true, data: activities || [], meta: { total, page, limit, totalPages: Math.ceil(total / limit) } });
}

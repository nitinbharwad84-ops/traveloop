'use client';
import { useState } from 'react';
import { useActivitySearch } from '@/features/discovery/hooks/useDiscovery';
import { ActivityCard } from '@/features/discovery/components/ActivityCard';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card } from '@/components/ui/card';
import { Search } from 'lucide-react';
import { useDebounce } from '@/hooks/useDebounce';
import { useSearchParams } from 'next/navigation';

const CATEGORIES = ['sightseeing', 'cultural', 'nightlife', 'food', 'adventure', 'shopping', 'family', 'nature', 'wellness', 'local_experiences'];

export default function ActivitiesPage() {
  const searchParams = useSearchParams();
  const [q, setQ] = useState(searchParams.get('q') || '');
  const [category, setCategory] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [maxDuration, setMaxDuration] = useState('');
  const [sort, setSort] = useState('name');
  const [page, setPage] = useState(1);
  const debouncedQ = useDebounce(q, 300);

  const params: Record<string, string> = { sort, page: String(page) };
  if (debouncedQ) params.q = debouncedQ;
  if (category) params.category = category;
  if (maxPrice) params.maxPrice = maxPrice;
  if (maxDuration) params.maxDuration = maxDuration;

  const { data, isLoading } = useActivitySearch(params);
  const activities = data?.success ? data.data : [];
  const meta = data?.meta;

  return (
    <div className="container max-w-7xl py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight mb-1">Discover Activities</h1>
        <p className="text-muted-foreground">Find things to do around the world</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar Filters */}
        <aside className="lg:col-span-1 space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-semibold">Sort By</label>
            <Select value={sort} onValueChange={setSort}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="name">Name</SelectItem>
                <SelectItem value="price">Price: Low to High</SelectItem>
                <SelectItem value="rating">Highest Rated</SelectItem>
                <SelectItem value="duration">Duration</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-semibold">Max Price ($)</label>
            <Input type="number" min={0} placeholder="e.g. 100" value={maxPrice} onChange={e => { setMaxPrice(e.target.value); setPage(1); }} />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-semibold">Max Duration (min)</label>
            <Input type="number" min={0} placeholder="e.g. 120" value={maxDuration} onChange={e => { setMaxDuration(e.target.value); setPage(1); }} />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-semibold">Category</label>
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map(cat => (
                <Badge
                  key={cat}
                  variant={category === cat ? 'default' : 'outline'}
                  className="cursor-pointer capitalize text-xs"
                  onClick={() => { setCategory(category === cat ? '' : cat); setPage(1); }}
                >
                  {cat.replace('_', ' ')}
                </Badge>
              ))}
            </div>
          </div>
          {(category || maxPrice || maxDuration) && (
            <Button variant="ghost" className="w-full" onClick={() => { setCategory(''); setMaxPrice(''); setMaxDuration(''); setPage(1); }}>
              Clear Filters
            </Button>
          )}
        </aside>

        {/* Results Grid */}
        <div className="lg:col-span-3 space-y-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input className="pl-9" placeholder="Search activities..." value={q} onChange={e => { setQ(e.target.value); setPage(1); }} />
          </div>

          {isLoading ? (
            <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-5">
              {Array.from({ length: 9 }).map((_, i) => <Card key={i} className="h-52 animate-pulse bg-muted" />)}
            </div>
          ) : activities.length === 0 ? (
            <div className="text-center py-20 border-2 border-dashed rounded-2xl">
              <p className="text-xl font-semibold mb-2">No activities found</p>
              <p className="text-muted-foreground">Try adjusting your search or filters</p>
            </div>
          ) : (
            <>
              <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">{meta?.total ?? activities.length} activities found</p>
              </div>
              <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-5">
                {activities.map(a => <ActivityCard key={a.id} activity={a} />)}
              </div>
              {meta && meta.totalPages > 1 && (
                <div className="flex justify-center gap-3 mt-6">
                  <Button variant="outline" disabled={page === 1} onClick={() => setPage(p => p - 1)}>Previous</Button>
                  <span className="flex items-center text-sm text-muted-foreground">Page {page} of {meta.totalPages}</span>
                  <Button variant="outline" disabled={page >= meta.totalPages} onClick={() => setPage(p => p + 1)}>Next</Button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

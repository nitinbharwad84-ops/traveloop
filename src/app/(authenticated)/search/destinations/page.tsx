'use client';
import { useState } from 'react';
import { useDestinationSearch } from '@/features/discovery/hooks/useDiscovery';
import { DestinationCard } from '@/features/discovery/components/DestinationCard';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card } from '@/components/ui/card';
import { Search, Globe } from 'lucide-react';
import { useDebounce } from '@/hooks/useDebounce';

const REGIONS = ['Asia', 'Europe', 'Americas', 'Africa', 'Oceania', 'Middle East'];
const BUDGETS = [{ label: 'Budget ($)', value: '1' }, { label: 'Economy ($$)', value: '2' }, { label: 'Moderate ($$$)', value: '3' }, { label: 'Luxury ($$$$)', value: '4' }, { label: 'Ultra ($$$$$)', value: '5' }];

export default function DestinationsPage() {
  const [q, setQ] = useState('');
  const [region, setRegion] = useState('');
  const [budget, setBudget] = useState('');
  const [page, setPage] = useState(1);
  const debouncedQ = useDebounce(q, 300);

  const params: Record<string, string> = { page: String(page) };
  if (debouncedQ) params.q = debouncedQ;
  if (region) params.region = region;
  if (budget) params.budget = budget;

  const { data, isLoading } = useDestinationSearch(params);
  const destinations = data?.success ? data.data : [];
  const meta = data?.meta;
  const trending = destinations.filter(d => d.trending);
  const all = destinations.filter(d => !d.trending || debouncedQ || region || budget);

  const clearFilters = () => { setQ(''); setRegion(''); setBudget(''); setPage(1); };

  return (
    <div className="container max-w-7xl py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight mb-1">Discover Destinations</h1>
        <p className="text-muted-foreground">Explore the world&apos;s best travel destinations</p>
      </div>

      {/* Search & Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-8">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input className="pl-9" placeholder="Search cities, countries..." value={q} onChange={e => { setQ(e.target.value); setPage(1); }} />
        </div>
        <Select value={region} onValueChange={v => { setRegion(v === 'all' ? '' : v); setPage(1); }}>
          <SelectTrigger className="w-[180px]"><Globe className="mr-2 h-4 w-4" /><SelectValue placeholder="Region" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Regions</SelectItem>
            {REGIONS.map(r => <SelectItem key={r} value={r}>{r}</SelectItem>)}
          </SelectContent>
        </Select>
        <Select value={budget} onValueChange={v => { setBudget(v === 'all' ? '' : v); setPage(1); }}>
          <SelectTrigger className="w-[180px]"><SelectValue placeholder="Budget" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Any Budget</SelectItem>
            {BUDGETS.map(b => <SelectItem key={b.value} value={b.value}>{b.label}</SelectItem>)}
          </SelectContent>
        </Select>
        {(q || region || budget) && <Button variant="ghost" onClick={clearFilters}>Clear</Button>}
      </div>

      {/* Trending Section */}
      {trending.length > 0 && !debouncedQ && !region && !budget && (
        <section className="mb-10">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">🔥 Trending Now</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {trending.slice(0, 4).map(d => <DestinationCard key={d.id} dest={d} />)}
          </div>
        </section>
      )}

      {/* All Destinations */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold">
            {debouncedQ ? `Results for "${debouncedQ}"` : 'All Destinations'}
            {meta && <span className="text-sm font-normal text-muted-foreground ml-2">({meta.total})</span>}
          </h2>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <Card key={i} className="h-64 animate-pulse bg-muted" />
            ))}
          </div>
        ) : destinations.length === 0 ? (
          <div className="text-center py-20 border-2 border-dashed rounded-2xl">
            <p className="text-xl font-semibold mb-2">No destinations found</p>
            <p className="text-muted-foreground">Try adjusting your search filters</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {(debouncedQ || region || budget ? destinations : all).map(d => (
                <DestinationCard key={d.id} dest={d} />
              ))}
            </div>
            {meta && meta.totalPages > 1 && (
              <div className="flex justify-center gap-3 mt-10">
                <Button variant="outline" disabled={page === 1} onClick={() => setPage(p => p - 1)}>Previous</Button>
                <span className="flex items-center text-sm text-muted-foreground">Page {page} of {meta.totalPages}</span>
                <Button variant="outline" disabled={page >= meta.totalPages} onClick={() => setPage(p => p + 1)}>Next</Button>
              </div>
            )}
          </>
        )}
      </section>
    </div>
  );
}

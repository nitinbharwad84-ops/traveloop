'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useTrips } from '@/features/trips/hooks/useTrips';
import { TripCard } from '@/features/dashboard/components/TripCard';
import { DashboardSkeleton } from '@/features/dashboard/components/DashboardSkeleton';
import { EmptyDashboardState } from '@/features/dashboard/components/EmptyDashboardState';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Search } from 'lucide-react';
import { ROUTES } from '@/constants';

export default function MyTripsPage() {
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOption, setSortOption] = useState('updated_desc');

  const { trips, isLoading } = useTrips({
    status: statusFilter !== 'all' ? statusFilter : undefined,
    q: searchQuery || undefined,
    sort: sortOption
  });

  return (
    <div className="container max-w-6xl py-8 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">My Trips</h1>
          <p className="text-muted-foreground">Manage and organize all your travel plans.</p>
        </div>
        <Button asChild size="lg" className="rounded-full shadow-md">
          <Link href={ROUTES.TRIPS_NEW}>
            <Plus className="mr-2 h-5 w-5" />
            Create Trip
          </Link>
        </Button>
      </div>

      <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-card p-4 rounded-xl border shadow-sm">
        <Tabs value={statusFilter} onValueChange={setStatusFilter} className="w-full md:w-auto overflow-x-auto">
          <TabsList className="h-10">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="active">Active</TabsTrigger>
            <TabsTrigger value="draft">Drafts</TabsTrigger>
            <TabsTrigger value="completed">Completed</TabsTrigger>
            <TabsTrigger value="archived">Archived</TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="flex w-full md:w-auto items-center gap-3">
          <div className="relative flex-1 md:w-64">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search trips..."
              className="pl-9 h-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Select value={sortOption} onValueChange={setSortOption}>
            <SelectTrigger className="w-[140px] h-10">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="updated_desc">Recently Updated</SelectItem>
              <SelectItem value="date_asc">Upcoming First</SelectItem>
              <SelectItem value="date_desc">Past First</SelectItem>
              <SelectItem value="created_desc">Newest Created</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {isLoading ? (
        <DashboardSkeleton />
      ) : (trips || []).length === 0 ? (
        searchQuery || statusFilter !== 'all' ? (
          <div className="text-center py-20 border rounded-xl border-dashed bg-muted/20">
            <h3 className="text-xl font-semibold mb-2">No trips found</h3>
            <p className="text-muted-foreground">Try adjusting your filters or search query.</p>
          </div>
        ) : (
          <EmptyDashboardState />
        )
      ) : (
        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {(trips || []).map((trip) => (
            <TripCard key={trip.id} trip={trip} />
          ))}
        </div>
      )}
    </div>
  );
}

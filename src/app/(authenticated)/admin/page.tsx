'use client';

import { useQuery } from '@tanstack/react-query';
import { Users, Plane, Sparkles, Activity, Loader2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function AdminDashboardPage() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['admin', 'kpis'],
    queryFn: async () => {
      const res = await fetch('/api/v1/admin/kpis');
      const json = await res.json();
      if (!json.success) throw new Error(json.error);
      return json.data;
    },
  });

  if (isLoading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="flex h-[50vh] items-center justify-center text-destructive">
        Failed to load dashboard KPIs. Are you sure you have admin access?
      </div>
    );
  }

  const kpis = [
    { title: 'Total Users', value: data.totalUsers, icon: Users },
    { title: 'Total Trips', value: data.totalTrips, icon: Plane },
    { title: 'Active Today', value: data.activeUsersToday, icon: Activity },
    { title: 'AI Calls Today', value: data.aiCallsToday, icon: Sparkles },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard Overview</h1>
        <p className="text-muted-foreground mt-1">Welcome to the Traveloop Admin panel.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {kpis.map((kpi) => {
          const Icon = kpi.icon;
          return (
            <Card key={kpi.title}>
              <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {kpi.title}
                </CardTitle>
                <Icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{kpi.value.toLocaleString()}</div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

'use client';

import { useDashboard } from '@/features/dashboard/hooks/useDashboard';
import { useProfile } from '@/features/profile/hooks/useProfile';
import { WelcomePanel } from '@/features/dashboard/components/WelcomePanel';
import { RecentTrips } from '@/features/dashboard/components/RecentTrips';
import { UpcomingTrips } from '@/features/dashboard/components/UpcomingTrips';
import { BudgetAlerts } from '@/features/dashboard/components/BudgetAlerts';
import { DashboardSkeleton } from '@/features/dashboard/components/DashboardSkeleton';
import { EmptyDashboardState } from '@/features/dashboard/components/EmptyDashboardState';

export default function DashboardPage() {
  const { profile, isLoading: isProfileLoading } = useProfile();
  const { 
    recentTrips, 
    upcomingTrips, 
    budgetAlerts, 
    isInitialLoading, 
    hasNoTrips 
  } = useDashboard();

  if (isInitialLoading || isProfileLoading) {
    return (
      <div className="container max-w-6xl py-8">
        <DashboardSkeleton />
      </div>
    );
  }

  const firstName = profile?.firstName || 'Traveler';

  return (
    <div className="container max-w-6xl py-8 space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Welcome & Quick Actions */}
      <WelcomePanel firstName={firstName} />

      {/* Budget Alerts (only shows if there are alerts) */}
      <BudgetAlerts alerts={budgetAlerts} />

      {hasNoTrips ? (
        <EmptyDashboardState />
      ) : (
        <div className="space-y-10">
          {/* Upcoming Trips */}
          <UpcomingTrips trips={upcomingTrips || []} />

          {/* Recent Trips */}
          <RecentTrips trips={recentTrips || []} />
        </div>
      )}
    </div>
  );
}

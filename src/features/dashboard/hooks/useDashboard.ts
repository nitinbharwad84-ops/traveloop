import { useQuery } from '@tanstack/react-query';
import { tripService } from '@/services/trip.service';

export function useDashboard() {
  const { data: recentTripsResponse, isLoading: isLoadingRecent } = useQuery({
    queryKey: ['trips', 'recent'],
    queryFn: () => tripService.getRecentTrips(6),
    staleTime: 5 * 60 * 1000,
  });

  const { data: upcomingTripsResponse, isLoading: isLoadingUpcoming } = useQuery({
    queryKey: ['trips', 'upcoming'],
    queryFn: () => tripService.getUpcomingTrips(10),
    staleTime: 5 * 60 * 1000,
  });

  const recentTrips = recentTripsResponse?.success ? recentTripsResponse.data : [];
  const upcomingTrips = upcomingTripsResponse?.success ? upcomingTripsResponse.data : [];

  // Calculate budget alerts: any trip where total actual > total estimated
  const budgetAlerts = [...(recentTrips || []), ...(upcomingTrips || [])]
    .filter((trip, index, self) => 
      // deduplicate in case a trip is in both lists
      index === self.findIndex((t) => t.id === trip.id)
    )
    .filter(trip => {
      if (!trip.budgets || trip.budgets.length === 0) return false;
      const totalEstimated = trip.budgets.reduce((sum, b) => sum + Number(b.estimatedAmount), 0);
      const totalActual = trip.budgets.reduce((sum, b) => sum + Number(b.actualAmount), 0);
      return totalActual > totalEstimated && totalEstimated > 0;
    })
    .map(trip => {
      const totalEstimated = trip.budgets.reduce((sum, b) => sum + Number(b.estimatedAmount), 0);
      const totalActual = trip.budgets.reduce((sum, b) => sum + Number(b.actualAmount), 0);
      return {
        tripId: trip.id,
        tripTitle: trip.title,
        totalEstimated,
        totalActual,
        overage: totalActual - totalEstimated,
        percentUsed: Math.round((totalActual / totalEstimated) * 100)
      };
    });

  return {
    recentTrips,
    isLoadingRecent,
    upcomingTrips,
    isLoadingUpcoming,
    budgetAlerts,
    isInitialLoading: isLoadingRecent || isLoadingUpcoming,
    hasNoTrips: !isLoadingRecent && !isLoadingUpcoming && recentTrips?.length === 0 && upcomingTrips?.length === 0
  };
}

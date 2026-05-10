import { useQuery } from '@tanstack/react-query';
import { tripService, GetTripsFilters } from '@/services/trip.service';

export function useTrips(filters: GetTripsFilters = {}) {
  // Convert object to string to use safely in queryKey
  const queryKeyParams = Object.keys(filters).length ? filters : 'all';

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['trips', queryKeyParams],
    queryFn: () => tripService.getTrips(filters),
    staleTime: 1 * 60 * 1000, // 1 min caching for lists
  });

  return {
    trips: data?.success ? data.data : [],
    isLoading,
    error,
    refetch
  };
}

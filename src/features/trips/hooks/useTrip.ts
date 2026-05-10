import { useQuery } from '@tanstack/react-query';
import { tripService } from '@/services/trip.service';

export function useTrip(tripId: string) {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['trip', tripId],
    queryFn: () => tripService.getTrip(tripId),
    enabled: !!tripId && tripId !== 'new', // don't fetch if it's a new trip form
    staleTime: 5 * 60 * 1000,
  });

  return {
    trip: data?.success ? data.data : null,
    isLoading,
    error,
    refetch
  };
}

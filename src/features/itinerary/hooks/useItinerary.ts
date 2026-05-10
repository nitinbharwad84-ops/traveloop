import { useQuery } from '@tanstack/react-query';
import { itineraryService, TripStopData } from '@/services/itinerary.service';

export function useItinerary(tripId: string) {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['itinerary', tripId],
    queryFn: () => itineraryService.getStops(tripId),
    enabled: !!tripId,
  });

  return {
    stops: (data?.success ? data.data : []) as TripStopData[],
    isLoading,
    error,
    refetch
  };
}

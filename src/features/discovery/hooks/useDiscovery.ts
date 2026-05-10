import { useQuery } from '@tanstack/react-query';
import { discoveryService } from '@/services/discovery.service';

export function useDestinationSearch(params: Record<string, string>) {
  return useQuery({
    queryKey: ['destinations', params],
    queryFn: () => discoveryService.searchDestinations(params),
    placeholderData: (prev) => prev,
  });
}

export function useActivitySearch(params: Record<string, string>) {
  return useQuery({
    queryKey: ['activities', params],
    queryFn: () => discoveryService.searchActivities(params),
    placeholderData: (prev) => prev,
  });
}

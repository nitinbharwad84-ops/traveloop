import { useQuery } from '@tanstack/react-query';
import { packingService } from '@/services/packing.service';

export function usePacking(tripId: string) {
  const { data, isLoading, error } = useQuery({
    queryKey: ['trips', tripId, 'packing'],
    queryFn: () => packingService.getItems(tripId),
    enabled: !!tripId,
  });

  return {
    items: data?.data || [],
    isLoading,
    error,
  };
}

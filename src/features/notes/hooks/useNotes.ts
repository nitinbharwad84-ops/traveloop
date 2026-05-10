import { useQuery } from '@tanstack/react-query';
import { notesService } from '@/services/notes.service';

export function useNotes(tripId: string) {
  const { data, isLoading, error } = useQuery({
    queryKey: ['trips', tripId, 'notes'],
    queryFn: () => notesService.getNotes(tripId),
    enabled: !!tripId,
  });

  return {
    notes: data?.data || [],
    isLoading,
    error,
  };
}

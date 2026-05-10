import { useMutation, useQueryClient } from '@tanstack/react-query';
import { notesService, NoteData } from '@/services/notes.service';

export function useNotesMutations(tripId: string) {
  const queryClient = useQueryClient();
  const queryKey = ['trips', tripId, 'notes'];

  const createMutation = useMutation({
    mutationFn: (data: { content?: string; noteType?: string; linkedDay?: number | null }) => 
      notesService.createNote(tripId, data),
    onSuccess: (res) => {
      // Optimistically append the new note to the list to avoid a full refetch flash
      queryClient.setQueryData<{ success: boolean; data: NoteData[] }>(queryKey, (old) => {
        if (!old) return old;
        return { ...old, data: [res.data, ...old.data] };
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ noteId, data }: { noteId: string, data: Partial<NoteData> }) => 
      notesService.updateNote(noteId, data),
    onMutate: async ({ noteId, data }) => {
      await queryClient.cancelQueries({ queryKey });
      const previous = queryClient.getQueryData<{ success: boolean; data: NoteData[] }>(queryKey);

      if (previous?.data) {
        queryClient.setQueryData(queryKey, {
          success: true,
          data: previous.data.map(note => 
            note.id === noteId ? { ...note, ...data, updatedAt: new Date().toISOString() } : note
          )
        });
      }
      return { previous };
    },
    onError: (err, variables, context) => {
      if (context?.previous) {
        queryClient.setQueryData(queryKey, context.previous);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (noteId: string) => notesService.deleteNote(noteId),
    onMutate: async (noteId) => {
      await queryClient.cancelQueries({ queryKey });
      const previous = queryClient.getQueryData<{ success: boolean; data: NoteData[] }>(queryKey);

      if (previous?.data) {
        queryClient.setQueryData(queryKey, {
          success: true,
          data: previous.data.filter(note => note.id !== noteId)
        });
      }
      return { previous };
    },
    onError: (err, variables, context) => {
      if (context?.previous) {
        queryClient.setQueryData(queryKey, context.previous);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey });
    },
  });

  return {
    createNote: createMutation.mutateAsync,
    isCreating: createMutation.isPending,
    updateNote: updateMutation.mutate,
    updateNoteAsync: updateMutation.mutateAsync,
    deleteNote: deleteMutation.mutate,
  };
}

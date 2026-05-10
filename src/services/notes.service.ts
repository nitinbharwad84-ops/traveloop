export interface NoteData {
  id: string;
  tripId: string;
  userId: string;
  content: string;
  noteType: string;
  linkedDay: number | null;
  createdAt: string;
  updatedAt: string;
}

export const notesService = {
  async getNotes(tripId: string) {
    const res = await fetch(`/api/v1/trips/${tripId}/notes`);
    if (!res.ok) throw new Error('Failed to fetch notes');
    return res.json() as Promise<{ success: boolean; data: NoteData[] }>;
  },

  async createNote(tripId: string, data: { content?: string; noteType?: string; linkedDay?: number | null }) {
    const res = await fetch(`/api/v1/trips/${tripId}/notes`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to create note');
    return res.json() as Promise<{ success: boolean; data: NoteData }>;
  },

  async updateNote(noteId: string, data: { content?: string; noteType?: string; linkedDay?: number | null }) {
    const res = await fetch(`/api/v1/notes/${noteId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to update note');
    return res.json() as Promise<{ success: boolean; data: NoteData }>;
  },

  async deleteNote(noteId: string) {
    const res = await fetch(`/api/v1/notes/${noteId}`, {
      method: 'DELETE',
    });
    if (!res.ok) throw new Error('Failed to delete note');
    return res.json() as Promise<{ success: boolean }>;
  },
};

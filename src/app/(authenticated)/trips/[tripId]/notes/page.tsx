'use client';

import { useState, useEffect, useMemo } from 'react';
import { useTrip } from '@/features/trips/hooks/useTrip';
import { useNotes } from '@/features/notes/hooks/useNotes';
import { useNotesMutations } from '@/features/notes/hooks/useNotesMutations';
import { DashboardSkeleton } from '@/features/dashboard/components/DashboardSkeleton';
import { NoteTypeFilter } from '@/features/notes/components/NoteTypeFilter';
import { NoteSidebarList } from '@/features/notes/components/NoteSidebarList';
import { RichTextEditor } from '@/features/notes/components/RichTextEditor';
import { useDebounce } from '@/hooks/useDebounce';
import { NoteType } from '@prisma/client';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Plus, FileText } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export default function NotesPage({ params }: { params: { tripId: string } }) {
  const { tripId } = params;
  const { trip, isLoading: isTripLoading } = useTrip(tripId);
  const { notes, isLoading: isNotesLoading } = useNotes(tripId);
  const { createNote, updateNote, deleteNote, isCreating } = useNotesMutations(tripId);

  const [activeFilter, setActiveFilter] = useState<string>('all');
  const [selectedNoteId, setSelectedNoteId] = useState<string | null>(null);
  
  // Local editor state for debounced saving
  const [editorContent, setEditorContent] = useState<string>('');
  const [isSaving, setIsSaving] = useState(false);
  
  const debouncedContent = useDebounce(editorContent, 1000);

  // Filter notes
  const filteredNotes = useMemo(() => {
    if (activeFilter === 'all') return notes;
    return notes.filter(n => n.noteType === activeFilter);
  }, [notes, activeFilter]);

  // Derived selected note
  const selectedNote = useMemo(() => 
    notes.find(n => n.id === selectedNoteId), 
  [notes, selectedNoteId]);

  // Sync editor content when selecting a new note
  useEffect(() => {
    if (selectedNote) {
      setEditorContent(selectedNote.content);
    } else {
      setEditorContent('');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedNote?.id]); 

  // Auto-save effect
  useEffect(() => {
    if (selectedNote && selectedNote.content !== debouncedContent) {
      setIsSaving(true);
      updateNote(
        { noteId: selectedNote.id, data: { content: debouncedContent } },
        { onSettled: () => setIsSaving(false) }
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedContent]); 

  const handleCreateNote = async () => {
    const newNote = await createNote({ 
      noteType: activeFilter !== 'all' ? activeFilter : 'general',
      content: ''
    });
    setSelectedNoteId(newNote.data.id);
  };

  const handleTypeChange = (newType: string) => {
    if (selectedNote) {
      updateNote({ noteId: selectedNote.id, data: { noteType: newType as NoteType } });
    }
  };

  if (isTripLoading || isNotesLoading) {
    return <div className="container max-w-6xl py-8"><DashboardSkeleton /></div>;
  }

  if (!trip) {
    return <div className="container py-20 text-center">Trip not found</div>;
  }

  return (
    <div className="container max-w-6xl py-8 animate-in fade-in zoom-in-95 duration-300 h-[calc(100vh-4rem)] flex flex-col">
      {/* Header */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between mb-6 shrink-0">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href={`/trips/${trip.id}`}><ArrowLeft className="h-5 w-5" /></Link>
          </Button>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Notes & Journal</h1>
            <p className="text-muted-foreground">{trip.title}</p>
          </div>
        </div>
        
        <Button onClick={handleCreateNote} disabled={isCreating} className="w-full sm:w-auto">
          <Plus className="mr-2 h-4 w-4" /> New Note
        </Button>
      </div>

      {/* Main Layout */}
      <div className="flex flex-col lg:flex-row gap-6 flex-1 min-h-0">
        
        {/* Sidebar */}
        <div className="w-full lg:w-80 flex flex-col shrink-0">
          <NoteTypeFilter activeType={activeFilter} onSelect={setActiveFilter} />
          
          <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
            <NoteSidebarList 
              notes={filteredNotes} 
              selectedNoteId={selectedNoteId} 
              onSelect={setSelectedNoteId} 
              onDelete={(id) => {
                deleteNote(id);
                if (selectedNoteId === id) setSelectedNoteId(null);
              }}
            />
          </div>
        </div>

        {/* Editor Area */}
        <div className="flex-1 flex flex-col min-h-[400px]">
          {selectedNote ? (
            <div className="flex flex-col h-full gap-4">
              <div className="flex items-center gap-4 shrink-0 bg-card p-2 rounded-xl border shadow-sm">
                <Select value={selectedNote.noteType} onValueChange={handleTypeChange}>
                  <SelectTrigger className="w-[180px] border-0 focus:ring-0 shadow-none bg-muted/50">
                    <SelectValue placeholder="Note Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="general">General</SelectItem>
                    <SelectItem value="journal">Journal</SelectItem>
                    <SelectItem value="daily">Daily</SelectItem>
                    <SelectItem value="reminder">Reminder</SelectItem>
                    <SelectItem value="hotel">Hotel</SelectItem>
                    <SelectItem value="contact">Contact</SelectItem>
                    <SelectItem value="emergency">Emergency</SelectItem>
                  </SelectContent>
                </Select>
                <div className="flex-1" />
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => setSelectedNoteId(null)}
                  className="lg:hidden"
                >
                  Close Editor
                </Button>
              </div>

              <div className="flex-1">
                <RichTextEditor 
                  initialContent={selectedNote.content} 
                  onChange={setEditorContent} 
                  isSaving={isSaving}
                />
              </div>
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center border-2 border-dashed rounded-xl bg-card/50 text-muted-foreground p-8 text-center h-full">
              <FileText className="h-12 w-12 mb-4 opacity-20" />
              <p className="text-lg font-medium mb-1">No note selected</p>
              <p className="text-sm mb-4">Select a note from the list or create a new one to start writing.</p>
              <Button variant="outline" onClick={handleCreateNote} disabled={isCreating}>
                <Plus className="mr-2 h-4 w-4" /> Create Note
              </Button>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}

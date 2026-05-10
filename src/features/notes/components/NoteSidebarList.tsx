import { NoteData } from '@/services/notes.service';
import { formatDistanceToNow } from 'date-fns';
import { FileText, Bell, BookOpen, CalendarDays, Phone, AlertTriangle, Building2, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Props {
  notes: NoteData[];
  selectedNoteId: string | null;
  onSelect: (noteId: string) => void;
  onDelete: (noteId: string) => void;
}

const getIconForType = (type: string) => {
  switch (type) {
    case 'reminder': return <Bell className="h-4 w-4 text-amber-500" />;
    case 'journal': return <BookOpen className="h-4 w-4 text-purple-500" />;
    case 'daily': return <CalendarDays className="h-4 w-4 text-blue-500" />;
    case 'contact': return <Phone className="h-4 w-4 text-green-500" />;
    case 'emergency': return <AlertTriangle className="h-4 w-4 text-red-500" />;
    case 'hotel': return <Building2 className="h-4 w-4 text-indigo-500" />;
    default: return <FileText className="h-4 w-4 text-slate-500" />;
  }
};

// Strips HTML to extract a plain text preview
const extractPreview = (html: string) => {
  if (!html) return 'New Note';
  const tmp = document.createElement('DIV');
  tmp.innerHTML = html;
  const text = tmp.textContent || tmp.innerText || '';
  return text.trim() ? text.substring(0, 60) + (text.length > 60 ? '...' : '') : 'Empty note';
};

export function NoteSidebarList({ notes, selectedNoteId, onSelect, onDelete }: Props) {
  if (notes.length === 0) {
    return (
      <div className="text-center py-10 px-4 text-muted-foreground">
        <FileText className="h-8 w-8 mx-auto mb-3 opacity-20" />
        <p className="text-sm">No notes found.</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {notes.map(note => {
        const isSelected = note.id === selectedNoteId;
        const isReminder = note.noteType === 'reminder';
        
        return (
          <div 
            key={note.id}
            onClick={() => onSelect(note.id)}
            className={`
              group relative p-3 rounded-xl cursor-pointer transition-all border text-left flex flex-col gap-1.5
              ${isSelected ? 'bg-primary/5 border-primary/20 shadow-sm' : 'bg-card hover:bg-muted/50 border-border'}
              ${isReminder && !isSelected ? 'border-l-4 border-l-amber-500' : ''}
              ${isReminder && isSelected ? 'border-l-4 border-l-amber-500 border-primary/20' : ''}
            `}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {getIconForType(note.noteType)}
                <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  {note.noteType}
                </span>
                {note.linkedDay && (
                  <span className="text-[10px] bg-muted px-1.5 py-0.5 rounded-full font-medium">
                    Day {note.linkedDay}
                  </span>
                )}
              </div>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={(e) => { e.stopPropagation(); onDelete(note.id); }}
                className="opacity-0 group-hover:opacity-100 h-6 w-6 text-muted-foreground hover:text-destructive transition-opacity"
              >
                <Trash2 className="h-3 w-3" />
              </Button>
            </div>
            
            <p className={`text-sm line-clamp-2 ${isSelected ? 'text-foreground' : 'text-muted-foreground'}`}>
              {extractPreview(note.content)}
            </p>
            
            <p className="text-[10px] text-muted-foreground/60 font-medium">
              {formatDistanceToNow(new Date(note.updatedAt), { addSuffix: true })}
            </p>
          </div>
        );
      })}
    </div>
  );
}

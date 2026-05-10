import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import type { NoteType } from '@/types';

export const NOTE_TYPES: { value: NoteType | 'all'; label: string }[] = [
  { value: 'all', label: 'All Notes' },
  { value: 'general', label: 'General' },
  { value: 'journal', label: 'Journal' },
  { value: 'daily', label: 'Daily' },
  { value: 'reminder', label: 'Reminders' },
  { value: 'hotel', label: 'Hotels' },
  { value: 'contact', label: 'Contacts' },
  { value: 'emergency', label: 'Emergency' },
];

interface Props {
  activeType: string;
  onSelect: (type: string) => void;
}

export function NoteTypeFilter({ activeType, onSelect }: Props) {
  return (
    <ScrollArea className="w-full whitespace-nowrap mb-4">
      <div className="flex w-max space-x-2 p-1">
        {NOTE_TYPES.map((type) => (
          <button
            key={type.value}
            onClick={() => onSelect(type.value)}
            className={cn(
              "px-4 py-1.5 rounded-full text-sm font-medium transition-colors border",
              activeType === type.value 
                ? "bg-primary text-primary-foreground border-primary shadow-sm" 
                : "bg-background hover:bg-muted border-input text-muted-foreground"
            )}
          >
            {type.label}
          </button>
        ))}
      </div>
      <ScrollBar orientation="horizontal" className="hidden" />
    </ScrollArea>
  );
}

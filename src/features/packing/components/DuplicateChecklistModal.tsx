import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { tripService } from '@/services/trip.service';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Copy, Loader2 } from 'lucide-react';

interface Props {
  currentTripId: string;
  onDuplicate: (sourceTripId: string) => Promise<void>;
  isDuplicating: boolean;
}

export function DuplicateChecklistModal({ currentTripId, onDuplicate, isDuplicating }: Props) {
  const [open, setOpen] = useState(false);
  const [sourceTripId, setSourceTripId] = useState('');

  const { data: tripsRes, isLoading } = useQuery({
    queryKey: ['trips'],
    queryFn: () => tripService.getTrips(),
  });

  const allTrips = tripsRes?.data || [];
  const otherTrips = allTrips.filter(t => t.id !== currentTripId);

  const handleDuplicate = async () => {
    if (!sourceTripId) return;
    await onDuplicate(sourceTripId);
    setOpen(false);
    setSourceTripId('');
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-full sm:w-auto">
          <Copy className="mr-2 h-4 w-4" /> Copy from past trip
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Duplicate Checklist</DialogTitle>
          <DialogDescription>
            Choose a past trip to copy its packing list over to this trip.
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-4">
          {isLoading ? (
            <div className="flex justify-center p-4"><Loader2 className="h-6 w-6 animate-spin text-muted-foreground" /></div>
          ) : otherTrips.length === 0 ? (
            <p className="text-center text-muted-foreground">No other trips found to copy from.</p>
          ) : (
            <Select value={sourceTripId} onValueChange={setSourceTripId}>
              <SelectTrigger>
                <SelectValue placeholder="Select a trip..." />
              </SelectTrigger>
              <SelectContent>
                {otherTrips.map(t => (
                  <SelectItem key={t.id} value={t.id}>{t.title}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
          <Button onClick={handleDuplicate} disabled={!sourceTripId || isDuplicating}>
            {isDuplicating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Duplicate
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

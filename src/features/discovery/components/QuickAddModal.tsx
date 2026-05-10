'use client';
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { ActivityData } from '@/services/discovery.service';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2, CheckCircle2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Props { open: boolean; onClose: () => void; activity: ActivityData; }

export function QuickAddModal({ open, onClose, activity }: Props) {
  const { toast } = useToast();
  const [selectedTrip, setSelectedTrip] = useState('');
  const [selectedStop, setSelectedStop] = useState('');
  const [saving, setSaving] = useState(false);
  const [done, setDone] = useState(false);

  const { data: tripsData } = useQuery({
    queryKey: ['trips-quick'],
    queryFn: () => fetch('/api/v1/trips?status=active&limit=20').then(r => r.json()),
    enabled: open,
  });

  const { data: stopsData } = useQuery({
    queryKey: ['stops-quick', selectedTrip],
    queryFn: () => fetch(`/api/v1/trips/${selectedTrip}/stops`).then(r => r.json()),
    enabled: !!selectedTrip,
  });

  const trips = tripsData?.success ? tripsData.data : [];
  const stops = stopsData?.success ? stopsData.data : [];

  const handleAdd = async () => {
    if (!selectedStop) return;
    setSaving(true);
    try {
      const res = await fetch(`/api/v1/stops/${selectedStop}/activities`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          activityId: activity.id,
          title: activity.name,
          description: activity.description,
          dayNumber: 1,
          customCost: activity.estimatedCost,
          orderIndex: 0,
        }),
      });
      const json = await res.json();
      if (json.success) {
        setDone(true);
        toast({ title: 'Activity added to itinerary!' });
        setTimeout(() => { setDone(false); setSelectedTrip(''); setSelectedStop(''); onClose(); }, 1500);
      } else {
        toast({ title: 'Failed to add activity', variant: 'destructive' });
      }
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add to Trip</DialogTitle>
          <DialogDescription>Adding: <strong>{activity.name}</strong></DialogDescription>
        </DialogHeader>
        {done ? (
          <div className="py-8 flex flex-col items-center gap-3 text-green-600">
            <CheckCircle2 className="h-12 w-12" />
            <p className="font-medium">Added successfully!</p>
          </div>
        ) : (
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <label className="text-sm font-medium">Select Trip</label>
              <Select value={selectedTrip} onValueChange={(v) => { setSelectedTrip(v); setSelectedStop(''); }}>
                <SelectTrigger><SelectValue placeholder="Choose a trip..." /></SelectTrigger>
                <SelectContent>
                  {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                  {trips.map((t: any) => <SelectItem key={t.id} value={t.id}>{t.title}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            {selectedTrip && (
              <div className="space-y-2">
                <label className="text-sm font-medium">Select Stop</label>
                <Select value={selectedStop} onValueChange={setSelectedStop}>
                  <SelectTrigger><SelectValue placeholder="Choose a stop..." /></SelectTrigger>
                  <SelectContent>
                    {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                  {stops.map((s: any) => <SelectItem key={s.id} value={s.id}>{s.cityName}, {s.countryName}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>
        )}
        {!done && (
          <DialogFooter>
            <Button variant="outline" onClick={onClose}>Cancel</Button>
            <Button onClick={handleAdd} disabled={!selectedStop || saving}>
              {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />} Add Activity
            </Button>
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  );
}

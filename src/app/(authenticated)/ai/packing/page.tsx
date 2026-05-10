'use client';

import { Suspense, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { Backpack, Loader2, ChevronRight, Sparkles, CheckCircle2, Package } from 'lucide-react';
import type { PackingList } from '@/app/api/v1/ai/packing/route';

const CATEGORY_ICONS: Record<string, string> = {
  clothing: '👗',
  electronics: '💻',
  documents: '📄',
  hygiene: '🧴',
  medicine: '💊',
  accessories: '🕶️',
  travel_gear: '🎒',
};

function AiPackingContent() {
  const searchParams = useSearchParams();
  const tripId = searchParams.get('tripId');

  const [destination, setDestination] = useState('');
  const [season, setSeason] = useState('');
  const [duration, setDuration] = useState('7');
  const [travelerType, setTravelerType] = useState('solo');
  const [tripType, setTripType] = useState('city');
  const [specificNeeds, setSpecificNeeds] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<PackingList | null>(null);
  const [isImporting, setIsImporting] = useState(false);
  const [checkedItems, setCheckedItems] = useState<Set<string>>(new Set());

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!destination.trim() || !season.trim()) {
      toast.error('Please enter a destination and season');
      return;
    }
    setIsLoading(true);
    try {
      const res = await fetch('/api/v1/ai/packing', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          destination, season, duration: parseInt(duration),
          travelerType, tripType, specificNeeds: specificNeeds || undefined,
        }),
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.error);
      setResult(data.data);
      setCheckedItems(new Set());
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'AI service failed. Try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleImportToTrip = async () => {
    if (!result || !tripId) return;
    setIsImporting(true);
    try {
      const allItems = result.categories.flatMap(cat =>
        cat.items.map(item => ({ name: item.name, category: cat.category_key }))
      );
      for (const item of allItems) {
        await fetch(`/api/v1/trips/${tripId}/packing`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(item),
        });
      }
      toast.success(`${allItems.length} items imported to your trip!`);
    } catch {
      toast.error('Failed to import items. Try again.');
    } finally {
      setIsImporting(false);
    }
  };

  const toggleItem = (key: string) => {
    setCheckedItems(prev => {
      const next = new Set(prev);
      if (next.has(key)) {
        next.delete(key);
      } else {
        next.add(key);
      }
      return next;
    });
  };

  return (
    <div className="container max-w-3xl py-12 animate-in fade-in zoom-in-95 duration-300 space-y-8">
      <div className="text-center space-y-3">
        <div className="inline-flex items-center justify-center h-16 w-16 rounded-2xl bg-green-500/10 mb-2">
          <Backpack className="h-8 w-8 text-green-600" />
        </div>
        <h1 className="text-4xl font-bold tracking-tight">AI Packing Generator</h1>
        <p className="text-muted-foreground text-lg max-w-md mx-auto">Get a smart, context-aware packing list tailored to your exact destination and trip style.</p>
      </div>

      <form onSubmit={handleSubmit} className="bg-card border rounded-2xl shadow-sm p-6 md:p-8 space-y-5">
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Destination *</label>
            <Input value={destination} onChange={e => setDestination(e.target.value)} placeholder="e.g. Tokyo, Japan" className="bg-muted/30" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Season / Month *</label>
            <Input value={season} onChange={e => setSeason(e.target.value)} placeholder="e.g. Summer, January" className="bg-muted/30" />
          </div>
        </div>

        <div className="grid sm:grid-cols-3 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Duration (days)</label>
            <Input value={duration} onChange={e => setDuration(e.target.value)} type="number" min="1" max="90" className="bg-muted/30" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Traveler Type</label>
            <Select value={travelerType} onValueChange={setTravelerType}>
              <SelectTrigger className="bg-muted/30"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="solo">Solo</SelectItem>
                <SelectItem value="couple">Couple</SelectItem>
                <SelectItem value="family">Family</SelectItem>
                <SelectItem value="group">Group</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Trip Type</label>
            <Select value={tripType} onValueChange={setTripType}>
              <SelectTrigger className="bg-muted/30"><SelectValue /></SelectTrigger>
              <SelectContent>
                {['beach', 'mountain', 'city', 'business', 'adventure', 'cultural', 'wellness'].map(t => (
                  <SelectItem key={t} value={t} className="capitalize">{t}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Special Needs (optional)</label>
          <Input value={specificNeeds} onChange={e => setSpecificNeeds(e.target.value)} placeholder="e.g. Baby items, CPAP machine, photography gear..." className="bg-muted/30" />
        </div>

        <Button type="submit" disabled={isLoading} size="lg" className="w-full h-12 text-base group">
          {isLoading ? <Loader2 className="h-5 w-5 animate-spin mr-2" /> : <Sparkles className="h-5 w-5 mr-2 group-hover:rotate-12 transition-transform" />}
          Generate Packing List
          {!isLoading && <ChevronRight className="h-4 w-4 ml-2 opacity-60" />}
        </Button>
      </form>

      {result && (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold flex items-center gap-2"><Package className="h-5 w-5 text-green-600" />Your Packing List</h2>
              <p className="text-sm text-muted-foreground">{result.total_items} items across {result.categories.length} categories</p>
            </div>
            {tripId && (
              <Button onClick={handleImportToTrip} disabled={isImporting} variant="secondary">
                {isImporting ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <CheckCircle2 className="h-4 w-4 mr-2" />}
                Import to Trip
              </Button>
            )}
          </div>

          <div className="space-y-4">
            {result.categories.map((cat) => (
              <div key={cat.name} className="bg-card border rounded-2xl shadow-sm overflow-hidden">
                <div className="bg-muted/40 px-5 py-3 flex items-center justify-between border-b">
                  <h3 className="font-semibold flex items-center gap-2">
                    <span>{CATEGORY_ICONS[cat.category_key] || '📦'}</span>
                    {cat.name}
                  </h3>
                  <Badge variant="secondary">{cat.items.length} items</Badge>
                </div>
                <div className="p-4 grid sm:grid-cols-2 gap-2">
                  {cat.items.map((item, i) => {
                    const key = `${cat.category_key}-${i}`;
                    const checked = checkedItems.has(key);
                    return (
                      <div key={key} className={`flex items-center gap-3 p-2 rounded-lg transition-all ${checked ? 'opacity-50' : ''}`}>
                        <Checkbox checked={checked} onCheckedChange={() => toggleItem(key)} id={key} className="h-4 w-4" />
                        <label htmlFor={key} className={`text-sm cursor-pointer flex-1 flex items-center justify-between ${checked ? 'line-through text-muted-foreground' : ''}`}>
                          <span>{item.name}{item.quantity && item.quantity > 1 ? ` ×${item.quantity}` : ''}</span>
                          {item.essential && <Badge variant="outline" className="text-[9px] h-4 border-primary/30 text-primary ml-2 shrink-0">Essential</Badge>}
                        </label>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          {result.destination_tips.length > 0 && (
            <div className="bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-800/30 border rounded-2xl p-5 space-y-2">
              <h3 className="font-semibold text-blue-700 dark:text-blue-400">🧭 Destination Tips</h3>
              <ul className="space-y-1.5">
                {result.destination_tips.map((tip, i) => (
                  <li key={i} className="text-sm text-blue-700/80 dark:text-blue-400/80 flex gap-2"><span>•</span>{tip}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function AiPackingPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center min-h-[400px]"><Loader2 className="h-8 w-8 animate-spin text-green-600" /></div>}>
      <AiPackingContent />
    </Suspense>
  );
}

'use client';

import { useState } from 'react';
import { useTrip } from '@/features/trips/hooks/useTrip';
import { usePacking } from '@/features/packing/hooks/usePacking';
import { usePackingMutations } from '@/features/packing/hooks/usePackingMutations';
import { DashboardSkeleton } from '@/features/dashboard/components/DashboardSkeleton';
import { PackingProgress } from '@/features/packing/components/PackingProgress';
import { AddItemForm } from '@/features/packing/components/AddItemForm';
import { PackingCategoryList } from '@/features/packing/components/PackingCategoryList';
import { DuplicateChecklistModal } from '@/features/packing/components/DuplicateChecklistModal';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Sparkles, Loader2, ListChecks } from 'lucide-react';
import { toast } from 'sonner';

export default function PackingPage({ params }: { params: { tripId: string } }) {
  const { tripId } = params;
  const { trip, isLoading: isTripLoading } = useTrip(tripId);
  const { items, isLoading: isPackingLoading } = usePacking(tripId);
  const { 
    addItem, isAdding, 
    updateItem, 
    deleteItem, 
    resetChecklist, 
    duplicateChecklist, isDuplicating 
  } = usePackingMutations(tripId);

  const [isGenerating, setIsGenerating] = useState(false);

  if (isTripLoading || isPackingLoading) {
    return <div className="container max-w-5xl py-8"><DashboardSkeleton /></div>;
  }

  if (!trip) {
    return <div className="container py-20 text-center">Trip not found</div>;
  }

  const handleToggle = (itemId: string, packed: boolean) => {
    updateItem({ itemId, data: { packed } });
  };

  const handleGenerateAI = async () => {
    setIsGenerating(true);
    // STUB: This will call M13 AI endpoint
    // For now, we simulate a delay and show a toast
    setTimeout(() => {
      setIsGenerating(false);
      toast.info('AI Generation will be available in the next release (M13).');
    }, 1500);
  };

  return (
    <div className="container max-w-5xl py-8 animate-in fade-in zoom-in-95 duration-300 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href={`/trips/${trip.id}`}><ArrowLeft className="h-5 w-5" /></Link>
          </Button>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Packing Checklist</h1>
            <p className="text-muted-foreground">{trip.title}</p>
          </div>
        </div>
        
        <div className="flex items-center gap-3 w-full md:w-auto">
          <DuplicateChecklistModal 
            currentTripId={tripId} 
            onDuplicate={async (sourceId) => { await duplicateChecklist(sourceId); }} 
            isDuplicating={isDuplicating} 
          />
          <Button 
            onClick={handleGenerateAI} 
            disabled={isGenerating}
            className="w-full md:w-auto bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 hover:opacity-90 transition-opacity border-0"
          >
            {isGenerating ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
            Generate with AI
          </Button>
        </div>
      </div>

      <PackingProgress items={items} onReset={resetChecklist} />

      <div className="space-y-6">
        <AddItemForm onAdd={async (data) => { await addItem(data); }} isAdding={isAdding} />
        
        {items.length === 0 ? (
          <div className="text-center py-20 border-2 border-dashed rounded-2xl bg-card">
            <div className="flex justify-center mb-4"><ListChecks className="h-10 w-10 text-muted-foreground" /></div>
            <p className="text-xl font-semibold mb-2">Your checklist is empty</p>
            <p className="text-muted-foreground max-w-sm mx-auto">
              Add items manually using the form above, copy from a past trip, or let our AI generate a customized packing list for your trip.
            </p>
          </div>
        ) : (
          <PackingCategoryList 
            items={items} 
            onToggle={handleToggle} 
            onDelete={deleteItem} 
          />
        )}
      </div>

    </div>
  );
}

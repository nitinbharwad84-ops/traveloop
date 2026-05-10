import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { PackingItemData } from '@/services/packing.service';
import { RotateCcw } from 'lucide-react';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';

interface Props {
  items: PackingItemData[];
  onReset: () => void;
}

export function PackingProgress({ items, onReset }: Props) {
  const total = items.length;
  const packed = items.filter(i => i.packed).length;
  const percentage = total === 0 ? 0 : Math.round((packed / total) * 100);

  if (total === 0) return null;

  return (
    <div className="bg-card p-6 rounded-2xl border shadow-sm space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-semibold text-lg tracking-tight">Packing Progress</h3>
          <p className="text-sm text-muted-foreground">{packed} of {total} items packed</p>
        </div>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
              <RotateCcw className="h-4 w-4 mr-2" /> Reset
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Reset Checklist?</AlertDialogTitle>
              <AlertDialogDescription>
                This will uncheck all {packed} packed items. Are you sure you want to start over?
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={onReset}>Reset Checklist</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
      <Progress value={percentage} className="h-3" />
    </div>
  );
}

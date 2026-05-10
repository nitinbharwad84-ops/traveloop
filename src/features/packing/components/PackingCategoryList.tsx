import { PackingItemData } from '@/services/packing.service';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

interface Props {
  items: PackingItemData[];
  onToggle: (itemId: string, packed: boolean) => void;
  onDelete: (itemId: string) => void;
}

export function PackingCategoryList({ items, onToggle, onDelete }: Props) {
  // Group items by category
  const groupedItems = items.reduce((acc, item) => {
    const cat = item.category || 'uncategorized';
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(item);
    return acc;
  }, {} as Record<string, PackingItemData[]>);

  const categories = Object.keys(groupedItems).sort();

  if (categories.length === 0) return null;

  return (
    <Accordion type="multiple" defaultValue={categories} className="space-y-4">
      {categories.map(category => {
        const catItems = groupedItems[category] || [];
        const packedCount = catItems.filter(i => i.packed).length;
        
        return (
          <AccordionItem key={category} value={category} className="bg-card border rounded-2xl px-6">
            <AccordionTrigger className="hover:no-underline py-4">
              <div className="flex justify-between items-center w-full pr-4">
                <span className="font-semibold capitalize text-lg tracking-tight">
                  {category.replace('_', ' ')}
                </span>
                <span className="text-sm font-normal text-muted-foreground bg-muted px-2.5 py-0.5 rounded-full">
                  {packedCount}/{catItems.length}
                </span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="pt-0 pb-4 space-y-1">
              {catItems.map(item => (
                <div 
                  key={item.id} 
                  className="group flex items-center justify-between p-3 rounded-xl hover:bg-muted/50 transition-colors"
                >
                  <label className="flex items-center gap-3 cursor-pointer flex-1">
                    <Checkbox 
                      checked={item.packed} 
                      onCheckedChange={(checked: boolean | 'indeterminate') => onToggle(item.id, !!checked)}
                      className="h-5 w-5 rounded-md"
                    />
                    <span className={`text-base select-none transition-all ${item.packed ? 'line-through text-muted-foreground' : 'text-foreground'}`}>
                      {item.name}
                    </span>
                  </label>
                  
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => onDelete(item.id)}
                    className="opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-destructive h-8 w-8"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </AccordionContent>
          </AccordionItem>
        );
      })}
    </Accordion>
  );
}

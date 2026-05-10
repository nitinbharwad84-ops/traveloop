import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus } from 'lucide-react';

const CATEGORIES = [
  'clothing',
  'electronics',
  'documents',
  'hygiene',
  'medicine',
  'accessories',
  'travel_gear'
];

interface Props {
  onAdd: (data: { name: string; category: string }) => Promise<void>;
  isAdding: boolean;
}

export function AddItemForm({ onAdd, isAdding }: Props) {
  const [name, setName] = useState('');
  const [category, setCategory] = useState('clothing');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    await onAdd({ name, category });
    setName('');
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 items-center bg-card p-2 rounded-xl border shadow-sm">
      <Input 
        placeholder="Add a new item..." 
        value={name} 
        onChange={e => setName(e.target.value)} 
        className="border-0 focus-visible:ring-0 shadow-none bg-transparent"
      />
      <Select value={category} onValueChange={setCategory}>
        <SelectTrigger className="w-[140px] border-0 focus:ring-0 shadow-none bg-muted/50 rounded-lg">
          <SelectValue placeholder="Category" />
        </SelectTrigger>
        <SelectContent>
          {CATEGORIES.map(cat => (
            <SelectItem key={cat} value={cat} className="capitalize">{cat.replace('_', ' ')}</SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Button type="submit" size="icon" disabled={!name.trim() || isAdding} className="rounded-lg shrink-0">
        <Plus className="h-5 w-5" />
      </Button>
    </form>
  );
}

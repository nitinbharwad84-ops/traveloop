'use client';

import { TrendingUp, Clock, Flame } from 'lucide-react';

const SORT_OPTIONS = [
  { key: 'recent', label: 'Recent', icon: Clock },
  { key: 'popular', label: 'Popular', icon: TrendingUp },
  { key: 'trending', label: 'Trending', icon: Flame },
];

interface FeedSortProps {
  value: string;
  onChange: (sort: string) => void;
}

export function FeedSort({ value, onChange }: FeedSortProps) {
  return (
    <div className="flex gap-2 bg-muted/40 p-1 rounded-xl w-fit">
      {SORT_OPTIONS.map(({ key, label, icon: Icon }) => (
        <button
          key={key}
          onClick={() => onChange(key)}
          className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-sm font-medium transition-all ${
            value === key
              ? 'bg-background text-foreground shadow-sm'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          <Icon className="h-3.5 w-3.5" />
          {label}
        </button>
      ))}
    </div>
  );
}

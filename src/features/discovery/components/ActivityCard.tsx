'use client';
import { useState } from 'react';
import { ActivityData } from '@/services/discovery.service';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Clock, DollarSign, Star, Plus } from 'lucide-react';
import { QuickAddModal } from './QuickAddModal';

const CATEGORY_COLORS: Record<string, string> = {
  sightseeing: 'bg-blue-100 text-blue-700',
  cultural: 'bg-purple-100 text-purple-700',
  nightlife: 'bg-pink-100 text-pink-700',
  food: 'bg-orange-100 text-orange-700',
  adventure: 'bg-red-100 text-red-700',
  shopping: 'bg-yellow-100 text-yellow-700',
  family: 'bg-green-100 text-green-700',
  nature: 'bg-emerald-100 text-emerald-700',
  wellness: 'bg-teal-100 text-teal-700',
  local_experiences: 'bg-indigo-100 text-indigo-700',
};

export function ActivityCard({ activity }: { activity: ActivityData }) {
  const [addOpen, setAddOpen] = useState(false);
  const colorClass = activity.category ? (CATEGORY_COLORS[activity.category] || 'bg-gray-100 text-gray-700') : 'bg-gray-100 text-gray-700';

  return (
    <Card className="group hover:shadow-lg transition-all duration-300 border-primary/10">
      <CardContent className="p-5">
        <div className="flex flex-col h-full gap-3">
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1">
              {activity.category && (
                <Badge className={`text-xs mb-2 capitalize ${colorClass}`}>
                  {activity.category.replace('_', ' ')}
                </Badge>
              )}
              <h3 className="font-semibold text-base leading-tight">{activity.name}</h3>
            </div>
          </div>
          {activity.description && (
            <p className="text-sm text-muted-foreground line-clamp-2">{activity.description}</p>
          )}
          <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground mt-auto">
            {activity.estimatedCost != null && (
              <span className="flex items-center gap-1">
                <DollarSign className="h-3.5 w-3.5" />${Number(activity.estimatedCost).toFixed(0)}
              </span>
            )}
            {activity.estimatedDuration && (
              <span className="flex items-center gap-1">
                <Clock className="h-3.5 w-3.5" />{activity.estimatedDuration}min
              </span>
            )}
            {activity.rating && (
              <span className="flex items-center gap-1 text-yellow-600">
                <Star className="h-3.5 w-3.5 fill-current" />{Number(activity.rating).toFixed(1)}
              </span>
            )}
          </div>
          <Button size="sm" className="w-full mt-2 gap-1" onClick={() => setAddOpen(true)}>
            <Plus className="h-4 w-4" /> Add to Trip
          </Button>
        </div>
      </CardContent>
      <QuickAddModal open={addOpen} onClose={() => setAddOpen(false)} activity={activity} />
    </Card>
  );
}

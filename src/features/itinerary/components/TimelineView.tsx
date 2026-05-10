'use client';

import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragEndEvent } from '@dnd-kit/core';
import { SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { restrictToVerticalAxis, restrictToWindowEdges } from '@dnd-kit/modifiers';
import { TripStopData } from '@/services/itinerary.service';
import { SortableStopItem } from './SortableStopItem';

interface TimelineViewProps {
  stops: TripStopData[];
  tripId: string;
  onReorder: (activeId: string, overId: string) => void;
  onEditStop: (stop: TripStopData) => void;
  onDeleteStop: (stopId: string) => void;
  onAddActivity: (stopId: string, data: unknown) => Promise<void>;
  onUpdateActivity: (activityId: string, data: unknown) => Promise<void>;
  isAddingActivity: boolean;
}

export function TimelineView({ 
  stops, 
  tripId, 
  onReorder,
  onEditStop,
  onDeleteStop,
  onAddActivity,
  onUpdateActivity,
  isAddingActivity
}: TimelineViewProps) {
  
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      onReorder(active.id as string, over.id as string);
    }
  };

  if (stops.length === 0) {
    return (
      <div className="text-center py-20 border-2 border-dashed rounded-2xl bg-muted/10">
        <h3 className="text-xl font-semibold mb-2">Your itinerary is empty</h3>
        <p className="text-muted-foreground mb-6">Add your first destination to start planning.</p>
      </div>
    );
  }

  return (
    <div className="py-4">
      <DndContext 
        sensors={sensors} 
        collisionDetection={closestCenter} 
        onDragEnd={handleDragEnd}
        modifiers={[restrictToVerticalAxis, restrictToWindowEdges]}
      >
        <SortableContext items={stops.map(s => s.id)} strategy={verticalListSortingStrategy}>
          <div className="relative group/stop">
            {stops.map(stop => (
              <SortableStopItem 
                key={stop.id} 
                stop={stop} 
                onEditStop={onEditStop}
                onDeleteStop={onDeleteStop}
                onAddActivity={(data) => onAddActivity(stop.id, data)}
                onUpdateActivity={onUpdateActivity}
                isAddingActivity={isAddingActivity}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>
    </div>
  );
}

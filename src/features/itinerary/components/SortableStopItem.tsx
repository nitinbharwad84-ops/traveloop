/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { TripStopData } from '@/services/itinerary.service';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { GripVertical, Clock, DollarSign, Calendar, Edit2, Trash2 } from 'lucide-react';
import { format } from 'date-fns';
import { ActivityModal } from './ActivityModal';
import { Button } from '@/components/ui/button';

interface SortableStopItemProps {
  stop: TripStopData;
  onEditStop?: (stop: TripStopData) => void;
  onDeleteStop?: (stopId: string) => void;
  onEditActivity?: (activityId: string) => void;
  onDeleteActivity?: (activityId: string) => void;
  onAddActivity: (data: any) => Promise<void>;
  onUpdateActivity: (activityId: string, data: any) => Promise<void>;
  isAddingActivity: boolean;
}

export function SortableStopItem({ 
  stop, 
  onEditStop,
  onDeleteStop,
  onAddActivity,
  onUpdateActivity,
  isAddingActivity
}: SortableStopItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: stop.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 10 : 1,
    opacity: isDragging ? 0.4 : 1,
  };

  const datesStr = stop.arrivalDate && stop.departureDate 
    ? `${format(new Date(stop.arrivalDate), 'MMM d')} - ${format(new Date(stop.departureDate), 'MMM d')}` 
    : stop.arrivalDate ? format(new Date(stop.arrivalDate), 'MMM d') 
    : 'No dates set';

  return (
    <div ref={setNodeRef} style={style} className="relative pl-8 sm:pl-12">
      {/* Timeline connector line */}
      <div className="absolute left-[15px] sm:left-[23px] top-6 bottom-[-24px] w-0.5 bg-border group-last/stop:hidden" />
      
      {/* Timeline dot */}
      <div className="absolute left-2 sm:left-4 top-5 h-4 w-4 rounded-full bg-primary ring-4 ring-background z-10" />

      <Card className="mb-6 hover:border-primary/30 transition-colors">
        <CardContent className="p-0">
          <div className="p-4 sm:p-5 flex flex-col sm:flex-row gap-4 group">
            
            {/* Drag Handle */}
            <div 
              {...attributes} 
              {...listeners} 
              className="hidden sm:flex items-center justify-center cursor-grab active:cursor-grabbing text-muted-foreground hover:text-foreground p-1 -ml-2"
            >
              <GripVertical className="h-5 w-5" />
            </div>

            <div className="flex-1 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-xl font-bold">{stop.cityName}</h3>
                    <Badge variant="outline">{stop.countryName}</Badge>
                  </div>
                  <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1"><Calendar className="h-3.5 w-3.5" /> {datesStr}</div>
                    {stop.estimatedTransportTime && <div className="flex items-center gap-1"><Clock className="h-3.5 w-3.5" /> {stop.estimatedTransportTime}h travel</div>}
                    {stop.estimatedTransportCost && <div className="flex items-center gap-1"><DollarSign className="h-3.5 w-3.5" /> {stop.estimatedTransportCost}</div>}
                  </div>
                  {stop.notes && <p className="text-sm mt-2 text-muted-foreground">{stop.notes}</p>}
                </div>
                
                <div className="flex items-center gap-1 opacity-100 sm:opacity-0 group-hover:opacity-100 transition-opacity">
                  {onEditStop && (
                    <Button variant="ghost" size="icon" onClick={() => onEditStop(stop)}>
                      <Edit2 className="h-4 w-4" />
                    </Button>
                  )}
                  {onDeleteStop && (
                    <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive" onClick={() => onDeleteStop(stop.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>

              {/* Activities */}
              {stop.tripActivities.length > 0 ? (
                <div className="space-y-3 mt-4">
                  {stop.tripActivities.map((activity) => (
                    <div key={activity.id} className="bg-muted/40 p-3 rounded-lg border group/act">
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="font-medium text-sm">{activity.title}</h4>
                            <Badge variant="secondary" className="text-[10px] px-1.5 py-0">Day {activity.dayNumber}</Badge>
                          </div>
                          {(activity.timeSlot || activity.customCost) && (
                            <div className="flex items-center gap-3 text-xs text-muted-foreground mt-1">
                              {activity.timeSlot && <span>{activity.timeSlot}</span>}
                              {activity.customCost && <span>Cost: {activity.customCost}</span>}
                            </div>
                          )}
                          {activity.description && <p className="text-xs text-muted-foreground mt-1.5">{activity.description}</p>}
                        </div>
                        <div className="flex opacity-0 group-hover/act:opacity-100 transition-opacity">
                          <ActivityModal 
                            initialData={activity}
                            isSaving={false}
                            onSave={async (data) => onUpdateActivity(activity.id, data)}
                            trigger={<Button variant="ghost" size="icon" className="h-7 w-7"><Edit2 className="h-3 w-3" /></Button>}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                  <ActivityModal 
                    isSaving={isAddingActivity}
                    onSave={onAddActivity}
                    defaultDay={stop.tripActivities.length > 0 ? (stop.tripActivities[stop.tripActivities.length - 1]?.dayNumber || 1) : 1}
                  />
                </div>
              ) : (
                <div className="mt-4 border-2 border-dashed rounded-lg p-6 text-center text-muted-foreground">
                  <p className="text-sm mb-3">No activities planned for this stop.</p>
                  <ActivityModal isSaving={isAddingActivity} onSave={onAddActivity} />
                </div>
              )}

            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

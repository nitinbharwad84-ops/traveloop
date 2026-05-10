'use client';

import { useMemo } from 'react';
import { TripStopData, TripActivityData } from '@/services/itinerary.service';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MapPin, Clock } from 'lucide-react';

interface DayViewProps {
  stops: TripStopData[];
}

export function DayView({ stops }: DayViewProps) {
  
  // Group all activities by Day Number
  const daysMap = useMemo(() => {
    const map = new Map<number, { stopCity: string; activities: TripActivityData[] }[]>();
    
    stops.forEach(stop => {
      stop.tripActivities.forEach(act => {
        const existing = map.get(act.dayNumber) || [];
        // Check if we already have a group for this stop on this day
        let stopGroup = existing.find(g => g.stopCity === stop.cityName);
        if (!stopGroup) {
          stopGroup = { stopCity: stop.cityName, activities: [] };
          existing.push(stopGroup);
        }
        stopGroup.activities.push(act);
        map.set(act.dayNumber, existing);
      });
    });

    // Sort days
    const sortedDays = Array.from(map.entries()).sort(([dayA], [dayB]) => dayA - dayB);
    return sortedDays;
  }, [stops]);

  if (stops.length === 0 || daysMap.length === 0) {
    return (
      <div className="text-center py-20 border-2 border-dashed rounded-2xl bg-muted/10">
        <h3 className="text-xl font-semibold mb-2">No activities scheduled</h3>
        <p className="text-muted-foreground">Add activities to your stops to see your daily schedule.</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 py-4">
      {daysMap.map(([dayNumber, stopGroups]) => (
        <Card key={dayNumber} className="overflow-hidden border-primary/10 shadow-sm">
          <CardHeader className="bg-muted/30 pb-4">
            <CardTitle className="flex items-center gap-2">
              <Badge variant="default" className="text-sm px-3 py-1">Day {dayNumber}</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {stopGroups.map((group, idx) => (
              <div key={idx} className="p-6 border-b last:border-0">
                <div className="flex items-center gap-2 text-primary font-medium mb-4">
                  <MapPin className="h-4 w-4" /> {group.stopCity}
                </div>
                
                <div className="space-y-4 pl-6 relative">
                  <div className="absolute left-2.5 top-2 bottom-2 w-0.5 bg-border rounded-full" />
                  
                  {group.activities.sort((a,b) => a.orderIndex - b.orderIndex).map((act) => (
                    <div key={act.id} className="relative">
                      <div className="absolute -left-[27px] top-1.5 h-3 w-3 bg-background border-2 border-primary rounded-full" />
                      <div className="bg-card border rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                          <h4 className="font-semibold text-lg">{act.title}</h4>
                          {act.timeSlot && (
                            <Badge variant="secondary" className="flex items-center gap-1 font-normal w-fit">
                              <Clock className="h-3 w-3" /> {act.timeSlot}
                            </Badge>
                          )}
                        </div>
                        {act.description && <p className="text-muted-foreground text-sm">{act.description}</p>}
                        {act.customCost && <p className="text-sm font-medium mt-2">Cost: ${act.customCost}</p>}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

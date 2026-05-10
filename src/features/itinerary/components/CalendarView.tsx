'use client';

import { TripStopData } from '@/services/itinerary.service';
import { Calendar as CalendarPrimitive } from '@/components/ui/calendar';
import { Card, CardContent } from '@/components/ui/card';

interface CalendarViewProps {
  stops: TripStopData[];
}

export function CalendarView({ stops }: CalendarViewProps) {
  
  // Extract dates that have stops
  const datesWithStops = stops.reduce((acc, stop) => {
    if (stop.arrivalDate) acc.push(new Date(stop.arrivalDate));
    if (stop.departureDate) acc.push(new Date(stop.departureDate));
    return acc;
  }, [] as Date[]);

  const defaultMonth = datesWithStops.length > 0 ? datesWithStops[0] : new Date();

  return (
    <div className="grid md:grid-cols-2 gap-8 py-4">
      <Card className="shadow-sm border-primary/10">
        <CardContent className="p-6 flex justify-center">
          <CalendarPrimitive
            mode="multiple"
            selected={datesWithStops}
            defaultMonth={defaultMonth}
            className="rounded-md border p-4 w-full flex justify-center bg-card"
            modifiersClassNames={{
              selected: "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
            }}
          />
        </CardContent>
      </Card>
      
      <div className="space-y-4">
        <h3 className="text-lg font-bold">Trip Schedule</h3>
        {stops.length === 0 ? (
          <p className="text-muted-foreground text-sm">No dates scheduled.</p>
        ) : (
          <div className="space-y-3">
            {stops.map(stop => (
              <div key={stop.id} className="p-4 rounded-xl border bg-card">
                <h4 className="font-semibold text-primary">{stop.cityName}</h4>
                <p className="text-sm text-muted-foreground mt-1">
                  {stop.arrivalDate ? new Date(stop.arrivalDate).toLocaleDateString() : 'TBD'} 
                  {' → '} 
                  {stop.departureDate ? new Date(stop.departureDate).toLocaleDateString() : 'TBD'}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

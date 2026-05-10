'use client';

import { format, differenceInDays } from 'date-fns';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Calendar, MapPin, Activity, Wallet } from 'lucide-react';
import { TripData } from '@/services/trip.service';
import { TripStopData } from '@/services/itinerary.service';

interface TripSummarySidebarProps {
  trip: TripData;
  stops: TripStopData[];
}

export function TripSummarySidebar({ trip, stops }: TripSummarySidebarProps) {
  const totalDays = trip.startDate && trip.endDate 
    ? Math.max(1, differenceInDays(new Date(trip.endDate), new Date(trip.startDate)) + 1)
    : 0;

  const totalStops = stops.length;
  
  const totalActivities = stops.reduce((acc, stop) => acc + stop.tripActivities.length, 0);

  const totalTransportCost = stops.reduce((acc, stop) => acc + (stop.estimatedTransportCost || 0), 0);
  const totalActivityCost = stops.reduce((acc, stop) => 
    acc + stop.tripActivities.reduce((a, act) => a + (act.customCost || 0), 0)
  , 0);
  
  const totalEstimatedCost = totalTransportCost + totalActivityCost;

  return (
    <Card className="sticky top-6 border-primary/10 shadow-lg print:hidden">
      <CardHeader className="bg-muted/30 rounded-t-xl pb-4">
        <CardTitle className="text-lg">Trip Summary</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="p-4 space-y-4">
          
          <div className="flex items-start gap-3">
            <div className="p-2 bg-primary/10 text-primary rounded-lg"><Calendar className="h-4 w-4" /></div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Dates</p>
              <p className="font-semibold text-sm">
                {trip.startDate ? format(new Date(trip.startDate), 'MMM d, yyyy') : 'TBD'}
                {trip.endDate && trip.startDate && ` - ${format(new Date(trip.endDate), 'MMM d, yyyy')}`}
              </p>
              {totalDays > 0 && <p className="text-xs text-muted-foreground mt-0.5">{totalDays} days total</p>}
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="p-2 bg-primary/10 text-primary rounded-lg"><MapPin className="h-4 w-4" /></div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Destinations</p>
              <p className="font-semibold text-sm">{totalStops} Stops</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="p-2 bg-primary/10 text-primary rounded-lg"><Activity className="h-4 w-4" /></div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Activities</p>
              <p className="font-semibold text-sm">{totalActivities} Planned</p>
            </div>
          </div>

        </div>

        <Separator />

        <div className="p-4 bg-muted/20">
          <div className="flex items-center gap-2 mb-2">
            <Wallet className="h-4 w-4 text-primary" />
            <span className="font-medium text-sm">Estimated Cost</span>
          </div>
          <div className="space-y-1 text-sm">
            <div className="flex justify-between text-muted-foreground">
              <span>Transport</span>
              <span>{trip.currency} {totalTransportCost.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-muted-foreground">
              <span>Activities</span>
              <span>{trip.currency} {totalActivityCost.toLocaleString()}</span>
            </div>
            <div className="flex justify-between font-bold pt-2 mt-2 border-t">
              <span>Total</span>
              <span className="text-primary">{trip.currency} {totalEstimatedCost.toLocaleString()}</span>
            </div>
          </div>

          {trip.budgetTarget && (
            <div className="mt-4 pt-4 border-t">
              <div className="flex justify-between text-xs mb-1">
                <span className="text-muted-foreground">Budget</span>
                <span className="font-medium">{trip.currency} {Number(trip.budgetTarget).toLocaleString()}</span>
              </div>
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <div 
                  className={`h-full ${totalEstimatedCost > Number(trip.budgetTarget) ? 'bg-destructive' : 'bg-primary'}`} 
                  style={{ width: `${Math.min(100, (totalEstimatedCost / Number(trip.budgetTarget)) * 100)}%` }}
                />
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

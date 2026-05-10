'use client';

import React from 'react';
import { TripStopData } from '@/services/itinerary.service';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { format } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import { ActivityModal } from './ActivityModal';
import { Button } from '@/components/ui/button';
import { Edit2 } from 'lucide-react';

interface ListViewProps {
  stops: TripStopData[];
  onEditStop: (stop: TripStopData) => void;
  onDeleteStop: (stopId: string) => void;
  onAddActivity: (stopId: string, data: any) => Promise<void>;
  onUpdateActivity: (activityId: string, data: any) => Promise<void>;
  isAddingActivity: boolean;
}

export function ListView({ stops, onEditStop, onDeleteStop, onAddActivity, onUpdateActivity, isAddingActivity }: ListViewProps) {
  if (stops.length === 0) {
    return (
      <div className="text-center py-20 border-2 border-dashed rounded-2xl bg-muted/10">
        <h3 className="text-xl font-semibold mb-2">No stops added yet</h3>
        <p className="text-muted-foreground">Switch to timeline view to add stops.</p>
      </div>
    );
  }

  return (
    <div className="rounded-xl border bg-card overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/50 hover:bg-muted/50">
            <TableHead className="w-[30%]">Destination / Activity</TableHead>
            <TableHead>Dates / Time</TableHead>
            <TableHead>Cost</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {stops.map((stop) => (
            <React.Fragment key={stop.id}>
              {/* Stop Row */}
              <TableRow className="bg-muted/20 border-b-primary/10">
                <TableCell className="font-semibold text-base py-4">
                  <div className="flex items-center gap-2">
                    {stop.cityName} <Badge variant="outline" className="text-[10px]">{stop.countryName}</Badge>
                  </div>
                </TableCell>
                <TableCell className="text-muted-foreground text-sm py-4">
                  {stop.arrivalDate && stop.departureDate 
                    ? `${format(new Date(stop.arrivalDate), 'MMM d')} - ${format(new Date(stop.departureDate), 'MMM d')}` 
                    : stop.arrivalDate ? format(new Date(stop.arrivalDate), 'MMM d') : '-'}
                </TableCell>
                <TableCell className="text-sm py-4">
                  {stop.estimatedTransportCost ? `$${stop.estimatedTransportCost}` : '-'}
                </TableCell>
                <TableCell className="text-right py-4 space-x-2">
                  <Button variant="ghost" size="sm" onClick={() => onEditStop(stop)}>Edit</Button>
                  <Button variant="ghost" size="sm" className="text-destructive" onClick={() => onDeleteStop(stop.id)}>Delete</Button>
                </TableCell>
              </TableRow>

              {/* Activity Rows */}
              {stop.tripActivities.map((activity) => (
                <TableRow key={activity.id} className="border-b-0 hover:bg-muted/10">
                  <TableCell className="pl-12">
                    <div className="font-medium text-sm">{activity.title}</div>
                    {activity.description && <div className="text-xs text-muted-foreground truncate max-w-[200px]">{activity.description}</div>}
                  </TableCell>
                  <TableCell className="text-sm">
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary" className="text-[10px]">Day {activity.dayNumber}</Badge>
                      <span className="text-muted-foreground">{activity.timeSlot || '-'}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-sm">
                    {activity.customCost ? `$${activity.customCost}` : '-'}
                  </TableCell>
                  <TableCell className="text-right">
                    <ActivityModal 
                      initialData={activity}
                      isSaving={false}
                      onSave={async (data) => onUpdateActivity(activity.id, data)}
                      trigger={<Button variant="ghost" size="icon" className="h-7 w-7"><Edit2 className="h-3 w-3" /></Button>}
                    />
                  </TableCell>
                </TableRow>
              ))}

              <TableRow className="border-b">
                <TableCell colSpan={4} className="pl-12 py-2">
                  <ActivityModal 
                    isSaving={isAddingActivity}
                    onSave={(data) => onAddActivity(stop.id, data)}
                    trigger={<Button variant="ghost" size="sm" className="text-xs h-7 border-dashed border">Add Activity</Button>}
                  />
                </TableCell>
              </TableRow>
            </React.Fragment>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

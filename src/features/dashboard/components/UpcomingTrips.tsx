'use client';

import { motion } from 'framer-motion';
import { TripData } from '@/services/trip.service';
import { TripCard } from './TripCard';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';

interface UpcomingTripsProps {
  trips: TripData[];
}

export function UpcomingTrips({ trips }: UpcomingTripsProps) {
  if (!trips || trips.length === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="space-y-4"
    >
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold tracking-tight">Upcoming Trips</h2>
      </div>
      
      <ScrollArea className="w-full whitespace-nowrap pb-4">
        <div className="flex w-max space-x-4 p-1">
          {trips.map((trip) => (
            <div key={trip.id} className="w-[280px] sm:w-[320px] shrink-0">
              <TripCard trip={trip} />
            </div>
          ))}
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </motion.div>
  );
}

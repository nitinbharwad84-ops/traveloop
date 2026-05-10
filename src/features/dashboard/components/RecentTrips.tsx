'use client';

import { motion } from 'framer-motion';
import { TripData } from '@/services/trip.service';
import { TripCard } from './TripCard';

interface RecentTripsProps {
  trips: TripData[];
}

export function RecentTrips({ trips }: RecentTripsProps) {
  if (!trips || trips.length === 0) return null;

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold tracking-tight">Recent Trips</h2>
      </div>
      <motion.div 
        variants={container}
        initial="hidden"
        animate="show"
        className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
      >
        {trips.map((trip) => (
          <motion.div key={trip.id} variants={item} className="h-full">
            <TripCard trip={trip} />
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}

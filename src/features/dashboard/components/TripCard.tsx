'use client';

import Link from 'next/link';
import { format } from 'date-fns';
import { motion } from 'framer-motion';
import { MapPin, Users, Calendar } from 'lucide-react';
import { TripData } from '@/services/trip.service';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { ROUTES } from '@/constants';

interface TripCardProps {
  trip: TripData;
}

export function TripCard({ trip }: TripCardProps) {
  const isUpcoming = trip.startDate && new Date(trip.startDate) > new Date();
  
  return (
    <motion.div
      whileHover={{ y: -5 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      className="h-full"
    >
      <Link href={ROUTES.TRIP_DETAIL(trip.id)} className="block h-full focus:outline-none focus:ring-2 focus:ring-primary rounded-xl">
        <Card className="h-full overflow-hidden flex flex-col border-muted/60 shadow-sm hover:shadow-md transition-all duration-300">
          <div className="relative h-40 w-full bg-muted/30 overflow-hidden">
            {trip.coverImageUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img 
                src={trip.coverImageUrl} 
                alt={trip.title} 
                className="object-cover w-full h-full hover:scale-105 transition-transform duration-500"
              />
            ) : (
              <div className="flex items-center justify-center w-full h-full bg-primary/5 text-primary/20">
                <MapPin className="h-12 w-12" />
              </div>
            )}
            <div className="absolute top-3 left-3 flex gap-2">
              <Badge variant={trip.status === 'active' ? 'default' : 'secondary'} className="shadow-sm">
                {trip.status.charAt(0).toUpperCase() + trip.status.slice(1)}
              </Badge>
              {isUpcoming && <Badge variant="outline" className="bg-background/80 backdrop-blur-md border-primary/20 text-primary">Upcoming</Badge>}
            </div>
          </div>
          
          <CardHeader className="p-4 pb-2">
            <h3 className="font-semibold text-lg line-clamp-1">{trip.title}</h3>
          </CardHeader>
          
          <CardContent className="p-4 pt-0 flex-1">
            <div className="space-y-2 text-sm text-muted-foreground">
              {(trip.startDate || trip.endDate) && (
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  <span>
                    {trip.startDate ? format(new Date(trip.startDate), 'MMM d, yyyy') : 'TBD'} 
                    {trip.endDate ? ` - ${format(new Date(trip.endDate), 'MMM d, yyyy')}` : ''}
                  </span>
                </div>
              )}
            </div>
          </CardContent>
          
          <CardFooter className="p-4 pt-0 flex items-center justify-between text-sm text-muted-foreground border-t mt-auto pt-4 bg-muted/10">
            <div className="flex items-center gap-1.5">
              <MapPin className="h-4 w-4" />
              <span>{trip._count.stops} stops</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Users className="h-4 w-4" />
              <span>{trip.travelerCount} traveler{trip.travelerCount > 1 ? 's' : ''}</span>
            </div>
          </CardFooter>
        </Card>
      </Link>
    </motion.div>
  );
}

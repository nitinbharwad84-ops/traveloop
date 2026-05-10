import { Metadata } from 'next';
import { prisma } from '@/lib/prisma/client';
import { notFound } from 'next/navigation';
import { format } from 'date-fns';
import { MapPin, CalendarDays, Users, Wallet, Copy, Calendar } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

// 1. Generate Open Graph Metadata
export async function generateMetadata({ params }: { params: { token: string } }): Promise<Metadata> {
  const link = await prisma.sharedLink.findUnique({
    where: { token: params.token },
    include: { trip: { include: { owner: { include: { profile: true } } } } }
  });

  if (!link || (link.expiresAt && link.expiresAt < new Date())) {
    return { title: 'Trip Not Found | Traveloop' };
  }

  const trip = link.trip;
  const plannerName = trip.owner.profile?.firstName ? `${trip.owner.profile.firstName}'s` : 'A';
  const title = `${trip.title} - ${plannerName} Trip on Traveloop`;
  const description = trip.description || `Explore this ${trip.travelerCount}-person ${trip.tripType} trip to ${trip.originCity || 'various destinations'}.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'website',
      images: [
        {
          url: trip.coverImageUrl || '/placeholder-trip.jpg', // Fallback image
          width: 1200,
          height: 630,
          alt: trip.title,
        }
      ]
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [trip.coverImageUrl || '/placeholder-trip.jpg'],
    }
  };
}

// 2. Fetch Data for the Page
async function getSharedTrip(token: string) {
  const link = await prisma.sharedLink.findUnique({
    where: { token },
    include: {
      trip: {
        include: {
          owner: { include: { profile: true } },
          stops: {
            orderBy: { orderIndex: 'asc' },
            include: { tripActivities: { orderBy: { orderIndex: 'asc' } } }
          },
        }
      }
    }
  });

  if (!link) return null;
  if (link.expiresAt && link.expiresAt < new Date()) return null;

  return link.trip;
}

// 3. Page Component
export default async function SharedTripPage({ params }: { params: { token: string } }) {
  const trip = await getSharedTrip(params.token);

  if (!trip) {
    notFound();
  }

  const plannerName = trip.owner.profile?.firstName 
    ? `${trip.owner.profile.firstName} ${trip.owner.profile.lastName || ''}` 
    : 'Traveloop Planner';
  
  const initials = trip.owner.profile?.firstName?.substring(0, 2).toUpperCase() || 'TR';

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Hero Header */}
      <div className="relative h-[40vh] md:h-[50vh] w-full bg-muted overflow-hidden">
        {trip.coverImageUrl ? (
          <img src={trip.coverImageUrl} alt={trip.title} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-primary/80 to-blue-600/80 flex items-center justify-center">
            <MapPin className="h-24 w-24 text-white/20" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
        
        <div className="absolute bottom-0 left-0 w-full p-6 md:p-12 text-white">
          <div className="container max-w-5xl mx-auto flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="space-y-4">
              <Badge variant="secondary" className="bg-white/20 hover:bg-white/30 text-white border-0 backdrop-blur-sm">
                {trip.tripType} Trip
              </Badge>
              <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-white">{trip.title}</h1>
              {trip.description && (
                <p className="text-white/80 max-w-2xl text-lg md:text-xl line-clamp-2">{trip.description}</p>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="container max-w-5xl mx-auto mt-8 px-4 md:px-8">
        
        {/* Info Ribbon */}
        <div className="flex flex-wrap items-center justify-between gap-4 p-4 md:p-6 bg-card rounded-2xl border shadow-sm -mt-16 relative z-10 mb-10">
          <div className="flex items-center gap-6 overflow-x-auto pb-2 md:pb-0">
            <div className="flex items-center gap-3 shrink-0">
              <Avatar className="h-10 w-10 border-2 border-background">
                <AvatarImage src={trip.owner.profile?.avatarUrl || ''} />
                <AvatarFallback>{initials}</AvatarFallback>
              </Avatar>
              <div className="text-sm">
                <p className="text-muted-foreground text-xs">Planned by</p>
                <p className="font-semibold">{plannerName}</p>
              </div>
            </div>
            
            <div className="w-px h-8 bg-border hidden md:block" />
            
            <div className="flex items-center gap-2 shrink-0 text-sm font-medium">
              <CalendarDays className="h-4 w-4 text-primary" />
              {trip.startDate ? format(new Date(trip.startDate), 'MMM d') : 'TBD'} 
              {trip.endDate ? ` - ${format(new Date(trip.endDate), 'MMM d, yyyy')}` : ''}
            </div>

            <div className="w-px h-8 bg-border hidden md:block" />

            <div className="flex items-center gap-2 shrink-0 text-sm font-medium">
              <Users className="h-4 w-4 text-primary" />
              {trip.travelerCount} Travelers
            </div>
            
            {trip.budgetTarget && (
              <>
                <div className="w-px h-8 bg-border hidden md:block" />
                <div className="flex items-center gap-2 shrink-0 text-sm font-medium">
                  <Wallet className="h-4 w-4 text-primary" />
                  {trip.budgetTarget.toString()} {trip.currency}
                </div>
              </>
            )}
          </div>

          <form action={`/api/v1/share/${params.token}/duplicate`} method="POST">
            <Button type="submit" className="w-full md:w-auto shadow-sm group">
              <Copy className="h-4 w-4 mr-2 transition-transform group-hover:scale-110" />
              Duplicate Trip
            </Button>
          </form>
        </div>

        {/* Itinerary Preview */}
        <div className="space-y-8">
          <h2 className="text-2xl font-bold tracking-tight flex items-center gap-2">
            <MapPin className="h-6 w-6 text-primary" /> Itinerary
          </h2>

          {trip.stops.length === 0 ? (
            <div className="text-center py-20 border-2 border-dashed rounded-2xl bg-card">
              <p className="text-lg font-medium text-muted-foreground">No destinations added yet.</p>
            </div>
          ) : (
            <div className="relative border-l-2 border-muted ml-4 md:ml-6 space-y-12 pb-8">
              {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
              {trip.stops.map((stop: any) => (
                <div key={stop.id} className="relative pl-8 md:pl-12">
                  <div className="absolute -left-[9px] top-1.5 h-4 w-4 rounded-full border-2 border-primary bg-background ring-4 ring-background" />
                  
                  <div className="bg-card border rounded-2xl p-6 shadow-sm">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                      <div>
                        <h3 className="text-xl font-bold">{stop.cityName}</h3>
                        <p className="text-muted-foreground">{stop.countryName}</p>
                      </div>
                      <div className="flex items-center gap-2 text-sm font-medium bg-muted/50 px-3 py-1.5 rounded-lg">
                        <Calendar className="h-4 w-4 text-primary" />
                        {stop.arrivalDate ? format(new Date(stop.arrivalDate), 'MMM d') : 'TBD'}
                        {stop.departureDate && ` → ${format(new Date(stop.departureDate), 'MMM d')}`}
                      </div>
                    </div>

                    {stop.tripActivities.length > 0 ? (
                      <div className="space-y-3">
                        {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                        {stop.tripActivities.map((act: any) => (
                          <div key={act.id} className="flex items-start gap-3 p-3 rounded-xl bg-muted/30 border border-border/50">
                            <div className="mt-0.5 bg-primary/10 text-primary px-2 py-0.5 rounded text-xs font-semibold shrink-0">
                              Day {act.dayNumber}
                            </div>
                            <div>
                              <p className="font-semibold text-sm">{act.title}</p>
                              {act.description && <p className="text-xs text-muted-foreground line-clamp-1">{act.description}</p>}
                            </div>
                            <div className="ml-auto text-xs font-medium text-muted-foreground shrink-0 pt-0.5">
                              {act.timeSlot.replace('_', ' ')}
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-muted-foreground italic">No specific activities planned yet.</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

'use client';

import { useState } from 'react';
import Link from 'next/link';
import { format } from 'date-fns';
import { MapPin, Calendar, Users, Wallet, Share2, Settings, MoreVertical, Copy, Trash2, Archive, Pencil } from 'lucide-react';
import { useTrip } from '@/features/trips/hooks/useTrip';
import { useTripMutations } from '@/features/trips/hooks/useTripMutations';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { DashboardSkeleton } from '@/features/dashboard/components/DashboardSkeleton';

export default function TripDetailPage({ params }: { params: { tripId: string } }) {
  const { trip, isLoading } = useTrip(params.tripId);
  const { deleteTrip, duplicateTrip, archiveTrip } = useTripMutations();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  if (isLoading) return <div className="container max-w-5xl py-8"><DashboardSkeleton /></div>;
  if (!trip) return <div className="container max-w-5xl py-8 text-center text-muted-foreground">Trip not found</div>;

  const handleDelete = async () => {
    await deleteTrip(trip.id);
    setDeleteDialogOpen(false);
  };

  return (
    <div className="container max-w-5xl py-8 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Cover Image & Header */}
      <div className="relative h-64 md:h-80 w-full rounded-2xl overflow-hidden bg-muted/30 group">
        {trip.coverImageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={trip.coverImageUrl} alt={trip.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-primary/5 text-primary/20">
            <MapPin className="h-20 w-20" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
        
        <div className="absolute bottom-6 left-6 right-6 flex items-end justify-between text-white">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Badge className="bg-primary/80 backdrop-blur-md text-white border-none">{trip.status.toUpperCase()}</Badge>
              <Badge variant="outline" className="bg-background/20 backdrop-blur-md text-white border-white/30">{trip.privacy}</Badge>
            </div>
            <h1 className="text-3xl md:text-5xl font-bold tracking-tight text-shadow-sm">{trip.title}</h1>
            {trip.originCity && (
              <p className="text-white/80 flex items-center gap-2"><MapPin className="h-4 w-4" /> Starting from {trip.originCity}</p>
            )}
          </div>
          
          <div className="flex items-center gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button size="icon" variant="outline" className="bg-black/20 backdrop-blur-md border-white/20 text-white hover:bg-white hover:text-black">
                  <MoreVertical className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem asChild><Link href={`/trips/${trip.id}/edit`}><Pencil className="mr-2 h-4 w-4" /> Edit details</Link></DropdownMenuItem>
                <DropdownMenuItem onClick={() => duplicateTrip(trip.id)}><Copy className="mr-2 h-4 w-4" /> Duplicate</DropdownMenuItem>
                <DropdownMenuItem onClick={() => archiveTrip(trip.id)}><Archive className="mr-2 h-4 w-4" /> Archive</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-destructive focus:bg-destructive focus:text-destructive-foreground" onClick={() => setDeleteDialogOpen(true)}>
                  <Trash2 className="mr-2 h-4 w-4" /> Delete trip
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>

      {/* Metadata Overview */}
      <div className="grid md:grid-cols-4 gap-4">
        <Card className="bg-muted/30 border-none shadow-none">
          <CardContent className="p-6 flex items-center gap-4">
            <div className="p-3 bg-primary/10 rounded-xl text-primary"><Calendar className="h-6 w-6" /></div>
            <div>
              <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Dates</p>
              <p className="font-semibold">{trip.startDate ? format(new Date(trip.startDate), 'MMM d') : 'TBD'} - {trip.endDate ? format(new Date(trip.endDate), 'MMM d') : 'TBD'}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-muted/30 border-none shadow-none">
          <CardContent className="p-6 flex items-center gap-4">
            <div className="p-3 bg-primary/10 rounded-xl text-primary"><Users className="h-6 w-6" /></div>
            <div>
              <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Travelers</p>
              <p className="font-semibold">{trip.travelerCount} Person(s)</p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-muted/30 border-none shadow-none">
          <CardContent className="p-6 flex items-center gap-4">
            <div className="p-3 bg-primary/10 rounded-xl text-primary"><Wallet className="h-6 w-6" /></div>
            <div>
              <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Budget Target</p>
              <p className="font-semibold">{trip.budgetTarget ? `${trip.currency} ${Number(trip.budgetTarget).toLocaleString()}` : 'Not set'}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-muted/30 border-none shadow-none">
          <CardContent className="p-6 flex items-center gap-4">
            <div className="p-3 bg-primary/10 rounded-xl text-primary"><MapPin className="h-6 w-6" /></div>
            <div>
              <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Stops</p>
              <p className="font-semibold">{trip._count.stops} Planned</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Description */}
      {trip.description && (
        <div className="bg-card p-6 rounded-2xl border shadow-sm">
          <h3 className="font-semibold mb-2">About this trip</h3>
          <p className="text-muted-foreground whitespace-pre-wrap">{trip.description}</p>
        </div>
      )}

      {/* Modules Links */}
      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { title: 'Itinerary', desc: 'Plan your daily schedule', icon: MapPin, href: `/trips/${trip.id}/itinerary` },
          { title: 'Budget', desc: 'Track your expenses', icon: Wallet, href: `/trips/${trip.id}/budget` },
          { title: 'Packing List', desc: 'Don\'t forget a thing', icon: Settings, href: `/trips/${trip.id}/packing` },
          { title: 'Collaboration', desc: 'Share with friends', icon: Share2, href: `/trips/${trip.id}/collaborators` },
        ].map((module) => (
          <Link key={module.title} href={module.href}>
            <Card className="h-full hover:border-primary/50 hover:shadow-md transition-all group">
              <CardContent className="p-6 flex flex-col items-center text-center space-y-3">
                <div className="p-4 bg-muted rounded-full group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                  <module.icon className="h-8 w-8" />
                </div>
                <div>
                  <h4 className="font-semibold">{module.title}</h4>
                  <p className="text-sm text-muted-foreground">{module.desc}</p>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete your trip
              and remove all associated data including itineraries and budgets from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

    </div>
  );
}

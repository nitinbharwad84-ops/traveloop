'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { tripSchema, TripInput, TRIP_TYPES, TRIP_PRIVACIES, TRIP_STATUSES } from '@/schemas/trip.schema';
import { useTripMutations } from '@/features/trips/hooks/useTripMutations';
import { useTrip } from '@/features/trips/hooks/useTrip';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2, Save, ArrowLeft, Image as ImageIcon } from 'lucide-react';

export default function EditTripPage({ params }: { params: { tripId: string } }) {
  const router = useRouter();
  const { trip, isLoading } = useTrip(params.tripId);
  const { updateTrip, uploadCover, isUpdating, isUploadingCover } = useTripMutations();

  const form = useForm<TripInput>({
    resolver: zodResolver(tripSchema),
    defaultValues: {
      title: '',
      description: '',
      travelerCount: 1,
      budgetTarget: undefined,
      currency: 'USD',
      tripType: 'solo',
      privacy: 'private',
      status: 'draft',
      startDate: '',
      endDate: '',
      originCity: '',
      transportPreference: '',
      accommodationPreference: '',
    },
  });

  useEffect(() => {
    if (trip) {
      form.reset({
        title: trip.title,
        description: trip.description || '',
        travelerCount: trip.travelerCount,
        budgetTarget: trip.budgetTarget ? Number(trip.budgetTarget) : undefined,
        currency: trip.currency,
        tripType: trip.tripType as any,
        privacy: ((trip.privacy as string) === 'private_' ? 'private' : (trip.privacy as string) === 'public_' ? 'public' : trip.privacy) as any,
        status: trip.status as any,
        startDate: trip.startDate ? new Date(trip.startDate).toISOString().split('T')[0] : '',
        endDate: trip.endDate ? new Date(trip.endDate).toISOString().split('T')[0] : '',
        originCity: trip.originCity || '',
        transportPreference: trip.transportPreference || '',
        accommodationPreference: trip.accommodationPreference || '',
      });
    }
  }, [trip, form]);

  const onSubmit = async (data: TripInput) => {
    await updateTrip({ id: params.tripId, data });
    router.push(`/trips/${params.tripId}`);
  };

  const handleCoverUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      await uploadCover({ id: params.tripId, file });
    }
  };

  if (isLoading) return <div className="container max-w-2xl py-12 flex justify-center"><Loader2 className="h-8 w-8 animate-spin" /></div>;
  if (!trip) return <div className="container max-w-2xl py-12 text-center">Trip not found.</div>;

  return (
    <div className="container max-w-2xl py-8 animate-in fade-in zoom-in-95 duration-300 space-y-8">
      
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => router.back()}><ArrowLeft className="h-5 w-5" /></Button>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Edit Trip</h1>
          <p className="text-muted-foreground text-sm">Update your travel details</p>
        </div>
      </div>

      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle>Cover Image</CardTitle>
          <CardDescription>Upload a beautiful cover for your adventure.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-6">
            <div className="relative h-32 w-48 rounded-xl overflow-hidden bg-muted flex-shrink-0">
              {trip.coverImageUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={trip.coverImageUrl} alt="Cover" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-muted-foreground"><ImageIcon className="h-8 w-8" /></div>
              )}
              {isUploadingCover && (
                <div className="absolute inset-0 bg-background/50 flex items-center justify-center backdrop-blur-sm">
                  <Loader2 className="h-6 w-6 animate-spin text-primary" />
                </div>
              )}
            </div>
            <div className="flex-1 space-y-2">
              <Input type="file" accept="image/jpeg,image/png,image/webp" onChange={handleCoverUpload} disabled={isUploadingCover} />
              <p className="text-xs text-muted-foreground">Max 5MB. WebP, JPEG, or PNG.</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-sm">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <CardHeader>
              <CardTitle>Trip Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              
              <div className="grid grid-cols-2 gap-4">
                <FormField control={form.control} name="title" render={({ field }) => (
                  <FormItem className="col-span-2">
                    <FormLabel>Trip Title</FormLabel>
                    <FormControl><Input {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />

                <FormField control={form.control} name="startDate" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Start Date</FormLabel>
                    <FormControl><Input type="date" {...field} value={field.value instanceof Date ? field.value.toISOString().split('T')[0] : field.value || ''} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />

                <FormField control={form.control} name="endDate" render={({ field }) => (
                  <FormItem>
                    <FormLabel>End Date</FormLabel>
                    <FormControl><Input type="date" {...field} value={field.value instanceof Date ? field.value.toISOString().split('T')[0] : field.value || ''} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />

                <FormField control={form.control} name="originCity" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Origin City</FormLabel>
                    <FormControl><Input {...field} value={field.value || ''} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />

                <FormField control={form.control} name="travelerCount" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Travelers</FormLabel>
                    <FormControl><Input type="number" min={1} {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />

                <FormField control={form.control} name="tripType" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Trip Type</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                      <SelectContent>
                        {TRIP_TYPES.map(t => <SelectItem key={t} value={t} className="capitalize">{t.replace('_', ' ')}</SelectItem>)}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )} />

                <FormField control={form.control} name="privacy" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Privacy</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                      <SelectContent>
                        {TRIP_PRIVACIES.map(p => <SelectItem key={p} value={p} className="capitalize">{p}</SelectItem>)}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )} />

                <FormField control={form.control} name="status" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                      <SelectContent>
                        {TRIP_STATUSES.map(s => <SelectItem key={s} value={s} className="capitalize">{s}</SelectItem>)}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )} />
              </div>

              <FormField control={form.control} name="description" render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl><Textarea {...field} value={field.value || ''} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
            </CardContent>

            <CardFooter className="bg-muted/20 p-6 flex justify-end">
              <Button type="submit" disabled={isUpdating}>
                {isUpdating ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                Save Changes
              </Button>
            </CardFooter>
          </form>
        </Form>
      </Card>

    </div>
  );
}

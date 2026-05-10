'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { tripSchema, TripInput, TRIP_TYPES, TRIP_PRIVACIES } from '@/schemas/trip.schema';
import { useTripMutations } from '@/features/trips/hooks/useTripMutations';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2, ArrowRight, ArrowLeft, Plane, CheckCircle2 } from 'lucide-react';

export default function NewTripPage() {
  const router = useRouter();
  const { createTrip, updateTrip } = useTripMutations();
  const [step, setStep] = useState(1);
  const [tripId, setTripId] = useState<string | null>(null);
  const [isSavingDraft, setIsSavingDraft] = useState(false);
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);

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
    mode: 'onChange',
  });

  // Auto-save logic
  useEffect(() => {
    const subscription = form.watch((value) => {
      // Don't auto-save if title is empty (required by db/schema)
      if (!value.title || value.title.trim() === '') return;

      if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);

      saveTimeoutRef.current = setTimeout(async () => {
        setIsSavingDraft(true);
        try {
          const currentData = form.getValues();
          if (!tripId) {
            // Create first draft
            const res = await createTrip({ ...currentData, status: 'draft' });
            if (res.success && res.data) {
              setTripId(res.data.id);
            }
          } else {
            // Update existing draft
            await updateTrip({ id: tripId, data: { ...currentData, status: 'draft' } });
          }
        } catch (e) {
          console.error('Autosave failed', e);
        } finally {
          setIsSavingDraft(false);
        }
      }, 2000); // Debounce 2 seconds
    });

    return () => {
      subscription.unsubscribe();
      if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
    };
  }, [form, tripId, createTrip, updateTrip]);

  const onNext = async () => {
    let isValid = false;
    if (step === 1) {
      isValid = await form.trigger(['title', 'description', 'startDate', 'endDate']);
    } else if (step === 2) {
      isValid = await form.trigger(['originCity', 'travelerCount', 'tripType', 'privacy']);
    }

    if (isValid) setStep((s) => s + 1);
  };

  const onSubmit = async (data: TripInput) => {
    // Final submit -> Active status
    data.status = 'active';
    
    if (tripId) {
      await updateTrip({ id: tripId, data });
      router.push(`/trips/${tripId}`);
    } else {
      const res = await createTrip(data);
      if (res.success && res.data) {
        router.push(`/trips/${res.data.id}`);
      }
    }
  };

  return (
    <div className="container max-w-2xl py-12 animate-in fade-in zoom-in-95 duration-300">
      <div className="mb-8 flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight">Plan a new trip</h1>
          <p className="text-muted-foreground">Let&apos;s get the details down.</p>
        </div>
        {isSavingDraft && <div className="flex items-center text-xs text-muted-foreground bg-muted px-2 py-1 rounded-full"><Loader2 className="h-3 w-3 mr-1 animate-spin"/> Saving draft...</div>}
        {!isSavingDraft && tripId && <div className="flex items-center text-xs text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full border border-emerald-200"><CheckCircle2 className="h-3 w-3 mr-1"/> Draft saved</div>}
      </div>

      <div className="flex gap-2 mb-8">
        {[1, 2, 3].map((s) => (
          <div key={s} className={`h-2 flex-1 rounded-full transition-colors ${step >= s ? 'bg-primary' : 'bg-muted'}`} />
        ))}
      </div>

      <Card className="shadow-lg border-primary/10">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            
            {/* STEP 1: Basic Info */}
            {step === 1 && (
              <>
                <CardHeader>
                  <CardTitle>The Basics</CardTitle>
                  <CardDescription>Give your trip a catchy name and timeframe.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <FormField control={form.control} name="title" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Trip Title <span className="text-destructive">*</span></FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. Summer in Tokyo" {...field} className="text-lg py-6" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <FormField control={form.control} name="description" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea placeholder="What&apos;s the vibe?" {...field} value={field.value || ''} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <div className="grid grid-cols-2 gap-4">
                    <FormField control={form.control} name="startDate" render={({ field }) => (
                      <FormItem>
                        <FormLabel>Start Date</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} value={field.value instanceof Date ? field.value.toISOString().split('T')[0] : field.value || ''} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                    <FormField control={form.control} name="endDate" render={({ field }) => (
                      <FormItem>
                        <FormLabel>End Date</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} value={field.value instanceof Date ? field.value.toISOString().split('T')[0] : field.value || ''} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                  </div>
                </CardContent>
              </>
            )}

            {/* STEP 2: Travel Details */}
            {step === 2 && (
              <>
                <CardHeader>
                  <CardTitle>Travel Details</CardTitle>
                  <CardDescription>Who is going and what kind of trip is it?</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <FormField control={form.control} name="originCity" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Origin City</FormLabel>
                      <FormControl>
                        <Input placeholder="Where are you leaving from?" {...field} value={field.value || ''} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  
                  <div className="grid grid-cols-2 gap-4">
                    <FormField control={form.control} name="travelerCount" render={({ field }) => (
                      <FormItem>
                        <FormLabel>Number of Travelers</FormLabel>
                        <FormControl>
                          <Input type="number" min={1} {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                    <FormField control={form.control} name="tripType" render={({ field }) => (
                      <FormItem>
                        <FormLabel>Trip Type</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl><SelectTrigger><SelectValue placeholder="Select type" /></SelectTrigger></FormControl>
                          <SelectContent>
                            {TRIP_TYPES.map(t => <SelectItem key={t} value={t} className="capitalize">{t.replace('_', ' ')}</SelectItem>)}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )} />
                  </div>

                  <FormField control={form.control} name="privacy" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Privacy</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl><SelectTrigger><SelectValue placeholder="Select privacy" /></SelectTrigger></FormControl>
                        <SelectContent>
                          {TRIP_PRIVACIES.map(p => <SelectItem key={p} value={p} className="capitalize">{p}</SelectItem>)}
                        </SelectContent>
                      </Select>
                      <FormDescription>Public trips can be seen by the community.</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )} />
                </CardContent>
              </>
            )}

            {/* STEP 3: Preferences */}
            {step === 3 && (
              <>
                <CardHeader>
                  <CardTitle>Preferences & Budget</CardTitle>
                  <CardDescription>Optional details to guide your planning.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <FormField control={form.control} name="budgetTarget" render={({ field }) => (
                      <FormItem>
                        <FormLabel>Total Budget Target</FormLabel>
                        <FormControl>
                          <Input type="number" min={0} placeholder="0.00" {...field} value={field.value || ''} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                    <FormField control={form.control} name="currency" render={({ field }) => (
                      <FormItem>
                        <FormLabel>Currency</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl><SelectTrigger><SelectValue placeholder="Currency" /></SelectTrigger></FormControl>
                          <SelectContent>
                            <SelectItem value="USD">USD ($)</SelectItem>
                            <SelectItem value="EUR">EUR (€)</SelectItem>
                            <SelectItem value="GBP">GBP (£)</SelectItem>
                            <SelectItem value="INR">INR (₹)</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )} />
                  </div>

                  <FormField control={form.control} name="transportPreference" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Transport Preference</FormLabel>
                      <FormControl><Input placeholder="e.g. Train, Flight, Road Trip" {...field} value={field.value || ''} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />

                  <FormField control={form.control} name="accommodationPreference" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Accommodation</FormLabel>
                      <FormControl><Input placeholder="e.g. Hotel, Hostel, Airbnb" {...field} value={field.value || ''} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                </CardContent>
              </>
            )}

            <CardFooter className="flex justify-between border-t bg-muted/20 p-6">
              <Button type="button" variant="outline" onClick={() => step > 1 ? setStep(s => s - 1) : router.back()}>
                {step > 1 ? <><ArrowLeft className="mr-2 h-4 w-4" /> Back</> : 'Cancel'}
              </Button>
              
              {step < 3 ? (
                <Button type="button" onClick={onNext}>
                  Next <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              ) : (
                <Button type="submit" disabled={form.formState.isSubmitting}>
                  {form.formState.isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Plane className="mr-2 h-4 w-4" />}
                  Create Trip
                </Button>
              )}
            </CardFooter>

          </form>
        </Form>
      </Card>
    </div>
  );
}

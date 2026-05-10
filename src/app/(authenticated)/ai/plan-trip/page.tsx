'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { 
  Sparkles, Loader2, MapPin, Calendar, Users, Wallet, 
  ChevronRight, CheckCircle2, RefreshCw, Clock, DollarSign,
  Lightbulb, AlertTriangle
} from 'lucide-react';
import type { TripPlan } from '@/app/api/v1/ai/plan-trip/route';

const formSchema = z.object({
  destination: z.string().min(2, 'Enter a destination'),
  duration: z.coerce.number().int().min(1).max(30),
  travelerCount: z.coerce.number().int().min(1).max(20),
  budget: z.coerce.number().positive(),
  currency: z.string().default('USD'),
  tripStyle: z.string().min(1, 'Select a trip style'),
  preferences: z.string().optional(),
  season: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

const TRIP_STYLES = ['Adventure', 'Cultural', 'Relaxation', 'Budget', 'Luxury', 'Backpacking', 'Business', 'Family-Friendly', 'Romantic', 'Solo Exploration'];

export default function AiTripPlannerPage() {
  const router = useRouter();
  const [step, setStep] = useState<'form' | 'loading' | 'review'>('form');
  const [plan, setPlan] = useState<TripPlan | null>(null);
  const [isAccepting, setIsAccepting] = useState(false);
  const [lastFormValues, setLastFormValues] = useState<FormValues | null>(null);

  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: { currency: 'USD', travelerCount: 2, duration: 7 },
  });

  const onSubmit = async (values: FormValues) => {
    setLastFormValues(values);
    setStep('loading');
    try {
      const res = await fetch('/api/v1/ai/plan-trip', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      });
      const result = await res.json();
      if (!result.success) throw new Error(result.error);
      setPlan(result.data);
      setStep('review');
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'AI service failed. Try again.');
      setStep('form');
    }
  };

  const handleAcceptPlan = async () => {
    if (!plan) return;
    setIsAccepting(true);
    try {
      // Create the trip
      const tripRes = await fetch('/api/v1/trips', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: plan.trip_title,
          duration: lastFormValues?.duration,
          travelerCount: lastFormValues?.travelerCount,
          budget: lastFormValues?.budget,
          currency: lastFormValues?.currency,
          tripType: 'adventure',
          status: 'active',
          privacy: 'private',
        }),
      });
      const tripResult = await tripRes.json();
      if (!tripResult.success) throw new Error('Failed to create trip');

      const newTripId = tripResult.data.id;

      let stopIndex = 0;
      for (const city of plan.destinations) {
        const stopRes = await fetch(`/api/v1/trips/${newTripId}/stops`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ cityName: city, countryName: '', orderIndex: stopIndex }),
        });
        await stopRes.json();
        stopIndex++;
      }

      toast.success('Trip created from AI plan! Redirecting...');
      setTimeout(() => router.push(`/trips/${newTripId}`), 1500);
    } catch {
      toast.error('Failed to create trip from plan. Try again.');
    } finally {
      setIsAccepting(false);
    }
  };

  if (step === 'loading') {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-8 p-8">
        <div className="relative">
          <div className="h-24 w-24 rounded-full bg-primary/10 animate-ping absolute" />
          <div className="h-24 w-24 rounded-full bg-primary/20 flex items-center justify-center">
            <Sparkles className="h-10 w-10 text-primary animate-pulse" />
          </div>
        </div>
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-bold">Crafting Your Perfect Itinerary</h2>
          <p className="text-muted-foreground max-w-md">Our AI is analyzing your preferences, local insights, and budgets to build a personalized travel plan...</p>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Loader2 className="h-4 w-4 animate-spin" />
          <span>This usually takes 5–15 seconds</span>
        </div>
      </div>
    );
  }

  if (step === 'review' && plan) {
    return (
      <div className="container max-w-4xl py-8 animate-in fade-in duration-500 space-y-8">
        {/* Hero */}
        <div className="text-center space-y-3">
          <Badge className="bg-primary/10 text-primary border-primary/20 hover:bg-primary/20 text-sm px-3 py-1">
            <Sparkles className="h-3.5 w-3.5 mr-1.5" /> AI Generated Plan
          </Badge>
          <h1 className="text-4xl font-bold tracking-tight">{plan.trip_title}</h1>
          <p className="text-muted-foreground">{plan.destinations.join(' → ')}</p>
          <div className="flex items-center justify-center gap-6 text-sm font-medium mt-4">
            <span className="flex items-center gap-1.5"><Calendar className="h-4 w-4 text-primary" />{plan.days.length} Days</span>
            <span className="flex items-center gap-1.5"><MapPin className="h-4 w-4 text-primary" />{plan.destinations.length} Destinations</span>
            <span className="flex items-center gap-1.5"><DollarSign className="h-4 w-4 text-primary" />{plan.estimated_budget.total.toLocaleString()} {lastFormValues?.currency}</span>
          </div>
        </div>

        {/* Day-by-day */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold">Your Itinerary</h2>
          {plan.days.map((day) => (
            <div key={day.day} className="bg-card rounded-2xl border shadow-sm overflow-hidden">
              <div className="bg-muted/40 px-6 py-3 flex items-center justify-between border-b">
                <h3 className="font-bold text-lg">Day {day.day}</h3>
                <span className="text-sm font-medium text-muted-foreground flex items-center gap-1.5">
                  <MapPin className="h-3.5 w-3.5" /> {day.city}
                </span>
              </div>
              <div className="divide-y">
                {day.activities.map((act, i) => (
                  <div key={i} className="p-4 flex gap-4">
                    <div className="mt-1 h-8 w-8 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-bold shrink-0">
                      {i + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <p className="font-semibold">{act.title}</p>
                        <span className="text-sm font-medium text-primary shrink-0">~${act.estimated_cost}</span>
                      </div>
                      <p className="text-sm text-muted-foreground mt-0.5 line-clamp-2">{act.description}</p>
                      <div className="flex items-center gap-3 mt-2">
                        <Badge variant="secondary" className="text-[10px] h-5">{act.category}</Badge>
                        {act.duration_minutes && (
                          <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                            <Clock className="h-3 w-3" /> {act.duration_minutes} min
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Budget Summary */}
        <div className="bg-card rounded-2xl border shadow-sm p-6 space-y-4">
          <h2 className="text-xl font-bold flex items-center gap-2"><Wallet className="h-5 w-5 text-primary" />Budget Breakdown</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {Object.entries(plan.estimated_budget.breakdown).map(([key, val]) => (
              <div key={key} className="bg-muted/40 rounded-xl p-3 text-center">
                <p className="text-xs text-muted-foreground capitalize">{key.replace(/_/g, ' ')}</p>
                <p className="text-lg font-bold">${val.toLocaleString()}</p>
              </div>
            ))}
          </div>
          <div className="flex justify-between items-center pt-3 border-t font-bold text-lg">
            <span>Total Estimated</span>
            <span className="text-primary">${plan.estimated_budget.total.toLocaleString()} {lastFormValues?.currency}</span>
          </div>
        </div>

        {/* Assumptions & Warnings */}
        <div className="grid md:grid-cols-2 gap-4">
          {plan.assumptions.length > 0 && (
            <div className="bg-card border rounded-2xl p-5 space-y-3">
              <h3 className="font-semibold flex items-center gap-2"><Lightbulb className="h-4 w-4 text-amber-500" />Assumptions</h3>
              <ul className="space-y-1.5">
                {plan.assumptions.map((a, i) => (
                  <li key={i} className="text-sm text-muted-foreground flex gap-2"><span className="text-amber-500 mt-0.5">•</span>{a}</li>
                ))}
              </ul>
            </div>
          )}
          {plan.warnings.length > 0 && (
            <div className="bg-destructive/5 border-destructive/20 border rounded-2xl p-5 space-y-3">
              <h3 className="font-semibold flex items-center gap-2 text-destructive"><AlertTriangle className="h-4 w-4" />Warnings</h3>
              <ul className="space-y-1.5">
                {plan.warnings.map((w, i) => (
                  <li key={i} className="text-sm text-destructive/80 flex gap-2"><span className="mt-0.5">•</span>{w}</li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4">
          <Button onClick={handleAcceptPlan} disabled={isAccepting} size="lg" className="flex-1 h-12 text-base">
            {isAccepting ? <Loader2 className="h-5 w-5 animate-spin mr-2" /> : <CheckCircle2 className="h-5 w-5 mr-2" />}
            Accept &amp; Create Trip
          </Button>
          <Button variant="outline" onClick={() => { setStep('form'); setPlan(null); }} size="lg" className="sm:w-auto h-12">
            <RefreshCw className="h-4 w-4 mr-2" /> Regenerate
          </Button>
        </div>
      </div>
    );
  }

  // Form
  return (
    <div className="container max-w-2xl py-12 animate-in fade-in zoom-in-95 duration-300">
      <div className="text-center space-y-3 mb-10">
        <div className="inline-flex items-center justify-center h-16 w-16 rounded-2xl bg-primary/10 mb-2">
          <Sparkles className="h-8 w-8 text-primary" />
        </div>
        <h1 className="text-4xl font-bold tracking-tight">AI Trip Planner</h1>
        <p className="text-muted-foreground text-lg max-w-md mx-auto">Tell us where you want to go and we&apos;ll create a complete, personalized itinerary in seconds.</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="bg-card border rounded-2xl shadow-sm p-6 md:p-8 space-y-6">
        {/* Destination + Duration row */}
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium flex items-center gap-1.5"><MapPin className="h-4 w-4 text-primary" />Destination</label>
            <Input {...register('destination')} placeholder="e.g. Bali, Indonesia" className="bg-muted/30" />
            {errors.destination && <p className="text-xs text-destructive">{errors.destination.message}</p>}
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium flex items-center gap-1.5"><Calendar className="h-4 w-4 text-primary" />Duration (days)</label>
            <Input {...register('duration')} type="number" min="1" max="30" className="bg-muted/30" />
            {errors.duration && <p className="text-xs text-destructive">{errors.duration.message}</p>}
          </div>
        </div>

        {/* Travelers + Budget + Currency */}
        <div className="grid sm:grid-cols-3 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium flex items-center gap-1.5"><Users className="h-4 w-4 text-primary" />Travelers</label>
            <Input {...register('travelerCount')} type="number" min="1" max="20" className="bg-muted/30" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium flex items-center gap-1.5"><Wallet className="h-4 w-4 text-primary" />Total Budget</label>
            <Input {...register('budget')} type="number" min="1" placeholder="e.g. 2000" className="bg-muted/30" />
            {errors.budget && <p className="text-xs text-destructive">{errors.budget.message}</p>}
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Currency</label>
            <Select defaultValue="USD" onValueChange={(v) => setValue('currency', v)}>
              <SelectTrigger className="bg-muted/30"><SelectValue /></SelectTrigger>
              <SelectContent>
                {['USD', 'EUR', 'GBP', 'INR', 'AUD', 'CAD', 'JPY', 'SGD'].map(c => (
                  <SelectItem key={c} value={c}>{c}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Trip Style */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Trip Style</label>
          <div className="flex flex-wrap gap-2">
            {TRIP_STYLES.map(style => {
              const isSelected = watch('tripStyle') === style;
              return (
                <button
                  key={style}
                  type="button"
                  onClick={() => setValue('tripStyle', style)}
                  className={`px-3 py-1.5 rounded-full text-sm font-medium border transition-colors ${
                    isSelected ? 'bg-primary text-primary-foreground border-primary' : 'bg-muted/40 text-muted-foreground border-input hover:bg-muted'
                  }`}
                >
                  {style}
                </button>
              );
            })}
          </div>
          {errors.tripStyle && <p className="text-xs text-destructive">{errors.tripStyle.message}</p>}
        </div>

        {/* Season + Preferences */}
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Season / Month</label>
            <Input {...register('season')} placeholder="e.g. Summer, December" className="bg-muted/30" />
          </div>
          <div className="space-y-2 sm:col-span-1">
            <label className="text-sm font-medium">Preferences (optional)</label>
            <Textarea 
              {...register('preferences')} 
              placeholder="e.g. Love food tours, avoid crowds, need vegetarian options..."
              className="bg-muted/30 resize-none h-[80px]"
            />
          </div>
        </div>

        <Button type="submit" size="lg" className="w-full h-12 text-base group">
          <Sparkles className="h-5 w-5 mr-2 group-hover:rotate-12 transition-transform" />
          Generate Itinerary
          <ChevronRight className="h-4 w-4 ml-2 opacity-60" />
        </Button>
        <p className="text-center text-xs text-muted-foreground">
          Uses 1 of your 10 daily AI credits
        </p>
      </form>
    </div>
  );
}

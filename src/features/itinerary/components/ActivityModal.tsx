'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { tripActivitySchema, TripActivityInput } from '@/schemas/itinerary.schema';
import { TripActivityData } from '@/services/itinerary.service';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Plus, Loader2 } from 'lucide-react';

interface ActivityModalProps {
  onSave: (data: TripActivityInput) => Promise<void>;
  isSaving: boolean;
  trigger?: React.ReactNode;
  initialData?: TripActivityData;
  defaultDay?: number;
}

export function ActivityModal({ onSave, isSaving, trigger, initialData, defaultDay = 1 }: ActivityModalProps) {
  const [open, setOpen] = useState(false);

  const form = useForm<TripActivityInput>({
    resolver: zodResolver(tripActivitySchema),
    defaultValues: {
      title: '',
      description: '',
      dayNumber: defaultDay,
      timeSlot: '',
      customNotes: '',
      customCost: undefined,
      orderIndex: 0,
    },
  });

  useEffect(() => {
    if (open && initialData) {
      form.reset({
        title: initialData.title,
        description: initialData.description || '',
        dayNumber: initialData.dayNumber,
        timeSlot: initialData.timeSlot || '',
        customNotes: initialData.customNotes || '',
        customCost: initialData.customCost || undefined,
        orderIndex: initialData.orderIndex,
      });
    } else if (open && !initialData) {
      form.reset({
        title: '',
        description: '',
        dayNumber: defaultDay,
        timeSlot: '',
        customNotes: '',
        customCost: undefined,
        orderIndex: 0,
      });
    }
  }, [open, initialData, defaultDay, form]);

  const onSubmit = async (data: TripActivityInput) => {
    await onSave(data);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || <Button variant="outline" size="sm" className="w-full mt-2 border-dashed"><Plus className="mr-2 h-4 w-4" /> Add Activity</Button>}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{initialData ? 'Edit Activity' : 'Add Activity'}</DialogTitle>
          <DialogDescription>Plan what you will do during this stop.</DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField control={form.control} name="title" render={({ field }) => (
              <FormItem>
                <FormLabel>Activity Title</FormLabel>
                <FormControl><Input placeholder="e.g. Visit Museum" {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />

            <div className="grid grid-cols-2 gap-4">
              <FormField control={form.control} name="dayNumber" render={({ field }) => (
                <FormItem>
                  <FormLabel>Day Number</FormLabel>
                  <FormControl><Input type="number" min={1} {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="timeSlot" render={({ field }) => (
                <FormItem>
                  <FormLabel>Time (e.g. 10:00 AM)</FormLabel>
                  <FormControl><Input placeholder="Morning / 10:00 AM" {...field} value={field.value || ''} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
            </div>

            <FormField control={form.control} name="customCost" render={({ field }) => (
              <FormItem>
                <FormLabel>Estimated Cost</FormLabel>
                <FormControl><Input type="number" min={0} placeholder="0.00" {...field} value={field.value || ''} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />

            <FormField control={form.control} name="description" render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl><Textarea placeholder="Details about the activity..." {...field} value={field.value || ''} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
              <Button type="submit" disabled={isSaving}>
                {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {initialData ? 'Update' : 'Save'} Activity
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

import { z } from 'zod';

export const tripStopSchema = z.object({
  cityName: z.string().min(1, 'City name is required').max(100),
  countryName: z.string().min(1, 'Country name is required').max(100),
  arrivalDate: z.string().or(z.date()).optional().nullable(),
  departureDate: z.string().or(z.date()).optional().nullable(),
  timezone: z.string().max(50).optional().nullable(),
  orderIndex: z.number().int().min(0).default(0),
  notes: z.string().optional().nullable(),
  estimatedTransportCost: z.coerce.number().min(0).optional().nullable(),
  estimatedTransportTime: z.coerce.number().min(0).optional().nullable(),
}).refine((data) => {
  if (data.arrivalDate && data.departureDate) {
    return new Date(data.departureDate) >= new Date(data.arrivalDate);
  }
  return true;
}, {
  message: 'Departure date must be after or equal to arrival date',
  path: ['departureDate'],
});

export const tripStopUpdateSchema = z.object({
  cityName: z.string().min(1, 'City name is required').max(100),
  countryName: z.string().min(1, 'Country name is required').max(100),
  arrivalDate: z.string().or(z.date()).optional().nullable(),
  departureDate: z.string().or(z.date()).optional().nullable(),
  timezone: z.string().max(50).optional().nullable(),
  notes: z.string().optional().nullable(),
  estimatedTransportCost: z.coerce.number().min(0).optional().nullable(),
  estimatedTransportTime: z.coerce.number().min(0).optional().nullable(),
}).partial().refine((data) => {
  if (data.arrivalDate && data.departureDate) {
    return new Date(data.departureDate) >= new Date(data.arrivalDate);
  }
  return true;
}, {
  message: 'Departure date must be after or equal to arrival date',
  path: ['departureDate'],
});

export const tripActivitySchema = z.object({
  activityId: z.string().optional().nullable(),
  title: z.string().min(1, 'Title is required').max(200),
  description: z.string().optional().nullable(),
  dayNumber: z.number().int().min(1).default(1),
  timeSlot: z.string().max(50).optional().nullable(),
  customNotes: z.string().optional().nullable(),
  customCost: z.coerce.number().min(0).optional().nullable(),
  orderIndex: z.number().int().min(0).default(0),
});

export const tripActivityUpdateSchema = tripActivitySchema.partial();

export const reorderSchema = z.object({
  items: z.array(z.object({
    id: z.string(),
    orderIndex: z.number().int().min(0),
  })),
});

export type TripStopInput = z.infer<typeof tripStopSchema>;
export type TripStopUpdateInput = z.infer<typeof tripStopUpdateSchema>;
export type TripActivityInput = z.infer<typeof tripActivitySchema>;
export type TripActivityUpdateInput = z.infer<typeof tripActivityUpdateSchema>;
export type ReorderInput = z.infer<typeof reorderSchema>;

import { z } from 'zod';

export const TRIP_TYPES = [
  'solo',
  'family',
  'group',
  'honeymoon',
  'business',
  'adventure',
  'luxury',
  'budget'
] as const;

export const TRIP_PRIVACIES = [
  'private',
  'shared',
  'public'
] as const;

export const TRIP_STATUSES = [
  'draft',
  'active',
  'completed',
  'archived'
] as const;

export const tripBaseSchema = z.object({
  title: z.string().min(1, 'Title is required').max(255),
  description: z.string().optional().nullable(),
  startDate: z.string().or(z.date()).optional().nullable(),
  endDate: z.string().or(z.date()).optional().nullable(),
  travelerCount: z.coerce.number().min(1).default(1),
  budgetTarget: z.coerce.number().min(0).optional().nullable(),
  currency: z.string().max(3).default('USD'),
  tripType: z.enum(TRIP_TYPES).default('solo'),
  privacy: z.enum(TRIP_PRIVACIES).default('private'),
  status: z.enum(TRIP_STATUSES).default('draft'),
  transportPreference: z.string().max(30).optional().nullable(),
  accommodationPreference: z.string().max(30).optional().nullable(),
  originCity: z.string().max(100).optional().nullable(),
});

export const tripSchema = tripBaseSchema.refine((data) => {
  if (data.startDate && data.endDate) {
    return new Date(data.endDate) >= new Date(data.startDate);
  }
  return true;
}, {
  message: 'End date must be after or equal to start date',
  path: ['endDate'],
});

export type TripInput = z.infer<typeof tripSchema>;

export const tripCoverSchema = z.object({
  file: z
    .custom<File>((val) => val instanceof File, 'Please upload a file')
    .refine((file) => file.size <= 5 * 1024 * 1024, `Max image size is 5MB.`)
    .refine(
      (file) => ['image/jpeg', 'image/png', 'image/webp'].includes(file.type),
      'Only .jpg, .png and .webp formats are supported.'
    ),
});

export type TripCoverInput = z.infer<typeof tripCoverSchema>;

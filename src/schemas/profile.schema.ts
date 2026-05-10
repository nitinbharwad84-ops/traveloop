import { z } from 'zod';

// Travel styles matches architecture enum / requirements
export const TRAVEL_STYLES = [
  'backpacker',
  'family',
  'luxury',
  'adventure',
  'foodie',
  'digital_nomad',
  'romantic',
  'business_traveler'
] as const;

export const profileSchema = z.object({
  firstName: z.string().min(1, 'First name is required').max(100),
  lastName: z.string().min(1, 'Last name is required').max(100),
  phone: z.string().max(20).optional().nullable(),
  city: z.string().max(100).optional().nullable(),
  country: z.string().max(100).optional().nullable(),
  language: z.string().min(2).max(10).default('en'),
  
  travelPreferences: z.array(z.string()).default([]),
  
  notificationPreferences: z.object({
    email: z.boolean().default(true),
    push: z.boolean().default(false),
    in_app: z.boolean().default(true),
  }).default({ email: true, push: false, in_app: true }),
});

export type ProfileInput = z.infer<typeof profileSchema>;

export const avatarSchema = z.object({
  file: z
    .custom<File>((val) => val instanceof File, 'Please upload a file')
    .refine((file) => file.size <= 2 * 1024 * 1024, `Max image size is 2MB.`)
    .refine(
      (file) => ['image/jpeg', 'image/png', 'image/webp'].includes(file.type),
      'Only .jpg, .png and .webp formats are supported.'
    ),
});

export type AvatarInput = z.infer<typeof avatarSchema>;

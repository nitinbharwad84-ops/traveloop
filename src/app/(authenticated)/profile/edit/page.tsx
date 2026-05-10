'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useProfile } from '@/features/profile/hooks/useProfile';
import { profileSchema, ProfileInput, TRAVEL_STYLES } from '@/schemas/profile.schema';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Camera, Loader2 } from 'lucide-react';

export default function EditProfilePage() {
  const router = useRouter();
  const { profile, isLoading, updateProfile, isUpdating, uploadAvatar, isUploadingAvatar } = useProfile();
  
  const form = useForm<ProfileInput>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      phone: '',
      city: '',
      country: '',
      language: 'en',
      travelPreferences: [],
      notificationPreferences: {
        email: true,
        push: false,
        in_app: true,
      }
    },
  });

  // Load profile data into form when available
  useEffect(() => {
    if (profile) {
      form.reset({
        firstName: profile.firstName,
        lastName: profile.lastName,
        phone: profile.phone || '',
        city: profile.city || '',
        country: profile.country || '',
        language: profile.language || 'en',
        travelPreferences: profile.travelPreferences || [],
        notificationPreferences: profile.notificationPreferences || { email: true, push: false, in_app: true }
      });
    }
  }, [profile, form]);

  const onSubmit = async (data: ProfileInput) => {
    await updateProfile(data);
    router.push('/profile');
  };

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      alert('File size must be less than 2MB');
      return;
    }

    await uploadAvatar(file);
    // Reset file input
    e.target.value = '';
  };

  const toggleTravelStyle = (style: string) => {
    const current = form.getValues('travelPreferences');
    if (current.includes(style)) {
      form.setValue('travelPreferences', current.filter((s) => s !== style), { shouldDirty: true });
    } else {
      form.setValue('travelPreferences', [...current, style], { shouldDirty: true });
    }
  };

  if (isLoading && !profile) {
    return (
      <div className="flex h-full min-h-[50vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="container max-w-3xl py-8 space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/profile">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <h1 className="text-3xl font-bold tracking-tight">Edit Profile</h1>
      </div>

      <div className="grid gap-6">
        {/* Avatar Section */}
        <Card>
          <CardHeader>
            <CardTitle>Profile Picture</CardTitle>
            <CardDescription>Update your avatar. Max 2MB (JPEG/PNG).</CardDescription>
          </CardHeader>
          <CardContent className="flex items-center gap-6">
            <Avatar className="h-24 w-24 border">
              <AvatarImage src={profile?.avatarUrl || ''} />
              <AvatarFallback className="text-2xl">
                {profile ? `${profile.firstName.charAt(0)}${profile.lastName.charAt(0)}` : 'US'}
              </AvatarFallback>
            </Avatar>
            <div className="space-y-2">
              <div className="relative">
                <Input 
                  type="file" 
                  accept="image/png, image/jpeg, image/webp" 
                  className="absolute inset-0 opacity-0 cursor-pointer h-full w-full"
                  onChange={handleAvatarChange}
                  disabled={isUploadingAvatar}
                />
                <Button variant="outline" disabled={isUploadingAvatar}>
                  {isUploadingAvatar ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <Camera className="mr-2 h-4 w-4" />
                  )}
                  {isUploadingAvatar ? 'Uploading...' : 'Change Picture'}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Main Form */}
        <Card>
          <CardHeader>
            <CardTitle>Personal Information</CardTitle>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid gap-4 md:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="firstName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>First Name</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="lastName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Last Name</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Phone (Optional)</FormLabel>
                        <FormControl>
                          <Input {...field} value={field.value || ''} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="language"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Language</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="city"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>City (Optional)</FormLabel>
                        <FormControl>
                          <Input {...field} value={field.value || ''} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="country"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Country (Optional)</FormLabel>
                        <FormControl>
                          <Input {...field} value={field.value || ''} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="pt-4 border-t">
                  <h3 className="font-medium mb-3">Travel Styles</h3>
                  <FormDescription className="mb-4">Select the styles that best describe how you travel.</FormDescription>
                  <div className="flex flex-wrap gap-2">
                    {TRAVEL_STYLES.map((style) => {
                      const isSelected = form.watch('travelPreferences').includes(style);
                      return (
                        <Badge
                          key={style}
                          variant={isSelected ? 'default' : 'outline'}
                          className="cursor-pointer capitalize text-sm py-1.5 px-3"
                          onClick={() => toggleTravelStyle(style)}
                        >
                          {style.replace('_', ' ')}
                        </Badge>
                      );
                    })}
                  </div>
                </div>

                <div className="flex justify-end gap-4 pt-4 border-t">
                  <Button variant="outline" type="button" asChild>
                    <Link href="/profile">Cancel</Link>
                  </Button>
                  <Button type="submit" disabled={isUpdating || !form.formState.isDirty}>
                    {isUpdating ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                    Save Changes
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

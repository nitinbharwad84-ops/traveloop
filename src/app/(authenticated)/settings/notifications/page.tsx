'use client';

import { useProfile } from '@/features/profile/hooks/useProfile';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

export default function SettingsNotificationsPage() {
  const { profile, updateProfile, isUpdating } = useProfile();

  if (!profile) return null;

  const handleToggle = async (key: 'email' | 'push' | 'in_app') => {
    const currentPrefs = profile.notificationPreferences || { email: true, push: false, in_app: true };
    await updateProfile({
      notificationPreferences: {
        ...currentPrefs,
        [key]: !currentPrefs[key]
      }
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Notifications</h3>
        <p className="text-sm text-muted-foreground">
          Configure how you receive notifications.
        </p>
      </div>

      <Card className="shadow-none">
        <CardHeader>
          <CardTitle>Communication Preferences</CardTitle>
          <CardDescription>Select which notifications you want to receive.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between space-x-2">
            <div className="space-y-0.5">
              <Label className="text-base">Email Notifications</Label>
              <p className="text-sm text-muted-foreground">Receive trip updates and promotions via email.</p>
            </div>
            <Switch 
              checked={profile.notificationPreferences?.email ?? true} 
              onCheckedChange={() => handleToggle('email')}
              disabled={isUpdating}
            />
          </div>
          
          <div className="flex items-center justify-between space-x-2">
            <div className="space-y-0.5">
              <Label className="text-base">In-App Notifications</Label>
              <p className="text-sm text-muted-foreground">See notifications within the Traveloop app.</p>
            </div>
            <Switch 
              checked={profile.notificationPreferences?.in_app ?? true} 
              onCheckedChange={() => handleToggle('in_app')}
              disabled={isUpdating}
            />
          </div>
          
          <div className="flex items-center justify-between space-x-2">
            <div className="space-y-0.5">
              <Label className="text-base">Push Notifications</Label>
              <p className="text-sm text-muted-foreground">Receive push notifications on your mobile device.</p>
            </div>
            <Switch 
              checked={profile.notificationPreferences?.push ?? false} 
              onCheckedChange={() => handleToggle('push')}
              disabled={isUpdating}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

export default function SettingsPrivacyPage() {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Privacy</h3>
        <p className="text-sm text-muted-foreground">
          Manage who can see your profile and trips.
        </p>
      </div>

      <Card className="shadow-none">
        <CardHeader>
          <CardTitle>Profile Visibility</CardTitle>
          <CardDescription>Control how your profile appears to other users.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between space-x-2">
            <div className="space-y-0.5">
              <Label className="text-base">Public Profile</Label>
              <p className="text-sm text-muted-foreground">Allow others to find your profile in searches.</p>
            </div>
            <Switch defaultChecked />
          </div>
          
          <div className="flex items-center justify-between space-x-2">
            <div className="space-y-0.5">
              <Label className="text-base">Show Trip Stats</Label>
              <p className="text-sm text-muted-foreground">Display your total trips count on your profile.</p>
            </div>
            <Switch defaultChecked />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

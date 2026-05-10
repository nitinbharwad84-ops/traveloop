'use client';

import { useTheme } from 'next-themes';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function SettingsPreferencesPage() {
  const { setTheme, theme } = useTheme();

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Preferences</h3>
        <p className="text-sm text-muted-foreground">
          Customize your app experience.
        </p>
      </div>

      <Card className="shadow-none">
        <CardHeader>
          <CardTitle>Appearance</CardTitle>
          <CardDescription>Select your preferred theme.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <Button 
              variant={theme === 'light' ? 'default' : 'outline'} 
              onClick={() => setTheme('light')}
            >
              Light
            </Button>
            <Button 
              variant={theme === 'dark' ? 'default' : 'outline'} 
              onClick={() => setTheme('dark')}
            >
              Dark
            </Button>
            <Button 
              variant={theme === 'system' ? 'default' : 'outline'} 
              onClick={() => setTheme('system')}
            >
              System
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

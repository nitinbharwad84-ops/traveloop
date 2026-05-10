'use client';

import { useState } from 'react';
import { useProfile } from '@/features/profile/hooks/useProfile';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Loader2, AlertTriangle } from 'lucide-react';
import { Input } from '@/components/ui/input';

export default function SettingsAccountPage() {
  const { deleteAccount, isDeletingAccount } = useProfile();
  const [confirmText, setConfirmText] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  const handleDelete = async () => {
    if (confirmText === 'DELETE') {
      await deleteAccount();
      setIsOpen(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Account Settings</h3>
        <p className="text-sm text-muted-foreground">
          Manage your account security and deletion.
        </p>
      </div>
      
      <Card className="border-destructive/20 shadow-none">
        <CardHeader>
          <CardTitle className="text-destructive flex items-center gap-2">
            <AlertTriangle className="h-5 w-5" />
            Danger Zone
          </CardTitle>
          <CardDescription>
            Permanently delete your Traveloop account and all of your content.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
              <Button variant="destructive">Delete Account</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Are you absolutely sure?</DialogTitle>
                <DialogDescription>
                  This action cannot be undone. This will permanently delete your account
                  and remove your data from our servers, including all your planned trips.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <p className="text-sm font-medium">Please type <span className="font-bold">DELETE</span> to confirm.</p>
                <Input 
                  value={confirmText} 
                  onChange={(e) => setConfirmText(e.target.value)} 
                  placeholder="DELETE"
                />
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsOpen(false)} disabled={isDeletingAccount}>
                  Cancel
                </Button>
                <Button 
                  variant="destructive" 
                  onClick={handleDelete} 
                  disabled={confirmText !== 'DELETE' || isDeletingAccount}
                >
                  {isDeletingAccount ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                  Delete Account
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </CardContent>
      </Card>
    </div>
  );
}

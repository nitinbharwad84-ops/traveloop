import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2, Link as LinkIcon, Globe, Lock } from 'lucide-react';
import { toast } from 'sonner';

interface Props {
  onCreate: (data: { visibility: string; expiresAt: string | null }) => Promise<void>;
  isCreating: boolean;
}

export function CreateShareLinkForm({ onCreate, isCreating }: Props) {
  const [visibility, setVisibility] = useState('public_');
  const [expiresInDays, setExpiresInDays] = useState<string>('never');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    let expiresAt: string | null = null;
    if (expiresInDays !== 'never') {
      const days = parseInt(expiresInDays, 10);
      const date = new Date();
      date.setDate(date.getDate() + days);
      expiresAt = date.toISOString();
    }
    
    try {
      await onCreate({ visibility, expiresAt });
      toast.success('Share link generated successfully!');
      setExpiresInDays('never');
      setVisibility('public_');
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Failed to generate link.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-card p-6 rounded-2xl border shadow-sm space-y-6">
      <div>
        <h3 className="font-semibold text-lg tracking-tight mb-1">Generate Share Link</h3>
        <p className="text-sm text-muted-foreground">Create a secure link to share your trip itinerary.</p>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Visibility</label>
          <Select value={visibility} onValueChange={setVisibility} disabled={isCreating}>
            <SelectTrigger className="bg-muted/50">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="public_">
                <div className="flex items-center">
                  <Globe className="h-4 w-4 mr-2 text-green-600" />
                  Anyone with the link
                </div>
              </SelectItem>
              <SelectItem value="invite_only">
                <div className="flex items-center">
                  <Lock className="h-4 w-4 mr-2 text-amber-600" />
                  Must be signed in
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Expiration</label>
          <Select value={expiresInDays} onValueChange={setExpiresInDays} disabled={isCreating}>
            <SelectTrigger className="bg-muted/50">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="never">Never expires</SelectItem>
              <SelectItem value="1">1 Day</SelectItem>
              <SelectItem value="7">7 Days</SelectItem>
              <SelectItem value="30">30 Days</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Button type="submit" disabled={isCreating} className="w-full sm:w-auto">
        {isCreating ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <LinkIcon className="h-4 w-4 mr-2" />}
        Generate Link
      </Button>
    </form>
  );
}

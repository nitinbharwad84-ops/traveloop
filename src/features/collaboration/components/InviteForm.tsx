import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Mail, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

interface Props {
  onInvite: (email: string, role: string) => Promise<void>;
  isInviting: boolean;
}

export function InviteForm({ onInvite, isInviting }: Props) {
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('editor');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !email.includes('@')) {
      toast.error('Please enter a valid email address.');
      return;
    }
    
    try {
      await onInvite(email, role);
      toast.success('Invitation sent successfully!');
      setEmail('');
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Failed to send invite.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-card p-6 rounded-2xl border shadow-sm space-y-4">
      <div>
        <h3 className="font-semibold text-lg tracking-tight mb-1">Invite Collaborator</h3>
        <p className="text-sm text-muted-foreground">Send an email invitation to plan this trip together.</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            type="email" 
            placeholder="colleague@example.com" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="pl-9 bg-muted/50"
            disabled={isInviting}
          />
        </div>
        
        <Select value={role} onValueChange={setRole} disabled={isInviting}>
          <SelectTrigger className="w-full sm:w-[140px] bg-muted/50">
            <SelectValue placeholder="Role" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="editor">Editor</SelectItem>
            <SelectItem value="viewer">Viewer</SelectItem>
          </SelectContent>
        </Select>

        <Button type="submit" disabled={!email.trim() || isInviting} className="w-full sm:w-auto">
          {isInviting ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
          Send Invite
        </Button>
      </div>
    </form>
  );
}

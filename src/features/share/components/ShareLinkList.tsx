import { SharedLinkData } from '@/services/share.service';
import { Button } from '@/components/ui/button';
import { Copy, Trash2, Globe, Lock, Clock } from 'lucide-react';
import { format } from 'date-fns';
import { toast } from 'sonner';

interface Props {
  links: SharedLinkData[];
  onRevoke: (linkId: string) => void;
}

export function ShareLinkList({ links, onRevoke }: Props) {
  
  const handleCopy = (token: string) => {
    const url = `${window.location.origin}/shared/${token}`;
    navigator.clipboard.writeText(url);
    toast.success('Link copied to clipboard');
  };

  if (links.length === 0) {
    return (
      <div className="text-center py-12 border-2 border-dashed rounded-2xl bg-card">
        <Globe className="h-8 w-8 mx-auto mb-3 opacity-20" />
        <p className="text-lg font-medium text-muted-foreground">No active share links.</p>
        <p className="text-sm text-muted-foreground mt-1">Generate one above to start sharing.</p>
      </div>
    );
  }

  return (
    <div className="bg-card rounded-2xl border shadow-sm divide-y">
      {links.map(link => {
        const isExpired = link.expiresAt ? new Date(link.expiresAt) < new Date() : false;
        
        return (
          <div key={link.id} className={`p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 transition-opacity ${isExpired ? 'opacity-60 grayscale' : ''}`}>
            
            <div className="space-y-1 min-w-0 flex-1">
              <div className="flex items-center gap-2">
                {link.visibility === 'public_' ? (
                  <Globe className="h-4 w-4 text-green-600" />
                ) : (
                  <Lock className="h-4 w-4 text-amber-600" />
                )}
                <span className="font-semibold text-sm capitalize">
                  {link.visibility.replace('_', ' ')} Link
                </span>
                {isExpired && (
                  <span className="text-[10px] uppercase tracking-wider font-bold bg-destructive/10 text-destructive px-2 py-0.5 rounded-full">
                    Expired
                  </span>
                )}
              </div>
              
              <div className="flex items-center gap-4 text-xs text-muted-foreground">
                <span>Created {format(new Date(link.createdAt), 'MMM d, yyyy')}</span>
                {link.expiresAt && (
                  <span className="flex items-center gap-1">
                    <Clock className="h-3 w-3" /> 
                    Expires {format(new Date(link.expiresAt), 'MMM d, yyyy')}
                  </span>
                )}
              </div>
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <Button 
                variant="secondary" 
                className="flex-1 sm:flex-none"
                onClick={() => handleCopy(link.token)}
                disabled={isExpired}
              >
                <Copy className="h-4 w-4 mr-2" /> Copy Link
              </Button>
              
              <Button 
                variant="outline" 
                size="icon"
                className="text-destructive hover:bg-destructive/10 hover:text-destructive border-destructive/20 shrink-0"
                onClick={() => onRevoke(link.id)}
                title="Revoke Link"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
            
          </div>
        );
      })}
    </div>
  );
}

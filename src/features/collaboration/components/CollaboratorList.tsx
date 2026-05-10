import { CollaboratorData } from '@/services/collaboration.service';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { MoreHorizontal, Trash2, CheckCircle2, Clock } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

interface Props {
  collaborators: CollaboratorData[];
  currentUserId: string | null;
  onUpdateRole: (collabId: string, role: string) => void;
  onRemove: (collabId: string) => void;
  isOwner: boolean;
}

export function CollaboratorList({ collaborators, currentUserId, onUpdateRole, onRemove, isOwner }: Props) {
  
  if (collaborators.length === 0) {
    return (
      <div className="text-center py-12 border-2 border-dashed rounded-2xl bg-card">
        <p className="text-lg font-medium text-muted-foreground">No collaborators yet.</p>
      </div>
    );
  }

  return (
    <div className="bg-card rounded-2xl border shadow-sm divide-y">
      {collaborators.map(collab => {
        const isMe = collab.userId === currentUserId;
        const profile = collab.user.profile;
        const firstName = profile?.firstName || '';
        const lastName = profile?.lastName || '';
        const initials = firstName ? firstName.substring(0, 2).toUpperCase() : collab.user.email.substring(0, 2).toUpperCase();
        
        return (
          <div key={collab.id} className="p-4 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3 min-w-0">
              <Avatar>
                <AvatarImage src={profile?.avatarUrl || ''} />
                <AvatarFallback className={isMe ? 'bg-primary text-primary-foreground' : ''}>
                  {initials}
                </AvatarFallback>
              </Avatar>
              
              <div className="flex flex-col truncate">
                <div className="flex items-center gap-2">
                  <span className="font-semibold truncate">
                    {firstName ? `${firstName} ${lastName}` : 'Unknown User'}
                    {isMe && <span className="ml-2 text-xs font-normal text-muted-foreground">(You)</span>}
                  </span>
                  
                  {collab.role === 'owner' && <Badge variant="secondary" className="text-[10px] uppercase h-5 bg-blue-500/10 text-blue-600">Owner</Badge>}
                </div>
                <span className="text-sm text-muted-foreground truncate">{collab.user.email}</span>
              </div>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              {/* Status Badge */}
              {collab.status === 'pending' ? (
                <div className="flex items-center text-xs text-amber-600 font-medium bg-amber-500/10 px-2.5 py-1 rounded-full">
                  <Clock className="h-3 w-3 mr-1" /> Pending
                </div>
              ) : collab.status === 'accepted' ? (
                <div className="flex items-center text-xs text-green-600 font-medium bg-green-500/10 px-2.5 py-1 rounded-full">
                  <CheckCircle2 className="h-3 w-3 mr-1" /> Accepted
                </div>
              ) : null}

              {/* Role Selector or Display */}
              {isOwner && !isMe && collab.role !== 'owner' ? (
                <Select value={collab.role} onValueChange={(val) => onUpdateRole(collab.id, val)}>
                  <SelectTrigger className="w-[110px] h-8 text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="editor">Editor</SelectItem>
                    <SelectItem value="viewer">Viewer</SelectItem>
                  </SelectContent>
                </Select>
              ) : (
                <span className="text-sm font-medium capitalize w-[110px] text-right hidden sm:block text-muted-foreground">
                  {collab.role}
                </span>
              )}

              {/* Action Menu */}
              {(isOwner || isMe) && collab.role !== 'owner' && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem 
                      className="text-destructive focus:bg-destructive/10 focus:text-destructive"
                      onClick={() => onRemove(collab.id)}
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      {isMe ? 'Leave Trip' : 'Remove User'}
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

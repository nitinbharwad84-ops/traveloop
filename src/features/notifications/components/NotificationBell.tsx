'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useNotifications } from '../hooks/useNotifications';
import { Bell, Check, Loader2, Sparkles, UserPlus, Wallet, CalendarClock, MessageSquare } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';

export const getNotificationIcon = (type: string) => {
  switch (type) {
    case 'collab_invite': return <UserPlus className="h-4 w-4 text-blue-500" />;
    case 'budget_alert': return <Wallet className="h-4 w-4 text-red-500" />;
    case 'trip_reminder': return <CalendarClock className="h-4 w-4 text-amber-500" />;
    case 'ai_complete': return <Sparkles className="h-4 w-4 text-primary" />;
    default: return <MessageSquare className="h-4 w-4 text-muted-foreground" />;
  }
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const getNotificationMessage = (type: string, payload: any) => {
  switch (type) {
    case 'collab_invite': return `You've been invited to ${payload.tripTitle || 'a trip'}`;
    case 'budget_alert': return `Budget alert for ${payload.category || 'a category'}`;
    case 'trip_reminder': return `Upcoming trip: ${payload.tripTitle || 'Reminder'}`;
    case 'ai_complete': return `AI has finished generating your ${payload.feature || 'plan'}`;
    default: return payload.message || 'New notification';
  }
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const getNotificationLink = (type: string, payload: any) => {
  if (payload.tripId) {
    return type === 'collab_invite' ? `/trips/${payload.tripId}/collaborators` : `/trips/${payload.tripId}`;
  }
  return '/notifications';
};

export function NotificationBell() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const { notifications, unreadCount, markAsRead, markAllAsRead, isLoading } = useNotifications();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleNotificationClick = (id: string, type: string, payload: any) => {
    markAsRead.mutate(id);
    setOpen(false);
    const link = getNotificationLink(type, payload);
    router.push(link);
  };

  const recentNotifications = notifications.slice(0, 5);

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative h-9 w-9">
          <Bell className="h-[1.2rem] w-[1.2rem] transition-all" />
          {unreadCount > 0 && (
            <span className="absolute top-1 right-1 flex h-2 w-2 rounded-full bg-red-600 ring-2 ring-background"></span>
          )}
          <span className="sr-only">Notifications</span>
        </Button>
      </DropdownMenuTrigger>
      
      <DropdownMenuContent align="end" className="w-80 p-0 overflow-hidden rounded-xl border-border/50 shadow-xl">
        <div className="flex items-center justify-between px-4 py-3 bg-muted/30">
          <h3 className="font-semibold text-sm">Notifications</h3>
          {unreadCount > 0 && (
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-auto p-0 text-xs text-primary hover:text-primary/80 hover:bg-transparent"
              onClick={(e) => {
                e.preventDefault();
                markAllAsRead.mutate();
              }}
              disabled={markAllAsRead.isPending}
            >
              {markAllAsRead.isPending ? <Loader2 className="h-3 w-3 animate-spin mr-1" /> : <Check className="h-3 w-3 mr-1" />}
              Mark all read
            </Button>
          )}
        </div>
        <DropdownMenuSeparator className="m-0" />
        
        <div className="max-h-[300px] overflow-y-auto">
          {isLoading ? (
            <div className="flex justify-center p-4">
              <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
            </div>
          ) : recentNotifications.length > 0 ? (
            <div className="flex flex-col">
              {recentNotifications.map((n) => (
                <DropdownMenuItem 
                  key={n.id}
                  className={`flex items-start gap-3 p-3 cursor-pointer rounded-none border-b border-border/50 last:border-0 ${!n.read ? 'bg-primary/5' : ''}`}
                  onClick={() => handleNotificationClick(n.id, n.notification_type, n.payload)}
                >
                  <div className={`mt-0.5 shrink-0 h-8 w-8 rounded-full flex items-center justify-center ${!n.read ? 'bg-background shadow-sm' : 'bg-muted'}`}>
                    {getNotificationIcon(n.notification_type)}
                  </div>
                  <div className="flex flex-col gap-1 overflow-hidden">
                    <p className={`text-sm truncate ${!n.read ? 'font-medium' : 'text-muted-foreground'}`}>
                      {getNotificationMessage(n.notification_type, n.payload)}
                    </p>
                    <span className="text-[10px] text-muted-foreground">
                      {formatDistanceToNow(new Date(n.created_at), { addSuffix: true })}
                    </span>
                  </div>
                  {!n.read && (
                    <div className="shrink-0 h-2 w-2 rounded-full bg-primary mt-2"></div>
                  )}
                </DropdownMenuItem>
              ))}
            </div>
          ) : (
            <div className="py-8 text-center text-sm text-muted-foreground">
              <Bell className="h-8 w-8 mx-auto mb-3 opacity-20" />
              <p>No notifications yet</p>
            </div>
          )}
        </div>
        
        <DropdownMenuSeparator className="m-0" />
        <div className="p-2 bg-muted/10">
          <Button variant="ghost" size="sm" className="w-full text-xs" asChild onClick={() => setOpen(false)}>
            <Link href="/notifications">View all notifications</Link>
          </Button>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

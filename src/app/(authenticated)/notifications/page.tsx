'use client';

import { useRouter } from 'next/navigation';
import { useNotifications } from '@/features/notifications/hooks/useNotifications';
import { 
  getNotificationIcon, 
  getNotificationMessage, 
  getNotificationLink 
} from '@/features/notifications/components/NotificationBell';
import { formatDistanceToNow } from 'date-fns';
import { Loader2, CheckCircle2, Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function NotificationsPage() {
  const router = useRouter();
  const { notifications, unreadCount, markAsRead, markAllAsRead, isLoading } = useNotifications();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleNotificationClick = (id: string, type: string, payload: any) => {
    markAsRead.mutate(id);
    router.push(getNotificationLink(type, payload));
  };

  return (
    <div className="container max-w-4xl py-12 animate-in fade-in duration-500 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Notifications</h1>
          <p className="text-muted-foreground mt-1">
            You have {unreadCount} unread notification{unreadCount === 1 ? '' : 's'}.
          </p>
        </div>
        
        {unreadCount > 0 && (
          <Button 
            variant="outline" 
            onClick={() => markAllAsRead.mutate()}
            disabled={markAllAsRead.isPending}
            className="hidden sm:flex"
          >
            {markAllAsRead.isPending ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <CheckCircle2 className="h-4 w-4 mr-2" />}
            Mark all as read
          </Button>
        )}
      </div>

      <div className="bg-card border rounded-2xl shadow-sm overflow-hidden">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
            <Loader2 className="h-8 w-8 animate-spin mb-4" />
            <p>Loading your notifications...</p>
          </div>
        ) : notifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
            <Bell className="h-12 w-12 mb-4 opacity-20" />
            <p className="text-lg font-medium">You&apos;re all caught up!</p>
            <p className="text-sm">No new notifications to show right now.</p>
          </div>
        ) : (
          <div className="divide-y">
            {notifications.map((n) => (
              <div 
                key={n.id}
                className={`flex items-start gap-4 p-5 sm:p-6 transition-colors hover:bg-muted/30 cursor-pointer ${
                  !n.read ? 'bg-primary/5' : ''
                }`}
                onClick={() => handleNotificationClick(n.id, n.notificationType, n.payload)}
              >
                <div className={`mt-1 shrink-0 h-10 w-10 sm:h-12 sm:w-12 rounded-full flex items-center justify-center ${
                  !n.read ? 'bg-background shadow-sm border border-primary/20' : 'bg-muted'
                }`}>
                  {getNotificationIcon(n.notificationType)}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start gap-2">
                    <p className={`text-base sm:text-lg ${!n.read ? 'font-semibold' : 'text-muted-foreground'}`}>
                      {getNotificationMessage(n.notificationType, n.payload)}
                    </p>
                    {!n.read && (
                      <div className="shrink-0 h-2.5 w-2.5 rounded-full bg-primary mt-2"></div>
                    )}
                  </div>
                  
                  {/* Contextual Sub-message based on type */}
                  {n.notificationType === 'collab_invite' && (
                    <p className="text-sm text-muted-foreground mt-1">
                      {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                      You&apos;ve been assigned the <strong>{(n.payload as any)?.role}</strong> role. Click to view the itinerary.
                    </p>
                  )}
                  {n.notificationType === 'ai_complete' && (
                    <p className="text-sm text-muted-foreground mt-1">
                      {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                      Your AI {(n.payload as any)?.feature} generation is complete and ready for review.
                    </p>
                  )}

                  <p className="text-xs text-muted-foreground mt-2 font-medium">
                    {formatDistanceToNow(new Date(n.createdAt), { addSuffix: true })}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

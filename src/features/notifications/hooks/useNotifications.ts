import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { notificationService } from '@/services/notification.service';
import type { Notification } from '@prisma/client';
import { toast } from 'sonner';

export const notificationKeys = {
  all: ['notifications'] as const,
};

export function useNotifications() {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: notificationKeys.all,
    queryFn: () => notificationService.getNotifications(),
    refetchInterval: 60000, // Poll every 60 seconds
  });

  const markAsRead = useMutation({
    mutationFn: (id: string) => notificationService.markAsRead(id),
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: notificationKeys.all });
      const previous = queryClient.getQueryData<Notification[]>(notificationKeys.all);
      
      if (previous) {
        queryClient.setQueryData<Notification[]>(
          notificationKeys.all,
          previous.map(n => n.id === id ? { ...n, read: true } : n)
        );
      }
      return { previous };
    },
    onError: (_err, _newVal, context) => {
      if (context?.previous) {
        queryClient.setQueryData(notificationKeys.all, context.previous);
      }
      toast.error('Failed to mark notification as read');
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: notificationKeys.all });
    },
  });

  const markAllAsRead = useMutation({
    mutationFn: () => notificationService.markAllAsRead(),
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: notificationKeys.all });
      const previous = queryClient.getQueryData<Notification[]>(notificationKeys.all);
      
      if (previous) {
        queryClient.setQueryData<Notification[]>(
          notificationKeys.all,
          previous.map(n => ({ ...n, read: true }))
        );
      }
      return { previous };
    },
    onError: (_err, _newVal, context) => {
      if (context?.previous) {
        queryClient.setQueryData(notificationKeys.all, context.previous);
      }
      toast.error('Failed to mark all as read');
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: notificationKeys.all });
    },
  });

  return {
    ...query,
    notifications: query.data || [],
    unreadCount: (query.data || []).filter(n => !n.read).length,
    markAsRead,
    markAllAsRead,
  };
}

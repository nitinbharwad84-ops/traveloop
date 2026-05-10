import type { DbNotification } from '@/types';

type Notification = DbNotification;

export const notificationService = {
  async getNotifications(): Promise<Notification[]> {
    const res = await fetch('/api/v1/notifications');
    const data = await res.json();
    if (!data.success) throw new Error(data.error);
    return data.data;
  },

  async markAsRead(id: string): Promise<Notification> {
    const res = await fetch(`/api/v1/notifications/${id}/read`, {
      method: 'PATCH',
    });
    const data = await res.json();
    if (!data.success) throw new Error(data.error);
    return data.data;
  },

  async markAllAsRead(): Promise<{ count: number }> {
    const res = await fetch('/api/v1/notifications/read-all', {
      method: 'POST',
    });
    const data = await res.json();
    if (!data.success) throw new Error(data.error);
    return data.data;
  },
};

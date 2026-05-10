import { prisma } from '@/lib/prisma/client';

export type NotificationType = 'collab_invite' | 'budget_alert' | 'trip_reminder' | 'ai_complete';

interface CreateNotificationParams {
  userId: string;
  type: NotificationType;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  payload: Record<string, any>;
}

export async function createNotification({ userId, type, payload }: CreateNotificationParams) {
  try {
    const notification = await prisma.notification.create({
      data: {
        userId,
        notificationType: type,
        payload,
      },
    });
    return { success: true, data: notification };
  } catch (error) {
    console.error('Failed to create notification:', error);
    return { success: false, error: 'Failed to create notification' };
  }
}

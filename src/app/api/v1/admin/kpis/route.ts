import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma/client';
import { requireAdmin, handleAdminError } from '@/lib/admin';

export async function GET() {
  try {
    await requireAdmin();

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const [totalUsers, totalTrips, activeUsersToday, aiCallsToday] = await Promise.all([
      prisma.user.count(),
      prisma.trip.count(),
      prisma.user.count({
        where: { lastLoginAt: { gte: today } }
      }),
      prisma.aiUsageLog.count({
        where: { createdAt: { gte: today } }
      })
    ]);

    return NextResponse.json({
      success: true,
      data: {
        totalUsers,
        totalTrips,
        activeUsersToday,
        aiCallsToday
      }
    });
  } catch (error) {
    return handleAdminError(error);
  }
}

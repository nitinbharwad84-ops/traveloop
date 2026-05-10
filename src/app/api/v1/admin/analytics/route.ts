import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma/client';
import { requireAdmin, handleAdminError } from '@/lib/admin';

export async function GET() {
  try {
    await requireAdmin();

    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    // Grouping by date requires raw query or manual grouping in Prisma.
    // For simplicity, fetch recent logs and group in memory.
    const logs = await prisma.aiUsageLog.findMany({
      where: { createdAt: { gte: thirtyDaysAgo } },
      select: { createdAt: true, promptTokens: true, completionTokens: true, model: true }
    });

    // Group by date (YYYY-MM-DD)
    const dailyData: Record<string, { date: string, gemini: number, groq: number, tokens: number }> = {};

    logs.forEach(log => {
      const dateKey = log.createdAt.toISOString().split('T')[0] as string;
      if (!dailyData[dateKey]) {
        dailyData[dateKey] = { date: dateKey, gemini: 0, groq: 0, tokens: 0 };
      }
      
      if (log.model.toLowerCase().includes('gemini')) {
        dailyData[dateKey].gemini += 1;
      } else {
        dailyData[dateKey].groq += 1;
      }
      
      dailyData[dateKey].tokens += (log.promptTokens + log.completionTokens);
    });

    const chartData = Object.values(dailyData).sort((a, b) => a.date.localeCompare(b.date));

    return NextResponse.json({ success: true, data: chartData });
  } catch (error) {
    return handleAdminError(error);
  }
}

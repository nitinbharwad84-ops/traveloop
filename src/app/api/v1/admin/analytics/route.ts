import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { requireAdmin, handleAdminError } from '@/lib/admin';

export async function GET() {
  try {
    await requireAdmin();
    const supabase = createClient();

    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const { data: logs } = await supabase
      .from('ai_usage_logs')
      .select('created_at, prompt_tokens, completion_tokens, model')
      .gte('created_at', thirtyDaysAgo.toISOString());

    const dailyData: Record<string, { date: string, gemini: number, groq: number, tokens: number }> = {};

    (logs || []).forEach(log => {
      const dateKey = new Date(log.created_at).toISOString().split('T')[0] as string;
      if (!dailyData[dateKey]) {
        dailyData[dateKey] = { date: dateKey, gemini: 0, groq: 0, tokens: 0 };
      }
      if (log.model.toLowerCase().includes('gemini')) dailyData[dateKey].gemini += 1;
      else dailyData[dateKey].groq += 1;
      dailyData[dateKey].tokens += (log.prompt_tokens + log.completion_tokens);
    });

    const chartData = Object.values(dailyData).sort((a, b) => a.date.localeCompare(b.date));
    return NextResponse.json({ success: true, data: chartData });
  } catch (error) {
    return handleAdminError(error);
  }
}

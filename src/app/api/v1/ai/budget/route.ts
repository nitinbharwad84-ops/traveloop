import { NextResponse } from 'next/server';
import { z } from 'zod';
import { callAiGateway, checkAiRateLimit } from '@/lib/ai/gateway';
import { buildBudgetPredictorPrompt } from '@/lib/ai/prompts/budget-predictor';
import { getCurrentUserId } from '@/lib/rbac';

const inputSchema = z.object({
  destinations: z.array(z.string()).min(1),
  travelerCount: z.number().int().min(1).max(20),
  duration: z.number().int().min(1).max(90),
  tripStyle: z.string().min(2),
  season: z.string().min(2),
  currency: z.string().default('USD'),
});

const outputSchema = z.object({
  categories: z.array(z.object({
    name: z.string(),
    estimated_amount: z.number(),
    reasoning: z.string(),
    confidence: z.enum(['low', 'medium', 'high']),
  })),
  total: z.number(),
  currency: z.string(),
  warnings: z.array(z.string()),
  notes: z.string().optional(),
});

export type BudgetPrediction = z.infer<typeof outputSchema>;

export async function POST(request: Request) {
  try {
    const userId = await getCurrentUserId();
    if (!userId) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });

    const { allowed, remaining } = await checkAiRateLimit(userId);
    if (!allowed) {
      return NextResponse.json({ success: false, error: 'Daily AI limit reached.' }, { status: 429 });
    }

    const body = await request.json();
    const input = inputSchema.parse(body);
    const { system, prompt } = buildBudgetPredictorPrompt(input);

    const prediction = await callAiGateway({
      userId,
      feature: 'budget_predict',
      schema: outputSchema,
      prompt,
      systemPrompt: system,
    });

    return NextResponse.json({ success: true, data: prediction, meta: { remaining: remaining - 1 } });
  } catch (err: unknown) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ success: false, error: 'Invalid input', details: err.flatten() }, { status: 400 });
    }
    if (err instanceof Error && err.message === 'RATE_LIMIT_EXCEEDED') {
      return NextResponse.json({ success: false, error: 'Daily AI limit reached.' }, { status: 429 });
    }
    console.error('AI Budget Error:', err);
    return NextResponse.json({ success: false, error: 'AI service unavailable.' }, { status: 503 });
  }
}

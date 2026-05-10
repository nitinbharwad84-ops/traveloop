import { NextResponse } from 'next/server';
import { z } from 'zod';
import { callAiGateway, checkAiRateLimit } from '@/lib/ai/gateway';
import { buildTripPlannerPrompt } from '@/lib/ai/prompts/trip-planner';
import { getCurrentUserId } from '@/lib/rbac';

// ─── Input Schema ─────────────────────────────────────────────────────────────
const inputSchema = z.object({
  destination: z.string().min(2),
  duration: z.number().int().min(1).max(30),
  travelerCount: z.number().int().min(1).max(20),
  budget: z.number().positive(),
  currency: z.string().default('USD'),
  tripStyle: z.string().min(2),
  preferences: z.string().optional(),
  season: z.string().optional(),
});

// ─── Output Schema ────────────────────────────────────────────────────────────
const outputSchema = z.object({
  trip_title: z.string(),
  destinations: z.array(z.string()),
  days: z.array(z.object({
    day: z.number(),
    city: z.string(),
    activities: z.array(z.object({
      title: z.string(),
      description: z.string(),
      category: z.string(),
      estimated_cost: z.number(),
      duration_minutes: z.number(),
      time_slot: z.enum(['morning', 'afternoon', 'evening', 'full_day']).optional(),
    })),
  })),
  estimated_budget: z.object({
    total: z.number(),
    breakdown: z.record(z.string(), z.number()),
  }),
  assumptions: z.array(z.string()),
  warnings: z.array(z.string()),
});

export type TripPlan = z.infer<typeof outputSchema>;

export async function POST(request: Request) {
  try {
    const userId = await getCurrentUserId();
    if (!userId) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });

    // Check rate limit first (fast-fail before DB write)
    const { allowed, remaining } = await checkAiRateLimit(userId);
    if (!allowed) {
      return NextResponse.json(
        { success: false, error: 'Daily AI limit reached (10 calls/day). Upgrade to Pro for unlimited access.' },
        { status: 429, headers: { 'X-RateLimit-Remaining': '0' } }
      );
    }

    const body = await request.json();
    const input = inputSchema.parse(body);
    const { system, prompt } = buildTripPlannerPrompt(input);

    const plan = await callAiGateway({
      userId,
      feature: 'plan_trip',
      schema: outputSchema,
      prompt,
      systemPrompt: system,
    });

    return NextResponse.json({ 
      success: true, 
      data: plan,
      meta: { remaining: remaining - 1 }
    });
  } catch (err: unknown) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ success: false, error: 'Invalid input', details: err.flatten() }, { status: 400 });
    }
    if (err instanceof Error) {
      if (err.message === 'RATE_LIMIT_EXCEEDED') {
        return NextResponse.json({ success: false, error: 'Daily AI limit reached.' }, { status: 429 });
      }
      if (err.message === 'AI_TIMEOUT') {
        return NextResponse.json({ success: false, error: 'AI request timed out. Please try again.' }, { status: 504 });
      }
    }
    console.error('AI Plan Trip Error:', err);
    return NextResponse.json({ success: false, error: 'AI service unavailable. Please try again.' }, { status: 503 });
  }
}

import { NextResponse } from 'next/server';
import { z } from 'zod';
import { callAiGateway, checkAiRateLimit } from '@/lib/ai/gateway';
import { buildPackingGeneratorPrompt } from '@/lib/ai/prompts/packing-generator';
import { getCurrentUserId } from '@/lib/rbac';

const inputSchema = z.object({
  destination: z.string().min(2),
  season: z.string().min(2),
  duration: z.number().int().min(1).max(90),
  travelerType: z.enum(['solo', 'couple', 'family', 'group']),
  tripType: z.enum(['beach', 'mountain', 'city', 'business', 'adventure', 'cultural', 'wellness']),
  specificNeeds: z.string().optional(),
});

const packingItemSchema = z.object({
  name: z.string(),
  quantity: z.number().optional(),
  essential: z.boolean(),
  notes: z.string().optional(),
});

const outputSchema = z.object({
  categories: z.array(z.object({
    name: z.string(),
    category_key: z.enum(['clothing', 'electronics', 'documents', 'hygiene', 'medicine', 'accessories', 'travel_gear']),
    items: z.array(packingItemSchema),
  })),
  destination_tips: z.array(z.string()),
  total_items: z.number(),
});

export type PackingList = z.infer<typeof outputSchema>;

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
    const { system, prompt } = buildPackingGeneratorPrompt(input);

    const list = await callAiGateway({
      userId,
      feature: 'packing_generate',
      schema: outputSchema,
      prompt,
      systemPrompt: system,
    });

    return NextResponse.json({ success: true, data: list, meta: { remaining: remaining - 1 } });
  } catch (err: unknown) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ success: false, error: 'Invalid input', details: err.flatten() }, { status: 400 });
    }
    if (err instanceof Error && err.message === 'RATE_LIMIT_EXCEEDED') {
      return NextResponse.json({ success: false, error: 'Daily AI limit reached.' }, { status: 429 });
    }
    console.error('AI Packing Error:', err);
    return NextResponse.json({ success: false, error: 'AI service unavailable.' }, { status: 503 });
  }
}

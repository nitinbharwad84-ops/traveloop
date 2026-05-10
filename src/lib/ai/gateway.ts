import { google } from '@ai-sdk/google';
import { groq } from '@ai-sdk/groq';
import { generateObject } from 'ai';
import { z, ZodSchema } from 'zod';
import { prisma } from '@/lib/prisma/client';

const AI_DAILY_LIMIT = 10;
const AI_TIMEOUT_MS = 30_000;

const GEMINI_MODEL = 'gemini-2.0-flash-exp';
const GROQ_MODEL = 'llama-3.1-70b-versatile';

// ─── Rate Limit Check ─────────────────────────────────────────────────────────

export async function checkAiRateLimit(userId: string): Promise<{ allowed: boolean; remaining: number }> {
  const startOfDay = new Date();
  startOfDay.setHours(0, 0, 0, 0);

  const count = await prisma.aiUsageLog.count({
    where: {
      userId,
      createdAt: { gte: startOfDay },
    },
  });

  const remaining = Math.max(0, AI_DAILY_LIMIT - count);
  return { allowed: count < AI_DAILY_LIMIT, remaining };
}

// ─── Usage Logger ─────────────────────────────────────────────────────────────

async function logUsage(data: {
  userId: string;
  feature: string;
  model: string;
  promptTokens: number;
  completionTokens: number;
  latencyMs: number;
  success: boolean;
}) {
  try {
    await prisma.aiUsageLog.create({
      data: {
        userId: data.userId,
        feature: data.feature,
        model: data.model,
        promptTokens: data.promptTokens,
        completionTokens: data.completionTokens,
        cost: 0, // Both Gemini Flash & Groq free tier = $0
        latencyMs: data.latencyMs,
        success: data.success,
      },
    });
  } catch (logError) {
    // Never fail the main request due to logging errors
    console.error('[AI Gateway] Failed to log usage:', logError);
  }
}

// ─── Core Gateway Function ────────────────────────────────────────────────────

interface GatewayOptions<T extends ZodSchema> {
  userId: string;
  feature: string;
  schema: T;
  prompt: string;
  systemPrompt: string;
}

export async function callAiGateway<T extends ZodSchema>(
  opts: GatewayOptions<T>
): Promise<z.infer<T>> {
  const { userId, feature, schema, prompt, systemPrompt } = opts;

  // 1. Rate limit check
  const { allowed } = await checkAiRateLimit(userId);
  if (!allowed) {
    throw new Error('RATE_LIMIT_EXCEEDED');
  }

  const startTime = Date.now();
  let modelUsed = GEMINI_MODEL;
  let promptTokens = 0;
  let completionTokens = 0;

  // 2. Try Gemini first, then Groq fallback
  const tryGenerate = async (provider: 'gemini' | 'groq') => {
    const model = provider === 'gemini'
      ? google(GEMINI_MODEL)
      : groq(GROQ_MODEL);

    modelUsed = provider === 'gemini' ? GEMINI_MODEL : GROQ_MODEL;

    // Race against timeout
    const result = await Promise.race([
      generateObject({
        model,
        schema,
        system: systemPrompt,
        prompt,
      }),
      new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error('AI_TIMEOUT')), AI_TIMEOUT_MS)
      ),
    ]);

    return result;
  };

  let result: Awaited<ReturnType<typeof generateObject>>;
  let success = true;

  try {
    try {
      result = await tryGenerate('gemini');
    } catch (primaryError) {
      console.warn('[AI Gateway] Gemini failed, switching to Groq:', primaryError);
      // Retry once with Groq
      result = await tryGenerate('groq');
    }

    promptTokens = result.usage?.promptTokens ?? 0;
    completionTokens = result.usage?.completionTokens ?? 0;

    return result.object as z.infer<T>;
  } catch (err) {
    success = false;
    throw err;
  } finally {
    const latencyMs = Date.now() - startTime;
    await logUsage({
      userId,
      feature,
      model: modelUsed,
      promptTokens,
      completionTokens,
      latencyMs,
      success,
    });
  }
}

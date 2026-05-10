// Simple in-memory rate limiter for API routes
// Note: In a multi-instance production environment, use Redis or Upstash.

interface RateLimitTracker {
  count: number;
  resetAt: number;
}

const rateLimitMap = new Map<string, RateLimitTracker>();

export function rateLimit(ip: string, limit: number, windowMs: number): boolean {
  const now = Date.now();
  const record = rateLimitMap.get(ip);

  // Clean up expired records occasionally
  if (Math.random() < 0.05) {
    for (const [key, val] of Array.from(rateLimitMap.entries())) {
      if (val.resetAt < now) {
        rateLimitMap.delete(key);
      }
    }
  }

  if (!record || record.resetAt < now) {
    rateLimitMap.set(ip, {
      count: 1,
      resetAt: now + windowMs,
    });
    return true; // Allowed
  }

  if (record.count >= limit) {
    return false; // Rate limited
  }

  record.count += 1;
  return true; // Allowed
}

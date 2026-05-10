import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { forgotPasswordSchema } from '@/schemas/auth.schema';
import { rateLimit } from '@/lib/rate-limit';

export async function POST(request: Request) {
  try {
    // Basic rate limiting (5 requests per minute for forgot password)
    const ip = request.headers.get('x-forwarded-for') || 'anonymous';
    if (!rateLimit(`forgotpw-${ip}`, 5, 60000)) {
      return NextResponse.json(
        { success: false, error: { code: 'RATE_LIMIT', message: 'Too many requests. Please try again later.' } },
        { status: 429 }
      );
    }

    const body = await request.json();
    const result = forgotPasswordSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: { code: 'VALIDATION_ERROR', message: 'Invalid input data' } },
        { status: 400 }
      );
    }

    const { email } = result.data;
    const supabase = createClient();

    // Determine base URL dynamically or from env
    const origin = request.headers.get('origin') || process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    
    // Note: This relies on Supabase email templates sending the user to /reset-password
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${origin}/reset-password`,
    });

    if (error) {
      return NextResponse.json(
        { success: false, error: { code: error.name, message: error.message } },
        { status: error.status || 400 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Forgot password error:', error);
    return NextResponse.json(
      { success: false, error: { code: 'INTERNAL_ERROR', message: 'An unexpected error occurred' } },
      { status: 500 }
    );
  }
}

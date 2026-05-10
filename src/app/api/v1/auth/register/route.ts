import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { registerSchema } from '@/schemas/auth.schema';
import { prisma } from '@/lib/prisma/client';
import { rateLimit } from '@/lib/rate-limit';

export async function POST(request: Request) {
  try {
    // Basic rate limiting (10 requests per minute)
    const ip = request.headers.get('x-forwarded-for') || 'anonymous';
    if (!rateLimit(`register-${ip}`, 10, 60000)) {
      return NextResponse.json(
        { success: false, error: { code: 'RATE_LIMIT', message: 'Too many requests. Please try again later.' } },
        { status: 429 }
      );
    }

    const body = await request.json();
    const result = registerSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: { code: 'VALIDATION_ERROR', message: 'Invalid input data', details: result.error.flatten() } },
        { status: 400 }
      );
    }

    const { email, password, first_name, last_name, city, country, phone } = result.data;
    const supabase = createClient();

    // Sign up the user via Supabase
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          first_name,
          last_name,
        },
      },
    });

    if (authError) {
      return NextResponse.json(
        { success: false, error: { code: authError.name, message: authError.message } },
        { status: authError.status || 400 }
      );
    }

    const user = authData.user;
    if (!user) {
      return NextResponse.json(
        { success: false, error: { code: 'INTERNAL_ERROR', message: 'User creation failed' } },
        { status: 500 }
      );
    }

    // Attempt to create the profile in Prisma
    try {
      await prisma.profile.create({
        data: {
          userId: user.id,
          firstName: first_name,
          lastName: last_name,
          city,
          country,
          phone,
        },
      });
    } catch (profileError) {
      console.error('Failed to create profile record:', profileError);
    }

    return NextResponse.json({
      success: true,
      data: {
        user: {
          id: user.id,
          email: user.email,
        },
        session: authData.session,
      },
    });
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { success: false, error: { code: 'INTERNAL_ERROR', message: 'An unexpected error occurred' } },
      { status: 500 }
    );
  }
}

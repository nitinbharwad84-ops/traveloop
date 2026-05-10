// =============================================================================
// Traveloop — Auth Middleware
// =============================================================================
// Protects all routes under /(authenticated)/ by checking Supabase session.
// Redirects unauthenticated users to /login.
// Refreshes expired auth tokens automatically.
// =============================================================================

import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

/**
 * Routes that do NOT require authentication.
 * Everything else under /(authenticated)/ is protected.
 */
const PUBLIC_PATHS = new Set([
  '/',
  '/login',
  '/register',
  '/forgot-password',
  '/reset-password',
  '/offline',
  '/about',
  '/pricing',
]);

/**
 * Check if a path is public (does not require auth).
 */
function isPublicPath(pathname: string): boolean {
  // Exact match for known public paths
  if (PUBLIC_PATHS.has(pathname)) return true;

  // Static assets and API routes should pass through
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.startsWith('/icons') ||
    pathname.includes('.') // files like favicon.ico, manifest.webmanifest
  ) {
    return true;
  }

  // Shared trip public links (e.g., /shared/[tripId])
  if (pathname.startsWith('/shared/')) return true;

  return false;
}

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // IMPORTANT: Do NOT add any logic between createServerClient and
  // supabase.auth.getUser(). A simple mistake here can lead to
  // very difficult to debug auth issues.

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { pathname } = request.nextUrl;

  // Allow public paths through without auth check
  if (isPublicPath(pathname)) {
    // If user IS authenticated and tries to access login/register,
    // redirect them to dashboard instead
    if (user && (pathname === '/login' || pathname === '/register')) {
      const url = request.nextUrl.clone();
      url.pathname = '/dashboard';
      return NextResponse.redirect(url);
    }
    return supabaseResponse;
  }

  // Protected route: redirect to login if not authenticated
  if (!user) {
    const url = request.nextUrl.clone();
    url.pathname = '/login';
    // Preserve the intended destination for post-login redirect
    url.searchParams.set('redirectTo', pathname);
    return NextResponse.redirect(url);
  }

  return supabaseResponse;
}

/**
 * Matcher config: run middleware on all routes except static files.
 * This is more permissive — the isPublicPath function handles fine-grained control.
 */
export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder files
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};

// =============================================================================
// Traveloop — Client Providers
// =============================================================================
// Wraps the entire app with required client-side providers:
// 1. ThemeProvider (next-themes) — dark/light mode with system preference
// 2. QueryClientProvider (TanStack Query) — server state management
// 3. PostHogProvider — analytics initialization
//
// This is a Client Component because providers require browser context.
// =============================================================================

'use client';

import { useEffect } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from 'next-themes';
import { initPostHog } from '@/lib/analytics';
import { initSentry } from '@/lib/sentry';

/**
 * TanStack Query client configuration.
 * Tuned for free-tier API usage with conservative refetching.
 */
function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        // Data is considered fresh for 60 seconds (reduces refetch frequency)
        staleTime: 60 * 1000,
        // Cache data for 5 minutes after it becomes unused
        gcTime: 5 * 60 * 1000,
        // Retry failed queries up to 2 times
        retry: 2,
        // Don't refetch on window focus (conserves API calls)
        refetchOnWindowFocus: false,
      },
      mutations: {
        retry: 1,
      },
    },
  });
}

// Singleton for the browser (prevents re-creation on re-renders)
let browserQueryClient: QueryClient | undefined;

function getQueryClient() {
  if (typeof window === 'undefined') {
    // Server: always make a new client
    return makeQueryClient();
  }
  // Browser: reuse the client
  if (!browserQueryClient) {
    browserQueryClient = makeQueryClient();
  }
  return browserQueryClient;
}

interface ProvidersProps {
  children: React.ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  const queryClient = getQueryClient();

  // Initialize analytics and monitoring on mount (browser only)
  useEffect(() => {
    initPostHog();
    initSentry();
  }, []);

  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    </ThemeProvider>
  );
}

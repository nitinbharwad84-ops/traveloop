// =============================================================================
// Traveloop — Public Landing Page (Placeholder)
// =============================================================================
// Placeholder landing page. Actual landing page will be designed later.
// =============================================================================

import Link from 'next/link';
import { Plane, ArrowRight } from 'lucide-react';

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4">
      {/* Logo */}
      <div className="mb-8 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-lg">
        <Plane className="h-8 w-8" />
      </div>

      {/* Headline */}
      <h1 className="mb-4 text-center text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
        Plan Smarter Trips with{' '}
        <span className="text-primary">Traveloop</span>
      </h1>

      {/* Subheadline */}
      <p className="mb-8 max-w-lg text-center text-lg text-muted-foreground">
        AI-powered collaborative travel planning. Create itineraries, manage
        budgets, and collaborate with co-travelers — all in one place.
      </p>

      {/* CTA */}
      <div className="flex gap-4">
        <Link
          href="/register"
          className="inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-3 text-sm font-medium text-primary-foreground shadow-sm transition-colors hover:bg-primary/90"
        >
          Get Started Free
          <ArrowRight className="h-4 w-4" />
        </Link>
        <Link
          href="/login"
          className="inline-flex items-center rounded-lg border border-border px-6 py-3 text-sm font-medium text-foreground transition-colors hover:bg-accent"
        >
          Sign In
        </Link>
      </div>
    </div>
  );
}

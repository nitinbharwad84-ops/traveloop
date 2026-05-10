// =============================================================================
// Traveloop — Register Page (Placeholder)
// =============================================================================
// Placeholder registration page. Full auth form built in M2.
// =============================================================================

import Link from 'next/link';
import { Plane } from 'lucide-react';

export const metadata = {
  title: 'Sign Up — Traveloop',
  description: 'Create your Traveloop account and start planning trips.',
};

export default function RegisterPage() {
  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-sm space-y-6">
        {/* Brand */}
        <div className="flex flex-col items-center gap-2">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-primary-foreground">
            <Plane className="h-6 w-6" />
          </div>
          <h1 className="text-2xl font-bold text-foreground">Create account</h1>
          <p className="text-sm text-muted-foreground">
            Start planning your next adventure
          </p>
        </div>

        {/* Placeholder form */}
        <div className="rounded-lg border border-border bg-card p-6">
          <p className="text-center text-sm text-muted-foreground">
            Registration form will be implemented in M2.
          </p>
        </div>

        {/* Footer */}
        <p className="text-center text-sm text-muted-foreground">
          Already have an account?{' '}
          <Link href="/login" className="text-primary hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}

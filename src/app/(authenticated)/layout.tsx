// =============================================================================
// Traveloop — Authenticated Layout
// =============================================================================
// Wraps all routes under /(authenticated)/ with the app shell (sidebar,
// header, mobile nav). Middleware ensures only authenticated users reach this.
// =============================================================================

import { AppShell } from '@/components/layout/app-shell';

export default function AuthenticatedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AppShell>{children}</AppShell>;
}

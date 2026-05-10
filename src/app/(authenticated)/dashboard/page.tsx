// =============================================================================
// Traveloop — Authenticated Dashboard Placeholder
// =============================================================================
// Placeholder page for the authenticated dashboard route.
// Actual dashboard UI will be built in M4.
// =============================================================================

export const metadata = {
  title: 'Dashboard — Traveloop',
  description: 'Your travel planning dashboard.',
};

export default function DashboardPage() {
  return (
    <div className="flex flex-col items-center justify-center py-20">
      <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
      <p className="mt-2 text-muted-foreground">
        Your trips and planning tools will appear here.
      </p>
    </div>
  );
}

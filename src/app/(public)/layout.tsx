// =============================================================================
// Traveloop — Public Layout
// =============================================================================
// Minimal layout for public pages (landing, login, register, etc.).
// No sidebar or navigation shell — clean, focused presentation.
// =============================================================================

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background">
      {children}
    </div>
  );
}

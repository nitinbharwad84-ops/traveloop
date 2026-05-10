// =============================================================================
// Traveloop — App Shell
// =============================================================================
// Composes sidebar + header + mobile-nav into the main authenticated layout.
// Handles sidebar collapse state and mobile drawer.
// =============================================================================

'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils';
import { Sidebar } from './sidebar';
import { Header } from './header';
import { MobileNav } from './mobile-nav';
import { SIDEBAR_NAV_ITEMS } from '@/constants';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { X, Plane } from 'lucide-react';

interface AppShellProps {
  children: React.ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const pathname = usePathname();

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Desktop Sidebar */}
      <Sidebar
        collapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
      />

      {/* Mobile Sidebar Drawer Overlay */}
      {mobileDrawerOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/50 lg:hidden"
          onClick={() => setMobileDrawerOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Mobile Sidebar Drawer */}
      <div
        className={cn(
          'fixed inset-y-0 left-0 z-50 w-72 bg-card shadow-xl transition-transform duration-300 lg:hidden',
          mobileDrawerOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        {/* Drawer Header */}
        <div className="flex h-16 items-center justify-between border-b border-border px-4">
          <Link
            href="/dashboard"
            className="flex items-center gap-2"
            onClick={() => setMobileDrawerOpen(false)}
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <Plane className="h-4 w-4" />
            </div>
            <span className="text-lg font-bold text-foreground">Traveloop</span>
          </Link>
          <button
            onClick={() => setMobileDrawerOpen(false)}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground hover:bg-accent"
            aria-label="Close navigation"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Drawer Navigation */}
        <nav className="space-y-1 p-3">
          {SIDEBAR_NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive =
              pathname === item.href ||
              (item.href !== '/dashboard' && pathname.startsWith(item.href));

            return (
              <Link
                key={item.href + item.label}
                href={item.href}
                onClick={() => setMobileDrawerOpen(false)}
                className={cn(
                  'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                  'hover:bg-accent hover:text-accent-foreground',
                  isActive
                    ? 'bg-primary/10 text-primary'
                    : 'text-muted-foreground'
                )}
              >
                <Icon className="h-5 w-5" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Main Content Area */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Header */}
        <Header onMobileMenuToggle={() => setMobileDrawerOpen(true)} />

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto pb-20 lg:pb-6">
          <div className="mx-auto max-w-7xl p-4 lg:p-6">{children}</div>
        </main>

        {/* Mobile Bottom Nav */}
        <MobileNav />
      </div>
    </div>
  );
}

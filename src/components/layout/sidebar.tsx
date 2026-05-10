// =============================================================================
// Traveloop — Collapsible Sidebar (Premium)
// =============================================================================
// Desktop sidebar navigation with collapse/expand toggle.
// Expanded: 256px with icon + label. Collapsed: 64px with icon only.
// =============================================================================

'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { SIDEBAR_NAV_ITEMS, APP_NAME } from '@/constants';
import { ChevronLeft, ChevronRight, Plane, LogOut, User as UserIcon } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { useProfile } from '@/features/profile/hooks/useProfile';
import { toast } from 'sonner';

interface SidebarProps {
  /** Whether the sidebar is collapsed (icon-only mode) */
  collapsed: boolean;
  /** Callback to toggle collapsed state */
  onToggle: () => void;
}

export function Sidebar({ collapsed, onToggle }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();
  const { profile } = useProfile();

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast.error('Logout failed');
    } else {
      router.push('/login');
      router.refresh();
    }
  };

  const initials = profile 
    ? `${profile.firstName[0]}${profile.lastName[0] || ''}`.toUpperCase()
    : 'U';

  return (
    <aside
      className={cn(
        'hidden lg:flex flex-col border-r border-border bg-card transition-all duration-300 ease-in-out relative',
        collapsed ? 'w-20' : 'w-72'
      )}
    >
      {/* Brand Logo */}
      <div className="flex h-20 items-center px-6">
        <Link
          href="/dashboard"
          className="flex items-center gap-3 overflow-hidden group"
        >
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-lg shadow-primary/20 transition-transform group-hover:scale-110">
            <Plane className="h-5 w-5" />
          </div>
          {!collapsed && (
            <span className="text-xl font-bold tracking-tighter text-foreground">
              {APP_NAME}
            </span>
          )}
        </Link>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 space-y-1.5 overflow-y-auto px-4 py-4 custom-scrollbar">
        {SIDEBAR_NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive =
            pathname === item.href ||
            (item.href !== '/dashboard' && pathname.startsWith(item.href));

          return (
            <Link
              key={item.href + item.label}
              href={item.href}
              className={cn(
                'flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200 group',
                isActive
                  ? 'bg-primary text-primary-foreground shadow-md shadow-primary/20'
                  : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground',
                collapsed && 'justify-center px-0'
              )}
              title={collapsed ? item.label : undefined}
            >
              <Icon className={cn("h-5 w-5 shrink-0 transition-transform group-hover:scale-110", isActive ? "text-white" : "text-muted-foreground")} />
              {!collapsed && <span>{item.label}</span>}
            </Link>
          );
        })}
      </nav>

      {/* User & Settings Section */}
      <div className="border-t border-border p-4 space-y-2">
        <div className={cn(
          "flex items-center gap-3 p-2 rounded-xl transition-colors",
          !collapsed && "bg-muted/30"
        )}>
          <div className="h-10 w-10 shrink-0 rounded-full bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-600 font-bold">
            {initials}
          </div>
          {!collapsed && (
            <div className="flex-1 min-w-0 text-left">
              <p className="text-sm font-semibold text-foreground truncate">
                {profile?.firstName} {profile?.lastName}
              </p>
              <p className="text-xs text-muted-foreground truncate">
                {profile?.user?.email}
              </p>
            </div>
          )}
        </div>

        <button
          onClick={handleLogout}
          className={cn(
            'flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-destructive transition-all hover:bg-destructive/10',
            collapsed && 'justify-center px-0'
          )}
        >
          <LogOut className="h-5 w-5 shrink-0" />
          {!collapsed && <span>Sign Out</span>}
        </button>

        {/* Collapse Toggle */}
        <button
          onClick={onToggle}
          className="flex w-full items-center justify-center gap-2 rounded-xl p-2 text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {collapsed ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <>
              <ChevronLeft className="h-4 w-4" />
              <span className="text-xs font-medium">Collapse</span>
            </>
          )}
        </button>
      </div>
    </aside>
  );
}

'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Users, ShieldAlert, LineChart, FileTerminal, ArrowLeft } from 'lucide-react';
import { APP_NAME } from '@/constants';

const ADMIN_NAV = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/users', label: 'User Management', icon: Users },
  { href: '/admin/moderation', label: 'Moderation', icon: ShieldAlert },
  { href: '/admin/analytics', label: 'AI Analytics', icon: LineChart },
  { href: '/admin/audit-logs', label: 'Audit Logs', icon: FileTerminal },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-muted/20 flex flex-col md:flex-row">
      {/* Sidebar */}
      <aside className="w-full md:w-64 border-r border-border bg-card shrink-0 flex flex-col sticky top-0 md:h-screen">
        <div className="h-16 flex items-center px-6 border-b border-border">
          <span className="font-bold text-lg">{APP_NAME} Admin</span>
        </div>
        <div className="p-4 flex-1 overflow-y-auto">
          <nav className="space-y-1">
            {ADMIN_NAV.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-primary text-primary-foreground'
                      : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>
        <div className="p-4 border-t border-border">
          <Link
            href="/dashboard"
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-4 w-4" /> Exit Admin
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 md:p-8 overflow-y-auto w-full max-w-7xl mx-auto">
        {children}
      </main>
    </div>
  );
}

'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { User, Bell, Shield, Sliders } from 'lucide-react';

const sidebarNavItems = [
  {
    title: 'Account',
    href: '/settings/account',
    icon: User,
  },
  {
    title: 'Notifications',
    href: '/settings/notifications',
    icon: Bell,
  },
  {
    title: 'Privacy',
    href: '/settings/privacy',
    icon: Shield,
  },
  {
    title: 'Preferences',
    href: '/settings/preferences',
    icon: Sliders,
  },
];

export default function SettingsLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="container max-w-5xl py-8 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="space-y-0.5">
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">
          Manage your account settings and set email preferences.
        </p>
      </div>
      <div className="flex flex-col space-y-8 lg:flex-row lg:space-x-12 lg:space-y-0">
        <aside className="lg:w-1/4">
          <nav className="flex space-x-2 lg:flex-col lg:space-x-0 lg:space-y-1">
            {sidebarNavItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    'flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors',
                    isActive
                      ? 'bg-primary/10 text-primary'
                      : 'hover:bg-muted text-muted-foreground hover:text-foreground'
                  )}
                >
                  <item.icon className="h-4 w-4" />
                  {item.title}
                </Link>
              );
            })}
          </nav>
        </aside>
        <div className="flex-1 max-w-2xl">{children}</div>
      </div>
    </div>
  );
}

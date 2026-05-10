// =============================================================================
// Traveloop — Top Header Bar
// =============================================================================
// Contains: mobile hamburger toggle, search (future), notification bell,
// user avatar dropdown menu. Sticky at the top of the content area.
// =============================================================================

'use client';

import Link from 'next/link';
// Utilities available for future use
// import { cn } from '@/lib/utils';
import { APP_NAME, USER_MENU_ITEMS } from '@/constants';
import {
  Menu,
  LogOut,
  Plane,
  Moon,
  Sun,
  Search,
  User as UserIcon,
} from 'lucide-react';
import { useTheme } from 'next-themes';
import { useState, useRef, useEffect } from 'react';
import { NotificationBell } from '@/features/notifications/components/NotificationBell';

interface HeaderProps {
  /** Callback to toggle the mobile sidebar drawer */
  onMobileMenuToggle: () => void;
}

export function Header({ onMobileMenuToggle }: HeaderProps) {
  const { theme, setTheme } = useTheme();
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setUserMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="sticky top-0 z-40 flex h-16 items-center border-b border-border bg-card/80 px-4 backdrop-blur-md lg:px-6">
      {/* Left: Mobile Menu + Brand */}
      <div className="flex items-center gap-4">
        <button
          onClick={onMobileMenuToggle}
          className="flex h-10 w-10 items-center justify-center rounded-xl text-muted-foreground transition-all hover:bg-accent hover:text-accent-foreground lg:hidden"
          aria-label="Toggle navigation menu"
        >
          <Menu className="h-6 w-6" />
        </button>

        <div className="hidden lg:block">
          <h2 className="text-lg font-semibold tracking-tight text-foreground">
            Traveloop Dashboard
          </h2>
        </div>
      </div>

      {/* Center: Search Bar */}
      <div className="hidden md:flex flex-1 max-w-md mx-auto px-4">
        <div className="relative w-full group">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <Search className="h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
          </div>
          <input
            type="search"
            placeholder="Search destinations, trips, or activities..."
            className="w-full bg-muted/50 border-none rounded-xl py-2.5 pl-10 pr-4 text-sm focus:ring-2 focus:ring-primary/20 focus:bg-background transition-all outline-none"
          />
        </div>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-3">
        {/* Theme Toggle */}
        <button
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          className="flex h-10 w-10 items-center justify-center rounded-xl text-muted-foreground transition-all hover:bg-accent hover:text-accent-foreground"
          aria-label="Toggle theme"
        >
          <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
        </button>

        <div className="h-6 w-px bg-border mx-1" />

        {/* Notification Bell */}
        <NotificationBell />

        {/* Profile Shortcut (Mobile only, as Sidebar has it on Desktop) */}
        <Link 
          href="/profile"
          className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary lg:hidden"
        >
          <UserIcon className="h-5 w-5" />
        </Link>
      </div>
    </header>
  );
}

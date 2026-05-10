// =============================================================================
// Traveloop — Application Constants
// =============================================================================
// Centralized constants for routes, navigation, config values, and enums.
// Single source of truth for magic strings used across the app.
// =============================================================================

import {
  LayoutDashboard,
  Map,
  Search,
  Sparkles,
  User,
  Settings,
  Bell,
  Compass,
  Wallet,
  CheckSquare,
  BookOpen,
  Users,
} from 'lucide-react';

// -----------------------------------------------------------------------------
// Application Metadata
// -----------------------------------------------------------------------------
export const APP_NAME = 'Traveloop';
export const APP_DESCRIPTION =
  'AI-powered collaborative travel planning platform. Plan smarter trips with less friction.';
export const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000';

// -----------------------------------------------------------------------------
// Route Definitions
// -----------------------------------------------------------------------------
export const ROUTES = {
  // Public routes
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  FORGOT_PASSWORD: '/forgot-password',
  RESET_PASSWORD: '/reset-password',
  ABOUT: '/about',
  PRICING: '/pricing',
  OFFLINE: '/offline',

  // Authenticated routes
  DASHBOARD: '/dashboard',
  PROFILE: '/profile',
  PROFILE_EDIT: '/profile/edit',
  SETTINGS: '/settings',
  NOTIFICATIONS: '/notifications',
  TRIPS: '/trips',
  TRIPS_NEW: '/trips/new',
  TRIP_DETAIL: (id: string) => `/trips/${id}` as const,
  TRIP_EDIT: (id: string) => `/trips/${id}/edit` as const,
  TRIP_ITINERARY: (id: string) => `/trips/${id}/itinerary` as const,
  TRIP_BUDGET: (id: string) => `/trips/${id}/budget` as const,
  TRIP_PACKING: (id: string) => `/trips/${id}/packing` as const,
  TRIP_NOTES: (id: string) => `/trips/${id}/notes` as const,
  TRIP_SHARE: (id: string) => `/trips/${id}/share` as const,
  TRIP_COLLABORATORS: (id: string) => `/trips/${id}/collaborators` as const,
  SEARCH_DESTINATIONS: '/search/destinations',
  SEARCH_ACTIVITIES: '/search/activities',
  AI_PLAN_TRIP: '/ai/plan-trip',
  AI_BUDGET: '/ai/budget',
  AI_PACKING: '/ai/packing',
} as const;

/**
 * Routes that do NOT require authentication.
 * Used by middleware to skip auth checks.
 */
export const PUBLIC_ROUTES: string[] = [
  ROUTES.HOME,
  ROUTES.LOGIN,
  ROUTES.REGISTER,
  ROUTES.FORGOT_PASSWORD,
  ROUTES.RESET_PASSWORD,
  ROUTES.ABOUT,
  ROUTES.PRICING,
  ROUTES.OFFLINE,
];

// -----------------------------------------------------------------------------
// Navigation Items
// -----------------------------------------------------------------------------

/**
 * Primary sidebar navigation items.
 */
export const SIDEBAR_NAV_ITEMS = [
  { label: 'Dashboard', href: ROUTES.DASHBOARD, icon: LayoutDashboard },
  { label: 'My Trips', href: ROUTES.TRIPS, icon: Map },
  { label: 'Discover', href: ROUTES.SEARCH_DESTINATIONS, icon: Compass },
  { label: 'AI Planner', href: ROUTES.AI_PLAN_TRIP, icon: Sparkles },
  { label: 'Budget', href: ROUTES.AI_BUDGET, icon: Wallet },
  { label: 'Packing', href: ROUTES.AI_PACKING, icon: CheckSquare },
  { label: 'Notes', href: ROUTES.DASHBOARD, icon: BookOpen },
  { label: 'Collaborations', href: ROUTES.DASHBOARD, icon: Users },
] as const;

/**
 * Bottom navigation items for mobile.
 */
export const MOBILE_NAV_ITEMS = [
  { label: 'Home', href: ROUTES.DASHBOARD, icon: LayoutDashboard },
  { label: 'Trips', href: ROUTES.TRIPS, icon: Map },
  { label: 'Search', href: ROUTES.SEARCH_DESTINATIONS, icon: Search },
  { label: 'AI', href: ROUTES.AI_PLAN_TRIP, icon: Sparkles },
  { label: 'Profile', href: ROUTES.PROFILE, icon: User },
] as const;

/**
 * User menu dropdown items.
 */
export const USER_MENU_ITEMS = [
  { label: 'Profile', href: ROUTES.PROFILE, icon: User },
  { label: 'Settings', href: ROUTES.SETTINGS, icon: Settings },
  { label: 'Notifications', href: ROUTES.NOTIFICATIONS, icon: Bell },
] as const;

// -----------------------------------------------------------------------------
// Configuration Limits
// -----------------------------------------------------------------------------
export const LIMITS = {
  /** Maximum file upload size in bytes (5MB) */
  MAX_FILE_SIZE: 5 * 1024 * 1024,
  /** AI calls per user per day (free tier) */
  AI_DAILY_QUOTA: 10,
  /** Maximum collaborators per trip */
  MAX_COLLABORATORS: 20,
  /** Maximum stops per trip */
  MAX_STOPS: 50,
  /** Maximum packing items per trip */
  MAX_PACKING_ITEMS: 200,
  /** API rate limit (requests per minute) */
  API_RATE_LIMIT: 100,
  /** AI rate limit (requests per minute) */
  AI_RATE_LIMIT: 10,
} as const;

// -----------------------------------------------------------------------------
// Currencies
// -----------------------------------------------------------------------------
export const SUPPORTED_CURRENCIES = [
  { code: 'INR', symbol: '₹', name: 'Indian Rupee' },
  { code: 'USD', symbol: '$', name: 'US Dollar' },
  { code: 'EUR', symbol: '€', name: 'Euro' },
  { code: 'GBP', symbol: '£', name: 'British Pound' },
  { code: 'JPY', symbol: '¥', name: 'Japanese Yen' },
  { code: 'AUD', symbol: 'A$', name: 'Australian Dollar' },
  { code: 'CAD', symbol: 'C$', name: 'Canadian Dollar' },
  { code: 'SGD', symbol: 'S$', name: 'Singapore Dollar' },
  { code: 'THB', symbol: '฿', name: 'Thai Baht' },
] as const;

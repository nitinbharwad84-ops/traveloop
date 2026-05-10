// =============================================================================
// Traveloop — TypeScript Type Definitions
// =============================================================================
// App-wide types and interfaces. Prisma-generated types are available via
// @prisma/client — these are supplementary application-level types.
// =============================================================================

/**
 * Standard API response wrapper for all API routes.
 */
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: Record<string, unknown>;
  };
  meta?: {
    page?: number;
    pageSize?: number;
    total?: number;
  };
}

/**
 * Authenticated user session shape (from Supabase Auth).
 */
export interface AuthUser {
  id: string;
  email: string;
  emailVerified: boolean;
}

/**
 * Navigation item shape for sidebar and mobile nav.
 */
export interface NavItem {
  label: string;
  href: string;
  icon: string;
  badge?: number;
  disabled?: boolean;
}

/**
 * Theme options supported by the app.
 */
export type Theme = 'light' | 'dark' | 'system';

/**
 * Notification shape for the notification bell dropdown.
 */
export interface AppNotification {
  id: string;
  type: string;
  message: string;
  read: boolean;
  createdAt: string;
  payload?: Record<string, unknown>;
}

/**
 * Search/filter parameters for list endpoints.
 */
export interface PaginationParams {
  page: number;
  pageSize: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

/**
 * Generic server action result shape.
 */
export type ActionResult<T = void> =
  | { success: true; data: T }
  | { success: false; error: string };

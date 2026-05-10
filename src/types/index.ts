// =============================================================================
// Traveloop — TypeScript Type Definitions
// =============================================================================
// App-wide types and interfaces. Database enum types are defined here
// as string literal unions — they match the PostgreSQL enums in Supabase.
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

// =============================================================================
// Database Enum Types (match PostgreSQL enums in Supabase)
// =============================================================================

export type UserStatus = 'active' | 'suspended' | 'deleted';
export type UserRole = 'user' | 'admin';

export type TripType = 'solo' | 'family' | 'group' | 'honeymoon' | 'business' | 'adventure' | 'luxury' | 'budget';
export type TripPrivacy = 'private' | 'shared' | 'public';
export type TripStatus = 'draft' | 'active' | 'completed' | 'archived';

export type ActivityCategory = 'sightseeing' | 'cultural' | 'nightlife' | 'food' | 'adventure' | 'shopping' | 'family' | 'nature' | 'wellness' | 'local_experiences';
export type DestinationType = 'city' | 'beach' | 'mountain' | 'countryside' | 'island' | 'heritage' | 'adventure' | 'wellness';

export type BudgetCategory = 'flights' | 'accommodation' | 'food' | 'activities' | 'local_transport' | 'shopping' | 'insurance' | 'emergency' | 'miscellaneous';
export type PackingCategory = 'clothing' | 'electronics' | 'documents' | 'hygiene' | 'medicine' | 'accessories' | 'travel_gear';

export type NoteType = 'general' | 'daily' | 'reminder' | 'hotel' | 'contact' | 'emergency' | 'journal';

export type CollaboratorRole = 'owner' | 'editor' | 'viewer';
export type CollaboratorStatus = 'pending' | 'accepted' | 'declined' | 'removed';

export type LinkVisibility = 'public' | 'invite_only' | 'password_protected';

export type SubscriptionPlan = 'free' | 'pro' | 'team';
export type SubscriptionStatus = 'active' | 'cancelled' | 'expired';

// =============================================================================
// Database Row Types (match Supabase table schemas)
// =============================================================================

export interface DbUser {
  id: string;
  email: string;
  password_hash: string | null;
  email_verified: boolean;
  status: UserStatus;
  role: UserRole;
  created_at: string;
  updated_at: string;
  last_login_at: string | null;
}

export interface DbProfile {
  id: string;
  user_id: string;
  first_name: string;
  last_name: string;
  avatar_url: string | null;
  phone: string | null;
  city: string | null;
  country: string | null;
  language: string;
  travel_preferences: Record<string, unknown>;
  notification_preferences: { email: boolean; push: boolean; in_app: boolean };
  created_at: string;
  updated_at: string;
}

export interface DbTrip {
  id: string;
  owner_id: string;
  title: string;
  description: string | null;
  cover_image_url: string | null;
  start_date: string | null;
  end_date: string | null;
  traveler_count: number;
  budget_target: number | null;
  currency: string;
  trip_type: TripType;
  privacy: TripPrivacy;
  status: TripStatus;
  transport_preference: string | null;
  accommodation_preference: string | null;
  origin_city: string | null;
  created_at: string;
  updated_at: string;
}

export interface DbTripStop {
  id: string;
  trip_id: string;
  city_name: string;
  country_name: string;
  arrival_date: string | null;
  departure_date: string | null;
  timezone: string | null;
  order_index: number;
  notes: string | null;
  estimated_transport_cost: number | null;
  estimated_transport_time: number | null;
  created_at: string;
}

export interface DbTripActivity {
  id: string;
  trip_stop_id: string;
  activity_id: string | null;
  title: string | null;
  description: string | null;
  day_number: number | null;
  time_slot: string | null;
  custom_notes: string | null;
  custom_cost: number | null;
  order_index: number;
  created_at: string;
}

export interface DbBudget {
  id: string;
  trip_id: string;
  category: BudgetCategory;
  estimated_amount: number;
  actual_amount: number;
  currency: string;
  created_at: string;
  updated_at: string;
}

export interface DbPackingItem {
  id: string;
  trip_id: string;
  name: string;
  category: PackingCategory | null;
  packed: boolean;
  created_by: string | null;
  created_at: string;
}

export interface DbNote {
  id: string;
  trip_id: string;
  user_id: string;
  content: string;
  note_type: NoteType;
  linked_day: number | null;
  created_at: string;
  updated_at: string;
}

export interface DbCollaborator {
  id: string;
  trip_id: string;
  user_id: string;
  role: CollaboratorRole;
  status: CollaboratorStatus;
  invited_by: string | null;
  joined_at: string | null;
  created_at: string;
}

export interface DbSharedLink {
  id: string;
  trip_id: string;
  token: string;
  visibility: LinkVisibility;
  password_hash: string | null;
  expires_at: string | null;
  created_at: string;
}

export interface DbNotification {
  id: string;
  user_id: string;
  notification_type: string;
  payload: Record<string, unknown>;
  read: boolean;
  created_at: string;
}

export interface DbAiUsageLog {
  id: string;
  user_id: string;
  feature: string;
  model: string;
  prompt_tokens: number;
  completion_tokens: number;
  cost: number;
  latency_ms: number;
  success: boolean;
  created_at: string;
}

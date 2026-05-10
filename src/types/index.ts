export type UserRole = "user" | "admin";

export interface Profile {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
  city?: string;
  country?: string;
  avatar_url?: string;
  role: UserRole;
  language_preference: string;
  additional_info?: string;
  created_at: string;
  updated_at: string;
}

export interface AuthState {
  user: any | null; // From Supabase Auth
  profile: Profile | null;
  loading: boolean;
  initialized: boolean;
}

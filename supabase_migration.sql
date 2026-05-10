-- =============================================================================
-- Traveloop — Supabase Migration SQL
-- =============================================================================
-- Run this ENTIRE script in the Supabase SQL Editor (Dashboard → SQL Editor).
-- It creates all 19 tables, enums, foreign keys, indexes, and RLS policies.
-- =============================================================================

-- ─── 1. ENUM TYPES ──────────────────────────────────────────────────────────────

DO $$ BEGIN
  CREATE TYPE user_status AS ENUM ('active', 'suspended', 'deleted');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE user_role AS ENUM ('user', 'admin');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE trip_type AS ENUM ('solo', 'family', 'group', 'honeymoon', 'business', 'adventure', 'luxury', 'budget');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE trip_privacy AS ENUM ('private', 'shared', 'public');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE trip_status AS ENUM ('draft', 'active', 'completed', 'archived');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE activity_category AS ENUM ('sightseeing', 'cultural', 'nightlife', 'food', 'adventure', 'shopping', 'family', 'nature', 'wellness', 'local_experiences');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE destination_type AS ENUM ('city', 'beach', 'mountain', 'countryside', 'island', 'heritage', 'adventure', 'wellness');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE budget_category AS ENUM ('flights', 'accommodation', 'food', 'activities', 'local_transport', 'shopping', 'insurance', 'emergency', 'miscellaneous');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE packing_category AS ENUM ('clothing', 'electronics', 'documents', 'hygiene', 'medicine', 'accessories', 'travel_gear');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE note_type AS ENUM ('general', 'daily', 'reminder', 'hotel', 'contact', 'emergency', 'journal');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE collaborator_role AS ENUM ('owner', 'editor', 'viewer');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE collaborator_status AS ENUM ('pending', 'accepted', 'declined', 'removed');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE link_visibility AS ENUM ('public', 'invite_only', 'password_protected');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE subscription_plan AS ENUM ('free', 'pro', 'team');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE subscription_status AS ENUM ('active', 'cancelled', 'expired');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;


-- ─── 2. TABLES ──────────────────────────────────────────────────────────────────

-- 1. users
CREATE TABLE IF NOT EXISTS users (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email          VARCHAR(255) NOT NULL UNIQUE,
  password_hash  TEXT,
  email_verified BOOLEAN NOT NULL DEFAULT false,
  status         user_status NOT NULL DEFAULT 'active',
  role           user_role NOT NULL DEFAULT 'user',
  created_at     TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at     TIMESTAMPTZ NOT NULL DEFAULT now(),
  last_login_at  TIMESTAMPTZ
);

-- 2. profiles
CREATE TABLE IF NOT EXISTS profiles (
  id                       UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id                  UUID NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
  first_name               VARCHAR(100) NOT NULL,
  last_name                VARCHAR(100) NOT NULL,
  avatar_url               TEXT,
  phone                    VARCHAR(20),
  city                     VARCHAR(100),
  country                  VARCHAR(100),
  language                 VARCHAR(10) NOT NULL DEFAULT 'en',
  travel_preferences       JSONB NOT NULL DEFAULT '{}',
  notification_preferences JSONB NOT NULL DEFAULT '{"email":true,"push":false,"in_app":true}',
  created_at               TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at               TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 3. trips
CREATE TABLE IF NOT EXISTS trips (
  id                        UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id                  UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title                     VARCHAR(255) NOT NULL,
  description               TEXT,
  cover_image_url           TEXT,
  start_date                DATE,
  end_date                  DATE,
  traveler_count            INT NOT NULL DEFAULT 1,
  budget_target             DECIMAL(12,2),
  currency                  VARCHAR(3) NOT NULL DEFAULT 'INR',
  trip_type                 trip_type NOT NULL DEFAULT 'solo',
  privacy                   trip_privacy NOT NULL DEFAULT 'private',
  status                    trip_status NOT NULL DEFAULT 'draft',
  transport_preference      VARCHAR(30),
  accommodation_preference  VARCHAR(30),
  origin_city               VARCHAR(100),
  created_at                TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at                TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 4. trip_stops
CREATE TABLE IF NOT EXISTS trip_stops (
  id                       UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  trip_id                  UUID NOT NULL REFERENCES trips(id) ON DELETE CASCADE,
  city_name                VARCHAR(100) NOT NULL,
  country_name             VARCHAR(100) NOT NULL,
  arrival_date             DATE,
  departure_date           DATE,
  timezone                 VARCHAR(50),
  order_index              INT NOT NULL DEFAULT 0,
  notes                    TEXT,
  estimated_transport_cost DECIMAL(10,2),
  estimated_transport_time INT,
  created_at               TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 5. activities
CREATE TABLE IF NOT EXISTS activities (
  id                 UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  external_source_id VARCHAR(255),
  name               VARCHAR(255) NOT NULL,
  description        TEXT,
  category           activity_category,
  location_json      JSONB,
  estimated_cost     DECIMAL(10,2),
  estimated_duration INT,
  rating             DECIMAL(3,2),
  metadata           JSONB NOT NULL DEFAULT '{}',
  created_at         TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 5b. destinations
CREATE TABLE IF NOT EXISTS destinations (
  id                       UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  city_name                VARCHAR(100) NOT NULL,
  country_name             VARCHAR(100) NOT NULL,
  region                   VARCHAR(100),
  destination_type         destination_type NOT NULL DEFAULT 'city',
  estimated_budget_index   INT NOT NULL DEFAULT 3,
  seasonal_recommendation  VARCHAR(100),
  highlights               JSONB NOT NULL DEFAULT '[]',
  tags                     TEXT[] DEFAULT '{}',
  image_url                TEXT,
  trending                 BOOLEAN NOT NULL DEFAULT false,
  created_at               TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 6. trip_activities
CREATE TABLE IF NOT EXISTS trip_activities (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  trip_stop_id  UUID NOT NULL REFERENCES trip_stops(id) ON DELETE CASCADE,
  activity_id   UUID REFERENCES activities(id) ON DELETE SET NULL,
  title         VARCHAR(255),
  description   TEXT,
  day_number    INT,
  time_slot     VARCHAR(20),
  custom_notes  TEXT,
  custom_cost   DECIMAL(10,2),
  order_index   INT NOT NULL DEFAULT 0,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 7. budgets
CREATE TABLE IF NOT EXISTS budgets (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  trip_id          UUID NOT NULL REFERENCES trips(id) ON DELETE CASCADE,
  category         budget_category NOT NULL,
  estimated_amount DECIMAL(12,2) NOT NULL DEFAULT 0,
  actual_amount    DECIMAL(12,2) NOT NULL DEFAULT 0,
  currency         VARCHAR(3) NOT NULL DEFAULT 'INR',
  created_at       TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at       TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 8. packing_items
CREATE TABLE IF NOT EXISTS packing_items (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  trip_id    UUID NOT NULL REFERENCES trips(id) ON DELETE CASCADE,
  name       VARCHAR(255) NOT NULL,
  category   packing_category,
  packed     BOOLEAN NOT NULL DEFAULT false,
  created_by UUID REFERENCES users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 9. notes
CREATE TABLE IF NOT EXISTS notes (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  trip_id    UUID NOT NULL REFERENCES trips(id) ON DELETE CASCADE,
  user_id    UUID NOT NULL REFERENCES users(id),
  content    TEXT NOT NULL,
  note_type  note_type NOT NULL DEFAULT 'general',
  linked_day INT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 10. collaborators
CREATE TABLE IF NOT EXISTS collaborators (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  trip_id    UUID NOT NULL REFERENCES trips(id) ON DELETE CASCADE,
  user_id    UUID NOT NULL REFERENCES users(id),
  role       collaborator_role NOT NULL DEFAULT 'viewer',
  status     collaborator_status NOT NULL DEFAULT 'pending',
  invited_by UUID REFERENCES users(id),
  joined_at  TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(trip_id, user_id)
);

-- 11. shared_links
CREATE TABLE IF NOT EXISTS shared_links (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  trip_id       UUID NOT NULL REFERENCES trips(id) ON DELETE CASCADE,
  token         VARCHAR(64) NOT NULL UNIQUE,
  visibility    link_visibility NOT NULL DEFAULT 'public',
  password_hash TEXT,
  expires_at    TIMESTAMPTZ,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 12. community_posts
CREATE TABLE IF NOT EXISTS community_posts (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id    UUID NOT NULL REFERENCES users(id),
  trip_id    UUID NOT NULL REFERENCES trips(id),
  content    TEXT,
  visibility VARCHAR(20) NOT NULL DEFAULT 'public',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 13. comments
CREATE TABLE IF NOT EXISTS comments (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id    UUID NOT NULL REFERENCES community_posts(id) ON DELETE CASCADE,
  user_id    UUID NOT NULL REFERENCES users(id),
  content    TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 14. likes
CREATE TABLE IF NOT EXISTS likes (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id    UUID NOT NULL REFERENCES community_posts(id) ON DELETE CASCADE,
  user_id    UUID NOT NULL REFERENCES users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(post_id, user_id)
);

-- 15. followers
CREATE TABLE IF NOT EXISTS followers (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  follower_id  UUID NOT NULL REFERENCES users(id),
  following_id UUID NOT NULL REFERENCES users(id),
  created_at   TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(follower_id, following_id)
);

-- 16. notifications
CREATE TABLE IF NOT EXISTS notifications (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id           UUID NOT NULL REFERENCES users(id),
  notification_type VARCHAR(30) NOT NULL,
  payload           JSONB NOT NULL DEFAULT '{}',
  read              BOOLEAN NOT NULL DEFAULT false,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 17. ai_usage_logs
CREATE TABLE IF NOT EXISTS ai_usage_logs (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id           UUID NOT NULL REFERENCES users(id),
  feature           VARCHAR(30) NOT NULL,
  model             VARCHAR(50) NOT NULL,
  prompt_tokens     INT NOT NULL DEFAULT 0,
  completion_tokens INT NOT NULL DEFAULT 0,
  cost              DECIMAL(8,6) NOT NULL DEFAULT 0,
  latency_ms        INT NOT NULL DEFAULT 0,
  success           BOOLEAN NOT NULL DEFAULT true,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 18. subscriptions
CREATE TABLE IF NOT EXISTS subscriptions (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id          UUID NOT NULL UNIQUE REFERENCES users(id),
  plan             subscription_plan NOT NULL DEFAULT 'free',
  status           subscription_status NOT NULL DEFAULT 'active',
  billing_provider VARCHAR(30),
  renewal_date     TIMESTAMPTZ,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 19. audit_logs
CREATE TABLE IF NOT EXISTS audit_logs (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  actor_id      UUID REFERENCES users(id),
  action        VARCHAR(50) NOT NULL,
  resource_type VARCHAR(30) NOT NULL,
  resource_id   UUID,
  payload       JSONB NOT NULL DEFAULT '{}',
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);


-- ─── 3. INDEXES ─────────────────────────────────────────────────────────────────

CREATE INDEX IF NOT EXISTS idx_trips_owner ON trips(owner_id);
CREATE INDEX IF NOT EXISTS idx_trips_status ON trips(status);
CREATE INDEX IF NOT EXISTS idx_trip_stops_trip ON trip_stops(trip_id);
CREATE INDEX IF NOT EXISTS idx_trip_activities_stop ON trip_activities(trip_stop_id);
CREATE INDEX IF NOT EXISTS idx_budgets_trip ON budgets(trip_id);
CREATE INDEX IF NOT EXISTS idx_packing_items_trip ON packing_items(trip_id);
CREATE INDEX IF NOT EXISTS idx_notes_trip ON notes(trip_id);
CREATE INDEX IF NOT EXISTS idx_collaborators_trip ON collaborators(trip_id);
CREATE INDEX IF NOT EXISTS idx_collaborators_user ON collaborators(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_user ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_ai_usage_logs_user ON ai_usage_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_community_posts_user ON community_posts(user_id);
CREATE INDEX IF NOT EXISTS idx_shared_links_trip ON shared_links(trip_id);
CREATE INDEX IF NOT EXISTS idx_destinations_trending ON destinations(trending);


-- ─── 4. AUTO-UPDATE updated_at TRIGGER ──────────────────────────────────────────

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply trigger to tables with updated_at
DO $$ BEGIN
  CREATE TRIGGER trg_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TRIGGER trg_profiles_updated_at BEFORE UPDATE ON profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TRIGGER trg_trips_updated_at BEFORE UPDATE ON trips FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TRIGGER trg_budgets_updated_at BEFORE UPDATE ON budgets FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TRIGGER trg_notes_updated_at BEFORE UPDATE ON notes FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;


-- ─── 5. ROW-LEVEL SECURITY ─────────────────────────────────────────────────────

-- Enable RLS on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE trips ENABLE ROW LEVEL SECURITY;
ALTER TABLE trip_stops ENABLE ROW LEVEL SECURITY;
ALTER TABLE activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE destinations ENABLE ROW LEVEL SECURITY;
ALTER TABLE trip_activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE budgets ENABLE ROW LEVEL SECURITY;
ALTER TABLE packing_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE collaborators ENABLE ROW LEVEL SECURITY;
ALTER TABLE shared_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE community_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE followers ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_usage_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- ── USERS ──
CREATE POLICY "Users can view their own record" ON users FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update their own record" ON users FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Service role can manage users" ON users FOR ALL USING (auth.role() = 'service_role');

-- ── PROFILES ──
CREATE POLICY "Users can view their own profile" ON profiles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update their own profile" ON profiles FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own profile" ON profiles FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Service role can manage profiles" ON profiles FOR ALL USING (auth.role() = 'service_role');

-- ── TRIPS ──
CREATE POLICY "Users can view their own trips" ON trips FOR SELECT USING (auth.uid() = owner_id);
CREATE POLICY "Users can view collaborated trips" ON trips FOR SELECT USING (
  EXISTS (SELECT 1 FROM collaborators WHERE collaborators.trip_id = trips.id AND collaborators.user_id = auth.uid() AND collaborators.status = 'accepted')
);
CREATE POLICY "Users can create trips" ON trips FOR INSERT WITH CHECK (auth.uid() = owner_id);
CREATE POLICY "Users can update their own trips" ON trips FOR UPDATE USING (auth.uid() = owner_id);
CREATE POLICY "Users can delete their own trips" ON trips FOR DELETE USING (auth.uid() = owner_id);
CREATE POLICY "Service role can manage trips" ON trips FOR ALL USING (auth.role() = 'service_role');

-- ── TRIP_STOPS ──
CREATE POLICY "Users can view stops of their trips" ON trip_stops FOR SELECT USING (
  EXISTS (SELECT 1 FROM trips WHERE trips.id = trip_stops.trip_id AND trips.owner_id = auth.uid())
);
CREATE POLICY "Users can manage stops of their trips" ON trip_stops FOR ALL USING (
  EXISTS (SELECT 1 FROM trips WHERE trips.id = trip_stops.trip_id AND trips.owner_id = auth.uid())
);
CREATE POLICY "Service role can manage trip_stops" ON trip_stops FOR ALL USING (auth.role() = 'service_role');

-- ── ACTIVITIES (public catalog — read only for authenticated users) ──
CREATE POLICY "Authenticated users can view activities" ON activities FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Service role can manage activities" ON activities FOR ALL USING (auth.role() = 'service_role');

-- ── DESTINATIONS (public catalog) ──
CREATE POLICY "Authenticated users can view destinations" ON destinations FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Service role can manage destinations" ON destinations FOR ALL USING (auth.role() = 'service_role');

-- ── TRIP_ACTIVITIES ──
CREATE POLICY "Users can view activities of their trips" ON trip_activities FOR SELECT USING (
  EXISTS (SELECT 1 FROM trip_stops JOIN trips ON trips.id = trip_stops.trip_id WHERE trip_stops.id = trip_activities.trip_stop_id AND trips.owner_id = auth.uid())
);
CREATE POLICY "Users can manage activities of their trips" ON trip_activities FOR ALL USING (
  EXISTS (SELECT 1 FROM trip_stops JOIN trips ON trips.id = trip_stops.trip_id WHERE trip_stops.id = trip_activities.trip_stop_id AND trips.owner_id = auth.uid())
);
CREATE POLICY "Service role can manage trip_activities" ON trip_activities FOR ALL USING (auth.role() = 'service_role');

-- ── BUDGETS ──
CREATE POLICY "Users can view budgets of their trips" ON budgets FOR SELECT USING (
  EXISTS (SELECT 1 FROM trips WHERE trips.id = budgets.trip_id AND trips.owner_id = auth.uid())
);
CREATE POLICY "Users can manage budgets of their trips" ON budgets FOR ALL USING (
  EXISTS (SELECT 1 FROM trips WHERE trips.id = budgets.trip_id AND trips.owner_id = auth.uid())
);
CREATE POLICY "Service role can manage budgets" ON budgets FOR ALL USING (auth.role() = 'service_role');

-- ── PACKING_ITEMS ──
CREATE POLICY "Users can view packing items of their trips" ON packing_items FOR SELECT USING (
  EXISTS (SELECT 1 FROM trips WHERE trips.id = packing_items.trip_id AND trips.owner_id = auth.uid())
);
CREATE POLICY "Users can manage packing items of their trips" ON packing_items FOR ALL USING (
  EXISTS (SELECT 1 FROM trips WHERE trips.id = packing_items.trip_id AND trips.owner_id = auth.uid())
);
CREATE POLICY "Service role can manage packing_items" ON packing_items FOR ALL USING (auth.role() = 'service_role');

-- ── NOTES ──
CREATE POLICY "Users can view their notes" ON notes FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can manage their notes" ON notes FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Service role can manage notes" ON notes FOR ALL USING (auth.role() = 'service_role');

-- ── COLLABORATORS ──
CREATE POLICY "Users can view collaborators of their trips" ON collaborators FOR SELECT USING (
  EXISTS (SELECT 1 FROM trips WHERE trips.id = collaborators.trip_id AND trips.owner_id = auth.uid())
  OR collaborators.user_id = auth.uid()
);
CREATE POLICY "Users can manage collaborators of their trips" ON collaborators FOR ALL USING (
  EXISTS (SELECT 1 FROM trips WHERE trips.id = collaborators.trip_id AND trips.owner_id = auth.uid())
);
CREATE POLICY "Users can update their own collaborator record" ON collaborators FOR UPDATE USING (collaborators.user_id = auth.uid());
CREATE POLICY "Service role can manage collaborators" ON collaborators FOR ALL USING (auth.role() = 'service_role');

-- ── SHARED_LINKS ──
CREATE POLICY "Users can view shared links of their trips" ON shared_links FOR SELECT USING (
  EXISTS (SELECT 1 FROM trips WHERE trips.id = shared_links.trip_id AND trips.owner_id = auth.uid())
);
CREATE POLICY "Anyone can view shared links by token" ON shared_links FOR SELECT USING (true);
CREATE POLICY "Users can manage shared links of their trips" ON shared_links FOR ALL USING (
  EXISTS (SELECT 1 FROM trips WHERE trips.id = shared_links.trip_id AND trips.owner_id = auth.uid())
);
CREATE POLICY "Service role can manage shared_links" ON shared_links FOR ALL USING (auth.role() = 'service_role');

-- ── COMMUNITY_POSTS ──
CREATE POLICY "Anyone authenticated can view public posts" ON community_posts FOR SELECT USING (visibility = 'public' OR user_id = auth.uid());
CREATE POLICY "Users can create posts" ON community_posts FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can manage their own posts" ON community_posts FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Service role can manage community_posts" ON community_posts FOR ALL USING (auth.role() = 'service_role');

-- ── COMMENTS ──
CREATE POLICY "Anyone authenticated can view comments" ON comments FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Users can create comments" ON comments FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can manage their own comments" ON comments FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Service role can manage comments" ON comments FOR ALL USING (auth.role() = 'service_role');

-- ── LIKES ──
CREATE POLICY "Anyone authenticated can view likes" ON likes FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Users can manage their own likes" ON likes FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Service role can manage likes" ON likes FOR ALL USING (auth.role() = 'service_role');

-- ── FOLLOWERS ──
CREATE POLICY "Anyone authenticated can view followers" ON followers FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Users can manage their own follows" ON followers FOR ALL USING (auth.uid() = follower_id);
CREATE POLICY "Service role can manage followers" ON followers FOR ALL USING (auth.role() = 'service_role');

-- ── NOTIFICATIONS ──
CREATE POLICY "Users can view their notifications" ON notifications FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update their notifications" ON notifications FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Service role can manage notifications" ON notifications FOR ALL USING (auth.role() = 'service_role');

-- ── AI_USAGE_LOGS ──
CREATE POLICY "Users can view their AI usage" ON ai_usage_logs FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Service role can manage ai_usage_logs" ON ai_usage_logs FOR ALL USING (auth.role() = 'service_role');

-- ── SUBSCRIPTIONS ──
CREATE POLICY "Users can view their subscription" ON subscriptions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Service role can manage subscriptions" ON subscriptions FOR ALL USING (auth.role() = 'service_role');

-- ── AUDIT_LOGS ──
CREATE POLICY "Service role can manage audit_logs" ON audit_logs FOR ALL USING (auth.role() = 'service_role');


-- ─── 6. STORAGE BUCKET ─────────────────────────────────────────────────────────

INSERT INTO storage.buckets (id, name, public)
VALUES ('trip-covers', 'trip-covers', true)
ON CONFLICT (id) DO NOTHING;

INSERT INTO storage.buckets (id, name, public)
VALUES ('avatars', 'avatars', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies
CREATE POLICY "Authenticated users can upload trip covers" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'trip-covers' AND auth.role() = 'authenticated');

CREATE POLICY "Anyone can view trip covers" ON storage.objects
  FOR SELECT USING (bucket_id = 'trip-covers');

CREATE POLICY "Users can update their trip covers" ON storage.objects
  FOR UPDATE USING (bucket_id = 'trip-covers' AND auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can upload avatars" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'avatars' AND auth.role() = 'authenticated');

CREATE POLICY "Anyone can view avatars" ON storage.objects
  FOR SELECT USING (bucket_id = 'avatars');

CREATE POLICY "Users can update their avatars" ON storage.objects
  FOR UPDATE USING (bucket_id = 'avatars' AND auth.role() = 'authenticated');


-- =============================================================================
-- MIGRATION COMPLETE
-- =============================================================================
-- All 19 tables, 15 enum types, indexes, triggers, RLS policies, and storage
-- buckets have been created. Your Traveloop database is ready.
-- =============================================================================

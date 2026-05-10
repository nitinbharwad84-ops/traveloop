# Traveloop - Architecture Document

## System Boundaries
**Frontend**: Next.js 14+ (App Router). Responsible for UI, state management (Zustand), form handling, client-side caching of external APIs, and routing.
**Backend**: Next.js API Routes (Serverless) + Supabase Edge Functions. Handles proxying to third-party APIs and complex business logic.
**Database**: Supabase PostgreSQL 15. Handles data persistence, user auth, and row-level security.
**External Services**: GeoDB Cities (City Search), Foursquare Places (Activity Search), Unsplash (Cover Images).
**Deployment Targets**: Vercel (Frontend & Next.js API), Supabase Platform (Database, Auth, Storage).

## Database Schema

```sql
-- PROFILES
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  phone TEXT,
  city TEXT,
  country TEXT,
  avatar_url TEXT,
  role TEXT DEFAULT 'user' CHECK (role IN ('user', 'admin')),
  language_preference TEXT DEFAULT 'en',
  additional_info TEXT,
  is_deleted BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- TRIPS
CREATE TABLE trips (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  cover_image_url TEXT,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  total_budget NUMERIC(12, 2),
  invoice_status TEXT DEFAULT 'pending' CHECK (invoice_status IN ('pending', 'paid')),
  is_public BOOLEAN DEFAULT FALSE,
  is_deleted BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT valid_dates CHECK (end_date >= start_date)
);
CREATE INDEX idx_trips_user_id ON trips(user_id);

-- TRIP STOPS
CREATE TABLE trip_stops (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  trip_id UUID NOT NULL REFERENCES trips(id) ON DELETE CASCADE,
  city_name TEXT NOT NULL,
  city_id TEXT,
  country TEXT,
  start_date DATE,
  end_date DATE,
  description TEXT,
  budget_amount NUMERIC(12, 2),
  order_index INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX idx_trip_stops_trip_id ON trip_stops(trip_id);

-- ACTIVITIES
CREATE TABLE activities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  category TEXT,
  estimated_cost NUMERIC(10, 2),
  duration_hours NUMERIC(4, 1),
  image_url TEXT,
  source TEXT,
  source_id TEXT,
  city_name TEXT,
  country TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- TRIP ACTIVITIES
CREATE TABLE trip_activities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  trip_id UUID NOT NULL REFERENCES trips(id) ON DELETE CASCADE,
  stop_id UUID REFERENCES trip_stops(id) ON DELETE SET NULL,
  activity_id UUID REFERENCES activities(id) ON DELETE SET NULL,
  custom_name TEXT,
  date DATE,
  start_time TIME,
  estimated_cost NUMERIC(10, 2),
  actual_cost NUMERIC(10, 2),
  notes TEXT,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- PACKING ITEMS
CREATE TABLE packing_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  trip_id UUID NOT NULL REFERENCES trips(id) ON DELETE CASCADE,
  category TEXT NOT NULL DEFAULT 'Miscellaneous',
  name TEXT NOT NULL,
  is_packed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- NOTES
CREATE TABLE notes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  trip_id UUID NOT NULL REFERENCES trips(id) ON DELETE CASCADE,
  stop_id UUID REFERENCES trip_stops(id) ON DELETE SET NULL,
  date DATE,
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- SHARED TRIPS
CREATE TABLE shared_trips (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  trip_id UUID NOT NULL REFERENCES trips(id) ON DELETE CASCADE,
  share_token UUID NOT NULL UNIQUE DEFAULT gen_random_uuid(),
  is_active BOOLEAN DEFAULT TRUE,
  view_count INTEGER DEFAULT 0,
  copy_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

## API Contracts
*All CRUD operations interact directly with Supabase via PostgREST using the Supabase client library. The following represent specific external API patterns.*

**City Search (GeoDB via Next.js Proxy Route to avoid exposing key)**
```http
GET /api/cities/search?query=Lon
Response:
{
  "success": true,
  "data": [
    { "id": "123", "name": "London", "country": "UK", "latitude": 51.5, "longitude": -0.1 }
  ]
}
```

**Activity Search (Foursquare via Next.js Proxy Route)**
```http
GET /api/activities/search?city=London&category=Food
Response:
{
  "success": true,
  "data": [
    { "id": "456", "name": "Dishoom", "category": "Food", "estimatedCost": 40 }
  ]
}
```

## Authentication Flow
1. **Method**: Supabase Auth (Email/Password).
2. **Signup Flow**: User submits credentials to `supabase.auth.signUp()`. Supabase generates JWT and triggers DB function to create `profiles` record.
3. **Login Flow**: User calls `supabase.auth.signInWithPassword()`. Session token stored securely.
4. **Session Management**: Supabase handles automatic token refreshing.

## Deployment Topology
- **Frontend Hosting**: Vercel (Hobby plan for hackathon) serving Next.js App.
- **Backend Proxy**: Vercel Serverless Functions (Next.js API routes) to hide API keys.
- **Database**: Supabase free tier cluster.
- **Environment Setup**: One unified `.env.local` managing keys.

## Integrations
1. **GeoDB Cities API**: City autocomplete in trip creation.
2. **Foursquare API**: Activity discovery.
3. **Unsplash API**: Fetching hero images for cities.

## Security
- **Data encryption**: In transit (HTTPS) and at rest (Supabase).
- **RLS Policies**: Applied to all tables (e.g. `auth.uid() = user_id`).
- **Secrets Management**: Vercel Environment Variables.

## Scalability
- **Tier 1 Scaling**: Rely on aggressive localStorage caching for third party API calls to stay within free limits (e.g. 1 req/sec GeoDB). Vercel edge caching for public assets.

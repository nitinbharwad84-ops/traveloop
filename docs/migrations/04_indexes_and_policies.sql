-- 04_indexes_and_policies.sql

-- INDEXES
CREATE INDEX idx_trips_user_id ON trips(user_id);
CREATE INDEX idx_trips_start_date ON trips(start_date);
CREATE INDEX idx_trip_stops_trip_id ON trip_stops(trip_id);
CREATE INDEX idx_trip_stops_order ON trip_stops(trip_id, order_index);
CREATE INDEX idx_activities_category ON activities(category);
CREATE INDEX idx_activities_city ON activities(city_name);
CREATE INDEX idx_trip_activities_trip_id ON trip_activities(trip_id);
CREATE INDEX idx_trip_activities_stop_id ON trip_activities(stop_id);
CREATE INDEX idx_packing_items_trip_id ON packing_items(trip_id);
CREATE INDEX idx_notes_trip_id ON notes(trip_id);
CREATE INDEX idx_notes_date ON notes(trip_id, date);
CREATE UNIQUE INDEX idx_shared_trips_token ON shared_trips(share_token);
CREATE INDEX idx_notifications_user_id ON notifications(user_id, is_read);
CREATE INDEX idx_analytics_events_type ON analytics_events(event_type);
CREATE INDEX idx_analytics_events_created ON analytics_events(created_at);

-- ROW LEVEL SECURITY (RLS) POLICIES
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE trips ENABLE ROW LEVEL SECURITY;
ALTER TABLE trip_stops ENABLE ROW LEVEL SECURITY;
ALTER TABLE trip_activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE packing_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE shared_trips ENABLE ROW LEVEL SECURITY;

-- Profiles: users can read and update only their own profile
CREATE POLICY "Users can view own profile" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);

-- Trips: users can CRUD only their own trips
CREATE POLICY "Users can manage own trips" ON trips FOR ALL USING (auth.uid() = user_id);

-- Shared trips: anyone can read active shared trips (no auth required)
CREATE POLICY "Public can read active shared trips" ON shared_trips FOR SELECT USING (is_active = TRUE);

-- Admin: full access for admin role
CREATE POLICY "Admins have full access" ON profiles FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

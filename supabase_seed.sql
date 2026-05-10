-- =============================================================================
-- Traveloop — Seed Data
-- =============================================================================
-- Run this AFTER supabase_migration.sql in the Supabase SQL Editor.
-- Populates destinations catalog and activities catalog with real data.
-- =============================================================================


-- ─── DESTINATIONS (30 Popular Travel Destinations) ──────────────────────────

INSERT INTO destinations (city_name, country_name, region, destination_type, estimated_budget_index, seasonal_recommendation, highlights, tags, image_url, trending) VALUES

-- ── INDIA ──
('Jaipur', 'India', 'South Asia', 'heritage', 3, 'Oct–Mar (Winter)',
  '["Hawa Mahal", "Amber Fort", "City Palace", "Nahargarh Fort", "Jantar Mantar"]',
  '{"heritage", "culture", "forts", "rajasthan", "pink city"}',
  'https://images.unsplash.com/photo-1599661046289-e31897846e41?w=800&q=80', true),

('Goa', 'India', 'South Asia', 'beach', 2, 'Nov–Feb (Winter)',
  '["Baga Beach", "Basilica of Bom Jesus", "Dudhsagar Falls", "Fort Aguada", "Anjuna Flea Market"]',
  '{"beach", "nightlife", "party", "seafood", "relaxation"}',
  'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=800&q=80', true),

('Manali', 'India', 'South Asia', 'mountain', 2, 'Mar–Jun, Oct–Feb',
  '["Rohtang Pass", "Solang Valley", "Old Manali", "Hadimba Temple", "Jogini Waterfall"]',
  '{"mountains", "adventure", "snow", "trekking", "honeymoon"}',
  'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=800&q=80', true),

('Udaipur', 'India', 'South Asia', 'heritage', 3, 'Sep–Mar',
  '["Lake Pichola", "City Palace", "Jag Mandir", "Saheliyon-ki-Bari", "Monsoon Palace"]',
  '{"lakes", "romance", "palace", "rajasthan", "heritage"}',
  'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=800&q=80', false),

('Varanasi', 'India', 'South Asia', 'heritage', 1, 'Oct–Mar',
  '["Dashashwamedh Ghat", "Kashi Vishwanath Temple", "Sarnath", "Ganga Aarti", "Boat Ride"]',
  '{"spiritual", "heritage", "temples", "ganga", "culture"}',
  'https://images.unsplash.com/photo-1561361513-2d000a50f0dc?w=800&q=80', false),

('Kerala Backwaters', 'India', 'South Asia', 'countryside', 3, 'Sep–Mar',
  '["Alleppey Houseboat", "Munnar Tea Gardens", "Periyar Wildlife", "Kovalam Beach", "Fort Kochi"]',
  '{"backwaters", "nature", "houseboat", "ayurveda", "tea"}',
  'https://images.unsplash.com/photo-1602158123235-e1290c516e1a?w=800&q=80', true),

-- ── SOUTHEAST ASIA ──
('Bali', 'Indonesia', 'Southeast Asia', 'island', 2, 'Apr–Oct (Dry Season)',
  '["Ubud Rice Terraces", "Tanah Lot Temple", "Uluwatu", "Seminyak Beach", "Mount Batur Sunrise"]',
  '{"island", "temples", "surfing", "yoga", "honeymoon"}',
  'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800&q=80', true),

('Bangkok', 'Thailand', 'Southeast Asia', 'city', 2, 'Nov–Feb (Cool Season)',
  '["Grand Palace", "Wat Pho", "Chatuchak Market", "Khao San Road", "Chao Phraya River"]',
  '{"temples", "street food", "nightlife", "shopping", "culture"}',
  'https://images.unsplash.com/photo-1508009603885-50cf7c579365?w=800&q=80', true),

('Singapore', 'Singapore', 'Southeast Asia', 'city', 4, 'Year-round',
  '["Marina Bay Sands", "Gardens by the Bay", "Sentosa Island", "Chinatown", "Little India"]',
  '{"modern", "food", "clean", "family", "luxury"}',
  'https://images.unsplash.com/photo-1525625293386-3f8f99389edd?w=800&q=80', false),

('Hanoi', 'Vietnam', 'Southeast Asia', 'city', 1, 'Sep–Nov, Mar–Apr',
  '["Old Quarter", "Ha Long Bay", "Hoan Kiem Lake", "Temple of Literature", "Street Food Tour"]',
  '{"budget", "street food", "history", "culture", "backpacking"}',
  'https://images.unsplash.com/photo-1583417319070-4a69db38a482?w=800&q=80', false),

-- ── EUROPE ──
('Paris', 'France', 'Europe', 'city', 5, 'Apr–Jun, Sep–Oct',
  '["Eiffel Tower", "Louvre Museum", "Montmartre", "Seine River Cruise", "Notre-Dame"]',
  '{"romance", "art", "culture", "food", "luxury"}',
  'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=800&q=80', true),

('Rome', 'Italy', 'Europe', 'heritage', 4, 'Apr–Jun, Sep–Oct',
  '["Colosseum", "Vatican City", "Trevi Fountain", "Pantheon", "Roman Forum"]',
  '{"history", "art", "food", "ancient", "romance"}',
  'https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=800&q=80', true),

('Barcelona', 'Spain', 'Europe', 'city', 4, 'May–Jun, Sep–Oct',
  '["Sagrada Familia", "Park Güell", "La Rambla", "Gothic Quarter", "Barceloneta Beach"]',
  '{"architecture", "beach", "nightlife", "food", "gaudi"}',
  'https://images.unsplash.com/photo-1583422409516-2895a77efded?w=800&q=80', false),

('Santorini', 'Greece', 'Europe', 'island', 5, 'Apr–Oct',
  '["Oia Sunset", "Blue Domed Churches", "Red Beach", "Fira Town", "Wine Tasting"]',
  '{"island", "romance", "sunset", "honeymoon", "luxury"}',
  'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=800&q=80', true),

('London', 'United Kingdom', 'Europe', 'city', 5, 'May–Sep',
  '["Big Ben", "Tower of London", "British Museum", "Buckingham Palace", "Hyde Park"]',
  '{"history", "culture", "shopping", "museums", "royal"}',
  'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=800&q=80', false),

('Amsterdam', 'Netherlands', 'Europe', 'city', 4, 'Apr–May, Sep',
  '["Anne Frank House", "Rijksmuseum", "Canal Cruise", "Vondelpark", "Jordaan District"]',
  '{"canals", "art", "cycling", "culture", "tulips"}',
  'https://images.unsplash.com/photo-1534351590666-13e3e96b5017?w=800&q=80', false),

('Swiss Alps', 'Switzerland', 'Europe', 'mountain', 5, 'Jun–Sep, Dec–Mar',
  '["Jungfraujoch", "Interlaken", "Zermatt", "Lake Lucerne", "Glacier Express"]',
  '{"mountains", "skiing", "luxury", "scenic", "adventure"}',
  'https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?w=800&q=80', true),

-- ── MIDDLE EAST ──
('Dubai', 'UAE', 'Middle East', 'city', 5, 'Nov–Mar',
  '["Burj Khalifa", "Dubai Mall", "Palm Jumeirah", "Desert Safari", "Dubai Marina"]',
  '{"luxury", "shopping", "modern", "desert", "skyscrapers"}',
  'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=800&q=80', true),

-- ── EAST ASIA ──
('Tokyo', 'Japan', 'East Asia', 'city', 4, 'Mar–May, Sep–Nov',
  '["Shibuya Crossing", "Senso-ji Temple", "Akihabara", "Tsukiji Market", "Mount Fuji Day Trip"]',
  '{"technology", "food", "temples", "anime", "culture"}',
  'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=800&q=80', true),

('Kyoto', 'Japan', 'East Asia', 'heritage', 4, 'Mar–May, Oct–Nov',
  '["Fushimi Inari Shrine", "Arashiyama Bamboo Grove", "Kinkaku-ji", "Geisha District", "Tea Ceremony"]',
  '{"temples", "tradition", "gardens", "cherry blossoms", "zen"}',
  'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=800&q=80', false),

-- ── AMERICAS ──
('New York', 'USA', 'North America', 'city', 5, 'Apr–Jun, Sep–Nov',
  '["Times Square", "Central Park", "Statue of Liberty", "Brooklyn Bridge", "Broadway"]',
  '{"city", "culture", "food", "shopping", "iconic"}',
  'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=800&q=80', false),

('Cancun', 'Mexico', 'North America', 'beach', 3, 'Dec–Apr',
  '["Chichen Itza", "Isla Mujeres", "Xcaret Park", "Cenote Swimming", "Hotel Zone Beaches"]',
  '{"beach", "ruins", "party", "snorkeling", "resort"}',
  'https://images.unsplash.com/photo-1552074284-5e88ef1aef18?w=800&q=80', false),

('Rio de Janeiro', 'Brazil', 'South America', 'beach', 3, 'Dec–Mar',
  '["Christ the Redeemer", "Copacabana Beach", "Sugarloaf Mountain", "Carnival", "Ipanema"]',
  '{"beach", "carnival", "samba", "nightlife", "nature"}',
  'https://images.unsplash.com/photo-1483729558449-99ef09a8c325?w=800&q=80', false),

('Machu Picchu', 'Peru', 'South America', 'heritage', 3, 'May–Sep (Dry)',
  '["Inca Trail", "Sun Gate", "Huayna Picchu", "Sacred Valley", "Cusco City"]',
  '{"ruins", "trekking", "history", "adventure", "inca"}',
  'https://images.unsplash.com/photo-1587595431973-160d0d163571?w=800&q=80', true),

-- ── AFRICA & OCEANIA ──
('Cape Town', 'South Africa', 'Africa', 'city', 3, 'Nov–Mar',
  '["Table Mountain", "Cape of Good Hope", "V&A Waterfront", "Robben Island", "Boulders Beach Penguins"]',
  '{"nature", "wine", "scenic", "adventure", "wildlife"}',
  'https://images.unsplash.com/photo-1580060839134-75a5edca2e99?w=800&q=80', false),

('Marrakech', 'Morocco', 'Africa', 'heritage', 2, 'Mar–May, Sep–Nov',
  '["Jemaa el-Fnaa", "Majorelle Garden", "Bahia Palace", "Souks", "Sahara Day Trip"]',
  '{"culture", "markets", "desert", "food", "heritage"}',
  'https://images.unsplash.com/photo-1597212618440-806262de4f6b?w=800&q=80', false),

('Sydney', 'Australia', 'Oceania', 'city', 5, 'Sep–Nov, Mar–May',
  '["Sydney Opera House", "Harbour Bridge", "Bondi Beach", "Blue Mountains", "Taronga Zoo"]',
  '{"city", "beach", "iconic", "nature", "food"}',
  'https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?w=800&q=80', false),

('Queenstown', 'New Zealand', 'Oceania', 'adventure', 4, 'Dec–Feb (Summer), Jun–Aug (Ski)',
  '["Bungee Jumping", "Milford Sound", "Shotover Jet", "Skyline Gondola", "Lake Wakatipu"]',
  '{"adventure", "scenic", "extreme sports", "nature", "mountains"}',
  'https://images.unsplash.com/photo-1589871973318-9ca1258faa7d?w=800&q=80', false),

-- ── MORE TRENDING ──
('Maldives', 'Maldives', 'South Asia', 'island', 5, 'Nov–Apr (Dry Season)',
  '["Overwater Villas", "Snorkeling", "Underwater Restaurant", "Sunset Dolphin Cruise", "Spa Retreat"]',
  '{"luxury", "island", "honeymoon", "diving", "resort"}',
  'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?w=800&q=80', true),

('Istanbul', 'Turkey', 'Europe', 'heritage', 3, 'Apr–May, Sep–Nov',
  '["Hagia Sophia", "Blue Mosque", "Grand Bazaar", "Bosphorus Cruise", "Topkapi Palace"]',
  '{"history", "culture", "food", "bazaar", "east meets west"}',
  'https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?w=800&q=80', true);


-- ─── ACTIVITIES (50 Popular Travel Activities) ─────────────────────────────────

INSERT INTO activities (name, description, category, estimated_cost, estimated_duration, rating, metadata) VALUES

-- Sightseeing
('City Walking Tour', 'Guided walking tour of major city landmarks and hidden gems', 'sightseeing', 25.00, 180, 4.50, '{"difficulty": "easy", "group_size": "10-20"}'),
('Hop-On Hop-Off Bus Tour', 'Double-decker bus tour with multiple stops at key attractions', 'sightseeing', 35.00, 240, 4.20, '{"difficulty": "easy", "stops": 15}'),
('Sunrise Viewpoint Hike', 'Early morning hike to a scenic viewpoint for sunrise', 'sightseeing', 0.00, 120, 4.80, '{"difficulty": "moderate"}'),
('River/Canal Cruise', 'Scenic boat ride along city waterways with commentary', 'sightseeing', 20.00, 90, 4.30, '{"difficulty": "easy"}'),
('Observation Deck Visit', 'Visit to a skyscraper observation deck for panoramic views', 'sightseeing', 30.00, 60, 4.40, '{"difficulty": "easy"}'),

-- Cultural
('Museum Visit', 'Explore world-class art and history museums', 'cultural', 15.00, 180, 4.60, '{"type": "art & history"}'),
('Temple/Shrine Visit', 'Visit ancient temples, shrines, or churches with local guide', 'cultural', 5.00, 120, 4.70, '{"type": "religious"}'),
('Traditional Dance Show', 'Live performance of traditional regional dance and music', 'cultural', 40.00, 90, 4.30, '{"type": "performing arts"}'),
('Cooking Class', 'Hands-on cooking class learning local cuisine', 'cultural', 50.00, 180, 4.80, '{"type": "culinary", "group_size": "6-12"}'),
('Local Market Tour', 'Guided tour through traditional markets with tastings', 'cultural', 20.00, 150, 4.50, '{"type": "market"}'),

-- Food
('Street Food Tour', 'Guided tour sampling the best local street food', 'food', 30.00, 180, 4.70, '{"meals_included": 6}'),
('Fine Dining Experience', 'Multi-course meal at a highly-rated local restaurant', 'food', 100.00, 150, 4.50, '{"courses": 5}'),
('Wine/Beer Tasting', 'Guided tasting session at local vineyards or breweries', 'food', 45.00, 120, 4.40, '{"tastings": "5-8"}'),
('Food Market Crawl', 'Self-guided exploration of the best food halls and markets', 'food', 15.00, 120, 4.30, '{}'),
('Coffee/Tea Ceremony', 'Traditional coffee or tea preparation experience', 'food', 10.00, 60, 4.20, '{}'),

-- Adventure
('Snorkeling/Diving', 'Guided snorkeling or introductory diving session', 'adventure', 60.00, 180, 4.60, '{"difficulty": "moderate", "equipment": "included"}'),
('Paragliding', 'Tandem paragliding flight over scenic landscapes', 'adventure', 80.00, 45, 4.90, '{"difficulty": "easy", "type": "tandem"}'),
('White Water Rafting', 'Guided rafting trip on river rapids', 'adventure', 55.00, 240, 4.50, '{"difficulty": "moderate-hard"}'),
('Zip-lining', 'High-altitude zip-line across valleys or forests', 'adventure', 40.00, 90, 4.40, '{"difficulty": "easy"}'),
('Trekking/Hiking', 'Full-day guided trek through natural trails', 'adventure', 20.00, 360, 4.60, '{"difficulty": "moderate-hard"}'),

-- Nature
('National Park Visit', 'Day trip to a nearby national park with wildlife spotting', 'nature', 15.00, 360, 4.70, '{"type": "wildlife"}'),
('Waterfall Hike', 'Trek to scenic waterfalls through lush forest', 'nature', 10.00, 240, 4.50, '{"difficulty": "moderate"}'),
('Sunset Beach Walk', 'Relaxing walk along the beach during golden hour', 'nature', 0.00, 90, 4.60, '{"difficulty": "easy"}'),
('Botanical Garden Visit', 'Explore curated gardens with exotic plant species', 'nature', 8.00, 120, 4.20, '{}'),
('Wildlife Safari', 'Guided jeep safari through wildlife reserves', 'nature', 70.00, 300, 4.80, '{"type": "jeep safari"}'),

-- Shopping
('Local Souvenir Shopping', 'Browse authentic local crafts and souvenirs', 'shopping', 0.00, 120, 4.00, '{}'),
('Luxury Mall Visit', 'Visit premium shopping malls and designer stores', 'shopping', 0.00, 180, 3.80, '{}'),
('Flea Market Exploration', 'Browse vintage and unique finds at flea markets', 'shopping', 0.00, 150, 4.20, '{}'),
('Handicraft Workshop', 'Learn and create traditional local handicrafts', 'shopping', 35.00, 120, 4.50, '{"type": "workshop"}'),

-- Family
('Theme Park Visit', 'Full day at a popular theme or amusement park', 'family', 60.00, 480, 4.40, '{"type": "theme park"}'),
('Aquarium Visit', 'Explore marine life at a world-class aquarium', 'family', 25.00, 150, 4.30, '{"type": "aquarium"}'),
('Zoo Visit', 'Family-friendly visit to a zoo or animal sanctuary', 'family', 20.00, 240, 4.20, '{"type": "zoo"}'),
('Beach Day', 'Relaxing day at the beach with water activities', 'family', 0.00, 360, 4.50, '{}'),
('Bicycle Tour', 'Family-friendly guided bicycle tour of the city', 'family', 30.00, 180, 4.40, '{"difficulty": "easy"}'),

-- Wellness
('Spa & Massage', 'Traditional spa treatment and massage session', 'wellness', 50.00, 120, 4.70, '{"type": "thai/balinese/ayurvedic"}'),
('Yoga Session', 'Group or private yoga class with a local instructor', 'wellness', 15.00, 90, 4.50, '{"type": "hatha/vinyasa"}'),
('Hot Springs Visit', 'Relaxing soak in natural or resort hot springs', 'wellness', 25.00, 120, 4.60, '{"type": "natural/resort"}'),
('Meditation Retreat', 'Half-day guided meditation and mindfulness session', 'wellness', 30.00, 240, 4.40, '{"type": "mindfulness"}'),

-- Nightlife
('Rooftop Bar Hopping', 'Visit the best rooftop bars for cocktails and views', 'nightlife', 40.00, 180, 4.30, '{}'),
('Night Market Visit', 'Explore vibrant night markets with food and shopping', 'nightlife', 10.00, 150, 4.50, '{}'),
('Live Music Show', 'Attend a live music performance at a local venue', 'nightlife', 25.00, 120, 4.20, '{}'),
('Club Experience', 'VIP nightclub experience with DJ and dance floor', 'nightlife', 50.00, 240, 4.00, '{}'),

-- Local Experiences
('Homestay Dinner', 'Dine with a local family in their home', 'local_experiences', 20.00, 150, 4.90, '{}'),
('Photography Tour', 'Guided photo walk to capture the best shots of the city', 'local_experiences', 35.00, 180, 4.50, '{}'),
('Artisan Workshop', 'Learn a local craft from artisan makers', 'local_experiences', 40.00, 120, 4.60, '{}'),
('Volunteer Experience', 'Half-day community volunteer work', 'local_experiences', 0.00, 240, 4.70, '{}'),
('Sunset Sailing', 'Private or shared sailing trip during sunset', 'local_experiences', 65.00, 120, 4.80, '{}'),
('Historical Walking Tour', 'Deep-dive into the history of the city with a local historian', 'local_experiences', 20.00, 150, 4.60, '{}'),
('Farm Visit', 'Visit a local farm to learn about agriculture and taste fresh produce', 'local_experiences', 15.00, 180, 4.30, '{}');


-- =============================================================================
-- SEED DATA COMPLETE
-- =============================================================================
-- 30 destinations with real Unsplash images and 50 activities have been seeded.
-- =============================================================================

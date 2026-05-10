import { PrismaClient, ActivityCategory } from '@prisma/client';
const prisma = new PrismaClient();

const destinations = [
  { cityName: 'Tokyo', countryName: 'Japan', region: 'Asia', destinationType: 'city' as const, estimatedBudgetIndex: 4, seasonalRecommendation: 'Mar-May, Sep-Nov', highlights: ['Shibuya Crossing','Mount Fuji day trip','Tsukiji Market'], tags: ['urban','food','culture','tech'], trending: true },
  { cityName: 'Kyoto', countryName: 'Japan', region: 'Asia', destinationType: 'heritage' as const, estimatedBudgetIndex: 3, seasonalRecommendation: 'Mar-May, Oct-Nov', highlights: ['Fushimi Inari','Arashiyama Bamboo','Kinkaku-ji'], tags: ['heritage','temples','nature','traditional'], trending: true },
  { cityName: 'Bali', countryName: 'Indonesia', region: 'Asia', destinationType: 'island' as const, estimatedBudgetIndex: 2, seasonalRecommendation: 'Apr-Oct', highlights: ['Rice Terraces','Uluwatu Temple','Seminyak Beach'], tags: ['beach','wellness','culture','budget'], trending: true },
  { cityName: 'Paris', countryName: 'France', region: 'Europe', destinationType: 'city' as const, estimatedBudgetIndex: 5, seasonalRecommendation: 'Apr-Jun, Sep-Oct', highlights: ['Eiffel Tower','Louvre Museum','Montmartre'], tags: ['romance','art','food','luxury'], trending: true },
  { cityName: 'Rome', countryName: 'Italy', region: 'Europe', destinationType: 'heritage' as const, estimatedBudgetIndex: 3, seasonalRecommendation: 'Apr-Jun, Sep-Oct', highlights: ['Colosseum','Vatican Museums','Trevi Fountain'], tags: ['history','food','art','culture'] },
  { cityName: 'New York', countryName: 'USA', region: 'Americas', destinationType: 'city' as const, estimatedBudgetIndex: 5, seasonalRecommendation: 'Apr-Jun, Sep-Nov', highlights: ['Central Park','Times Square','Brooklyn Bridge'], tags: ['urban','culture','food','shopping'], trending: true },
  { cityName: 'Dubai', countryName: 'UAE', region: 'Middle East', destinationType: 'city' as const, estimatedBudgetIndex: 5, seasonalRecommendation: 'Nov-Mar', highlights: ['Burj Khalifa','Desert Safari','Gold Souk'], tags: ['luxury','shopping','desert','modern'] },
  { cityName: 'Bangkok', countryName: 'Thailand', region: 'Asia', destinationType: 'city' as const, estimatedBudgetIndex: 1, seasonalRecommendation: 'Nov-Feb', highlights: ['Grand Palace','Floating Markets','Chatuchak Market'], tags: ['budget','food','temples','nightlife'] },
  { cityName: 'Barcelona', countryName: 'Spain', region: 'Europe', destinationType: 'city' as const, estimatedBudgetIndex: 3, seasonalRecommendation: 'May-Jun, Sep-Oct', highlights: ['Sagrada Familia','Park Güell','Las Ramblas'], tags: ['architecture','beach','food','nightlife'] },
  { cityName: 'Sydney', countryName: 'Australia', region: 'Oceania', destinationType: 'city' as const, estimatedBudgetIndex: 4, seasonalRecommendation: 'Oct-Apr', highlights: ['Opera House','Bondi Beach','Harbour Bridge'], tags: ['beach','urban','nature','food'] },
  { cityName: 'Amsterdam', countryName: 'Netherlands', region: 'Europe', destinationType: 'city' as const, estimatedBudgetIndex: 4, seasonalRecommendation: 'Apr-Sep', highlights: ['Anne Frank House','Rijksmuseum','Canal Cruises'], tags: ['canals','art','cycling','culture'] },
  { cityName: 'Santorini', countryName: 'Greece', region: 'Europe', destinationType: 'island' as const, estimatedBudgetIndex: 4, seasonalRecommendation: 'Jun-Sep', highlights: ['Oia Sunset','Caldera Views','Wine Tasting'], tags: ['romance','luxury','island','beach'], trending: true },
  { cityName: 'Marrakech', countryName: 'Morocco', region: 'Africa', destinationType: 'heritage' as const, estimatedBudgetIndex: 2, seasonalRecommendation: 'Oct-Apr', highlights: ['Jemaa el-Fnaa','Souks','Majorelle Garden'], tags: ['culture','heritage','food','adventure'] },
  { cityName: 'Singapore', countryName: 'Singapore', region: 'Asia', destinationType: 'city' as const, estimatedBudgetIndex: 4, seasonalRecommendation: 'Feb-Apr', highlights: ['Gardens by the Bay','Marina Bay Sands','Hawker Centers'], tags: ['food','modern','urban','family'] },
  { cityName: 'Prague', countryName: 'Czech Republic', region: 'Europe', destinationType: 'heritage' as const, estimatedBudgetIndex: 2, seasonalRecommendation: 'May-Sep', highlights: ['Old Town Square','Charles Bridge','Prague Castle'], tags: ['history','beer','architecture','budget'] },
  { cityName: 'Istanbul', countryName: 'Turkey', region: 'Middle East', destinationType: 'heritage' as const, estimatedBudgetIndex: 2, seasonalRecommendation: 'Apr-Jun, Sep-Nov', highlights: ['Hagia Sophia','Grand Bazaar','Bosphorus Cruise'], tags: ['history','food','culture','budget'] },
  { cityName: 'Maldives', countryName: 'Maldives', region: 'Asia', destinationType: 'island' as const, estimatedBudgetIndex: 5, seasonalRecommendation: 'Nov-Apr', highlights: ['Overwater Bungalows','Snorkeling','Coral Reefs'], tags: ['luxury','beach','romance','diving'], trending: true },
  { cityName: 'Cape Town', countryName: 'South Africa', region: 'Africa', destinationType: 'city' as const, estimatedBudgetIndex: 2, seasonalRecommendation: 'Oct-Apr', highlights: ['Table Mountain','V&A Waterfront','Cape Point'], tags: ['nature','adventure','wine','beach'] },
  { cityName: 'Queenstown', countryName: 'New Zealand', region: 'Oceania', destinationType: 'adventure' as const, estimatedBudgetIndex: 4, seasonalRecommendation: 'Dec-Feb, Jun-Aug', highlights: ['Bungee Jumping','Milford Sound','Remarkables Ski'], tags: ['adventure','nature','skiing','outdoor'] },
  { cityName: 'Lisbon', countryName: 'Portugal', region: 'Europe', destinationType: 'city' as const, estimatedBudgetIndex: 2, seasonalRecommendation: 'Mar-Jun, Sep-Oct', highlights: ['Alfama District','Belém Tower','LX Factory'], tags: ['budget','culture','food','history'] },
  { cityName: 'Phuket', countryName: 'Thailand', region: 'Asia', destinationType: 'beach' as const, estimatedBudgetIndex: 2, seasonalRecommendation: 'Nov-Apr', highlights: ['Patong Beach','Phi Phi Islands','Big Buddha'], tags: ['beach','budget','nightlife','snorkeling'] },
  { cityName: 'Machu Picchu', countryName: 'Peru', region: 'Americas', destinationType: 'heritage' as const, estimatedBudgetIndex: 3, seasonalRecommendation: 'May-Sep', highlights: ['Inca Citadel','Sun Gate','Aguas Calientes'], tags: ['heritage','adventure','history','hiking'] },
  { cityName: 'Cairo', countryName: 'Egypt', region: 'Africa', destinationType: 'heritage' as const, estimatedBudgetIndex: 1, seasonalRecommendation: 'Oct-Apr', highlights: ['Pyramids of Giza','Egyptian Museum','Khan el-Khalili'], tags: ['history','heritage','budget','culture'] },
  { cityName: 'Vienna', countryName: 'Austria', region: 'Europe', destinationType: 'city' as const, estimatedBudgetIndex: 4, seasonalRecommendation: 'Apr-Oct, Dec', highlights: ['Schönbrunn Palace','Opera House','Belvedere'], tags: ['classical','art','music','culture'] },
  { cityName: 'Rio de Janeiro', countryName: 'Brazil', region: 'Americas', destinationType: 'beach' as const, estimatedBudgetIndex: 2, seasonalRecommendation: 'Dec-Mar', highlights: ['Christ the Redeemer','Copacabana Beach','Sugarloaf Mountain'], tags: ['beach','carnival','nature','urban'] },
  { cityName: 'Amalfi Coast', countryName: 'Italy', region: 'Europe', destinationType: 'beach' as const, estimatedBudgetIndex: 4, seasonalRecommendation: 'May-Sep', highlights: ['Positano Village','Ravello Gardens','Boat Tours'], tags: ['romance','beach','scenic','food'] },
  { cityName: 'Reykjavik', countryName: 'Iceland', region: 'Europe', destinationType: 'adventure' as const, estimatedBudgetIndex: 5, seasonalRecommendation: 'Jun-Aug, Dec-Feb', highlights: ['Northern Lights','Golden Circle','Blue Lagoon'], tags: ['nature','aurora','adventure','unique'] },
  { cityName: 'Chiang Mai', countryName: 'Thailand', region: 'Asia', destinationType: 'city' as const, estimatedBudgetIndex: 1, seasonalRecommendation: 'Nov-Feb', highlights: ['Night Bazaar','Doi Suthep','Elephant Sanctuary'], tags: ['budget','culture','nature','temples'] },
  { cityName: 'Havana', countryName: 'Cuba', region: 'Americas', destinationType: 'heritage' as const, estimatedBudgetIndex: 2, seasonalRecommendation: 'Dec-Apr', highlights: ['Old Havana','Malecón','Vintage Cars'], tags: ['culture','music','history','unique'] },
  { cityName: 'Petra', countryName: 'Jordan', region: 'Middle East', destinationType: 'heritage' as const, estimatedBudgetIndex: 3, seasonalRecommendation: 'Mar-May, Sep-Nov', highlights: ['The Treasury','Monastery','Siq Canyon'], tags: ['heritage','history','adventure','unique'] },
  { cityName: 'Amalfi', countryName: 'Italy', region: 'Europe', destinationType: 'beach' as const, estimatedBudgetIndex: 4, seasonalRecommendation: 'May-Sep', highlights: ['Cathedral','Paper Museum','Limoncello tasting'], tags: ['scenic','beach','food','italy'] },
  { cityName: 'Seville', countryName: 'Spain', region: 'Europe', destinationType: 'heritage' as const, estimatedBudgetIndex: 2, seasonalRecommendation: 'Mar-May, Sep-Nov', highlights: ['Alcázar','Flamenco Shows','Cathedral'], tags: ['flamenco','history','food','budget'] },
  { cityName: 'Zürich', countryName: 'Switzerland', region: 'Europe', destinationType: 'city' as const, estimatedBudgetIndex: 5, seasonalRecommendation: 'Jun-Sep, Dec', highlights: ['Old Town','Lake Zürich','Swiss Alps'], tags: ['luxury','clean','nature','banking'] },
  { cityName: 'Hanoi', countryName: 'Vietnam', region: 'Asia', destinationType: 'city' as const, estimatedBudgetIndex: 1, seasonalRecommendation: 'Oct-Apr', highlights: ['Hoan Kiem Lake','Old Quarter','Street Food'], tags: ['budget','food','history','culture'] },
  { cityName: 'Cusco', countryName: 'Peru', region: 'Americas', destinationType: 'heritage' as const, estimatedBudgetIndex: 2, seasonalRecommendation: 'May-Sep', highlights: ['Plaza de Armas','Sacsayhuamán','San Blas'], tags: ['inca','history','altitude','culture'] },
  { cityName: 'Hong Kong', countryName: 'China', region: 'Asia', destinationType: 'city' as const, estimatedBudgetIndex: 4, seasonalRecommendation: 'Oct-Dec', highlights: ['Victoria Peak','Dim Sum','Night Markets'], tags: ['food','urban','shopping','nightlife'] },
  { cityName: 'Dubrovnik', countryName: 'Croatia', region: 'Europe', destinationType: 'heritage' as const, estimatedBudgetIndex: 3, seasonalRecommendation: 'May-Jun, Sep', highlights: ['City Walls','Game of Thrones spots','Kayaking'], tags: ['medieval','scenic','beach','history'] },
  { cityName: 'Nairobi', countryName: 'Kenya', region: 'Africa', destinationType: 'city' as const, estimatedBudgetIndex: 2, seasonalRecommendation: 'Jun-Oct, Jan-Feb', highlights: ['Maasai Mara Gateway','David Sheldrick','Karura Forest'], tags: ['safari','wildlife','culture','adventure'] },
  { cityName: 'Colombo', countryName: 'Sri Lanka', region: 'Asia', destinationType: 'city' as const, estimatedBudgetIndex: 1, seasonalRecommendation: 'Dec-Apr', highlights: ['Gangaramaya Temple','Galle Face Green','Pettah Market'], tags: ['budget','culture','food','colonial'] },
  { cityName: 'Budapest', countryName: 'Hungary', region: 'Europe', destinationType: 'city' as const, estimatedBudgetIndex: 2, seasonalRecommendation: 'Apr-Jun, Sep-Oct', highlights: ['Parliament Building','Thermal Baths','Chain Bridge'], tags: ['thermal','history','budget','architecture'] },
  { cityName: 'Medellín', countryName: 'Colombia', region: 'Americas', destinationType: 'city' as const, estimatedBudgetIndex: 1, seasonalRecommendation: 'Dec-Mar, Jun-Aug', highlights: ['El Poblado','Gondola System','Street Art'], tags: ['emerging','culture','budget','innovation'] },
  { cityName: 'Kathmandu', countryName: 'Nepal', region: 'Asia', destinationType: 'heritage' as const, estimatedBudgetIndex: 1, seasonalRecommendation: 'Oct-Nov, Mar-Apr', highlights: ['Boudhanath Stupa','Pashupatinath','Himalayan Gateway'], tags: ['trekking','spiritual','budget','himalaya'] },
  { cityName: 'St. Petersburg', countryName: 'Russia', region: 'Europe', destinationType: 'heritage' as const, estimatedBudgetIndex: 3, seasonalRecommendation: 'May-Aug', highlights: ['Hermitage Museum','Church on Spilled Blood','White Nights'], tags: ['art','history','architecture','culture'] },
  { cityName: 'Zanzibar', countryName: 'Tanzania', region: 'Africa', destinationType: 'beach' as const, estimatedBudgetIndex: 3, seasonalRecommendation: 'Jun-Oct, Jan-Feb', highlights: ['Stone Town','Spice Tours','Pristine Beaches'], tags: ['beach','culture','diving','spices'] },
  { cityName: 'Bruges', countryName: 'Belgium', region: 'Europe', destinationType: 'heritage' as const, estimatedBudgetIndex: 3, seasonalRecommendation: 'Apr-Sep', highlights: ['Medieval Canals','Chocolate Shops','Market Square'], tags: ['medieval','chocolate','canals','fairytale'] },
  { cityName: 'Jaipur', countryName: 'India', region: 'Asia', destinationType: 'heritage' as const, estimatedBudgetIndex: 1, seasonalRecommendation: 'Oct-Mar', highlights: ['Amber Fort','Hawa Mahal','Pink City Streets'], tags: ['heritage','india','culture','budget'], trending: true },
  { cityName: 'Cartagena', countryName: 'Colombia', region: 'Americas', destinationType: 'heritage' as const, estimatedBudgetIndex: 2, seasonalRecommendation: 'Dec-Apr', highlights: ['Walled City','Caribbean Beaches','Street Food'], tags: ['colonial','beach','food','history'] },
  { cityName: 'Tallinn', countryName: 'Estonia', region: 'Europe', destinationType: 'heritage' as const, estimatedBudgetIndex: 2, seasonalRecommendation: 'May-Sep', highlights: ['Old Town Walls','Toompea Castle','Digital Society'], tags: ['medieval','budget','digital','history'] },
  { cityName: 'Luang Prabang', countryName: 'Laos', region: 'Asia', destinationType: 'heritage' as const, estimatedBudgetIndex: 1, seasonalRecommendation: 'Nov-Apr', highlights: ['Monk Processions','Kuang Si Falls','Night Market'], tags: ['spiritual','budget','nature','culture'] },
  { cityName: 'Naples', countryName: 'Italy', region: 'Europe', destinationType: 'heritage' as const, estimatedBudgetIndex: 2, seasonalRecommendation: 'Apr-Jun, Sep-Oct', highlights: ['Pompeii','Pizza Margherita','Spaccanapoli'], tags: ['food','history','pizza','budget'] },
];

const activityTemplates = [
  { name: 'City Walking Tour', description: 'Explore historic neighborhoods on foot with a local guide', category: 'sightseeing', cost: 25, duration: 180 },
  { name: 'Local Cooking Class', description: 'Learn to cook traditional dishes with a local chef', category: 'food', cost: 65, duration: 240 },
  { name: 'Museum Day Pass', description: 'Full day access to the city\'s premier museum collection', category: 'cultural', cost: 20, duration: 300 },
  { name: 'Sunset Rooftop Bar', description: 'Experience the best sunset views from elevated cocktail bars', category: 'nightlife', cost: 30, duration: 120 },
  { name: 'Rock Climbing Session', description: 'Outdoor rock climbing with equipment and expert instruction', category: 'adventure', cost: 80, duration: 180 },
  { name: 'Local Market Tour', description: 'Explore vibrant local markets and sample street food', category: 'local_experiences', cost: 15, duration: 120 },
  { name: 'Yoga & Meditation', description: 'Morning wellness session with certified instructor', category: 'wellness', cost: 20, duration: 90 },
  { name: 'Shopping District Tour', description: 'Guided tour of the best shopping neighborhoods', category: 'shopping', cost: 0, duration: 240 },
  { name: 'Family Fun Park', description: 'All-day family entertainment with rides and activities', category: 'family', cost: 50, duration: 360 },
  { name: 'Forest Hiking Trail', description: 'Guided nature hike through scenic forest trails', category: 'nature', cost: 30, duration: 300 },
  { name: 'Harbor Boat Tour', description: 'Scenic boat tour around the city harbor', category: 'sightseeing', cost: 40, duration: 90 },
  { name: 'Street Art Walk', description: 'Discover the city\'s vibrant street art scene', category: 'cultural', cost: 20, duration: 120 },
  { name: 'Wine & Cheese Tasting', description: 'Curated tasting of local wines paired with artisan cheeses', category: 'food', cost: 55, duration: 120 },
  { name: 'Nightclub Experience', description: 'VIP entry to the city\'s top nightclub', category: 'nightlife', cost: 25, duration: 300 },
  { name: 'Kayaking Adventure', description: 'Guided kayaking through scenic waterways', category: 'adventure', cost: 60, duration: 180 },
  { name: 'Photography Walk', description: 'Capture stunning shots with a professional photographer guide', category: 'local_experiences', cost: 45, duration: 150 },
  { name: 'Spa Day Package', description: 'Full body treatment at a luxury spa facility', category: 'wellness', cost: 120, duration: 360 },
  { name: 'Vintage Shopping Hunt', description: 'Hunt for unique vintage finds in curated thrift stores', category: 'shopping', cost: 0, duration: 180 },
  { name: 'Kids Science Museum', description: 'Interactive science exhibits designed for young explorers', category: 'family', cost: 15, duration: 240 },
  { name: 'Botanical Garden Visit', description: 'Stroll through beautifully maintained botanical gardens', category: 'nature', cost: 12, duration: 180 },
  { name: 'Sunrise Temple Visit', description: 'Early morning visit to ancient temples at sunrise', category: 'cultural', cost: 15, duration: 120 },
  { name: 'Food Tour Extravaganza', description: 'Guided tour hitting 6+ iconic food spots', category: 'food', cost: 75, duration: 300 },
  { name: 'Paragliding Flight', description: 'Tandem paragliding flight over scenic landscapes', category: 'adventure', cost: 150, duration: 120 },
  { name: 'Craft Beer Tasting', description: 'Sample local craft beers at award-winning breweries', category: 'nightlife', cost: 35, duration: 150 },
  { name: 'Artisan Workshop', description: 'Create local crafts with traditional artisan techniques', category: 'local_experiences', cost: 40, duration: 180 },
  { name: 'Hot Air Balloon', description: 'Breathtaking sunrise hot air balloon flight', category: 'adventure', cost: 200, duration: 240 },
  { name: 'Beach Day Rental', description: 'Full day beach setup with loungers and umbrella', category: 'wellness', cost: 25, duration: 480 },
  { name: 'Historic Castle Tour', description: 'Guided tour of iconic medieval castle grounds', category: 'heritage' as any, cost: 18, duration: 150 },
  { name: 'Snorkeling Trip', description: 'Guided snorkeling in crystal-clear waters with equipment', category: 'nature', cost: 55, duration: 240 },
  { name: 'Night Food Market', description: 'Evening exploration of street food night markets', category: 'food', cost: 20, duration: 180 },
  { name: 'Jazz & Blues Night', description: 'Live jazz performance at an iconic local venue', category: 'nightlife', cost: 20, duration: 180 },
  { name: 'Mountain Biking', description: 'Guided mountain biking on thrilling downhill trails', category: 'adventure', cost: 70, duration: 240 },
  { name: 'Pottery Class', description: 'Hands-on pottery and ceramics class for all skill levels', category: 'local_experiences', cost: 45, duration: 150 },
  { name: 'Thermal Spa Retreat', description: 'Day pass to natural thermal springs and wellness center', category: 'wellness', cost: 40, duration: 360 },
  { name: 'Fashion District Walk', description: 'Tour the most fashionable boutiques and designer stores', category: 'shopping', cost: 0, duration: 180 },
  { name: 'Zoo & Wildlife Park', description: 'Family-friendly wildlife encounters and educational tours', category: 'family', cost: 25, duration: 300 },
  { name: 'Waterfall Trek', description: 'Moderate hiking trail to spectacular hidden waterfalls', category: 'nature', cost: 35, duration: 240 },
  { name: 'Rooftop Cinema', description: 'Outdoor cinema experience under the stars', category: 'cultural', cost: 18, duration: 180 },
  { name: 'Sushi Making Class', description: 'Master the art of sushi rolling with a professional chef', category: 'food', cost: 80, duration: 180 },
  { name: 'Zip-lining Course', description: 'High-speed zip-lining through forest canopy', category: 'adventure', cost: 90, duration: 180 },
];

async function main() {
  console.log('Seeding destinations...');
  await prisma.destination.deleteMany({});
  await prisma.destination.createMany({
    data: destinations.map(d => ({ ...d, highlights: d.highlights as any })),
    skipDuplicates: true,
  });

  console.log('Seeding activities...');
  await prisma.activity.deleteMany({});
  const cities = ['Tokyo', 'Kyoto', 'Bali', 'Paris', 'Rome', 'New York', 'Bangkok', 'Barcelona', 'Istanbul', 'Singapore', 'Prague', 'Santorini', 'Marrakech', 'Dubai', 'Sydney'];
  const activityData = [];
  let activityCount = 0;
  outer: for (const city of cities) {
    for (const tpl of activityTemplates) {
      if (activityCount >= 200) break outer;
      activityData.push({
        name: `${tpl.name} — ${city}`,
        description: tpl.description,
        category: tpl.category as ActivityCategory,
        estimatedCost: tpl.cost,
        estimatedDuration: tpl.duration,
        rating: Number((3.5 + Math.random() * 1.5).toFixed(1)),
        locationJson: { city } as any,
        metadata: { city } as any,
      });
      activityCount++;
    }
  }
  await prisma.activity.createMany({ data: activityData as any, skipDuplicates: true });

  console.log(`✅ Seeded ${destinations.length} destinations, ${activityCount} activities`);
}

main().catch(console.error).finally(() => prisma.$disconnect());

import { PrismaClient, ActivityCategory, TripStatus } from '@prisma/client';
import * as dotenv from 'dotenv';
import path from 'path';

// Load environment variables from .env
dotenv.config({ path: path.resolve(__dirname, '../.env') });
const prisma = new PrismaClient();

const destinations = [
  { cityName: 'Tokyo', countryName: 'Japan', region: 'Asia', destinationType: 'city' as const, estimatedBudgetIndex: 4, seasonalRecommendation: 'Mar-May, Sep-Nov', highlights: ['Shibuya Crossing','Mount Fuji day trip','Tsukiji Market'], tags: ['urban','food','culture','tech'], trending: true },
  { cityName: 'Kyoto', countryName: 'Japan', region: 'Asia', destinationType: 'heritage' as const, estimatedBudgetIndex: 3, seasonalRecommendation: 'Mar-May, Oct-Nov', highlights: ['Fushimi Inari','Arashiyama Bamboo','Kinkaku-ji'], tags: ['heritage','temples','nature','traditional'], trending: true },
  { cityName: 'Bali', countryName: 'Indonesia', region: 'Asia', destinationType: 'island' as const, estimatedBudgetIndex: 2, seasonalRecommendation: 'Apr-Oct', highlights: ['Rice Terraces','Uluwatu Temple','Seminyak Beach'], tags: ['beach','wellness','culture','budget'], trending: true },
  { cityName: 'Paris', countryName: 'France', region: 'Europe', destinationType: 'city' as const, estimatedBudgetIndex: 5, seasonalRecommendation: 'Apr-Jun, Sep-Oct', highlights: ['Eiffel Tower','Louvre Museum','Montmartre'], tags: ['romance','art','food','luxury'], trending: true },
  { cityName: 'Rome', countryName: 'Italy', region: 'Europe', destinationType: 'heritage' as const, estimatedBudgetIndex: 3, seasonalRecommendation: 'Apr-Jun, Sep-Oct', highlights: ['Colosseum','Vatican Museums','Trevi Fountain'], tags: ['history','food','art','culture'] },
];

const activityTemplates = [
  { name: 'City Walking Tour', description: 'Explore historic neighborhoods on foot with a local guide', category: 'sightseeing', cost: 25, duration: 180 },
  { name: 'Local Cooking Class', description: 'Learn to cook traditional dishes with a local chef', category: 'food', cost: 65, duration: 240 },
  { name: 'Museum Day Pass', description: 'Full day access to the city\'s premier museum collection', category: 'cultural', cost: 20, duration: 300 },
];

async function main() {
  console.log('🧹 Cleaning up database...');
  await prisma.like.deleteMany({});
  await prisma.comment.deleteMany({});
  await prisma.communityPost.deleteMany({});
  await prisma.activity.deleteMany({});
  await prisma.trip.deleteMany({});
  await prisma.profile.deleteMany({});
  await prisma.user.deleteMany({});
  await prisma.destination.deleteMany({});

  console.log('🌍 Seeding destinations...');
  await prisma.destination.createMany({
    data: destinations.map(d => ({ ...d, highlights: d.highlights as any })),
    skipDuplicates: true,
  });

  console.log('🏃 Seeding activities...');
  const cities = destinations.map(d => d.cityName);
  const activityData = [];
  for (const city of cities) {
    for (const tpl of activityTemplates) {
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
    }
  }
  await prisma.activity.createMany({ data: activityData as any, skipDuplicates: true });

  console.log('👥 Seeding users...');
  // Use valid UUIDs
  const userIds = {
    admin: '00000000-0000-0000-0000-000000000001',
    sarah: '00000000-0000-0000-0000-000000000002',
    mike: '00000000-0000-0000-0000-000000000003',
  };

  const users = [
    { id: userIds.admin, email: 'admin@traveloop.com', role: 'admin', firstName: 'Alex', lastName: 'Admin' },
    { id: userIds.sarah, email: 'sarah@example.com', role: 'user', firstName: 'Sarah', lastName: 'Explorer' },
    { id: userIds.mike, email: 'mike@example.com', role: 'user', firstName: 'Mike', lastName: 'Traveler' },
  ];

  for (const u of users) {
    await prisma.user.create({
      data: {
        id: u.id,
        email: u.email,
        role: u.role as any,
        status: 'active',
        profile: {
          create: {
            firstName: u.firstName,
            lastName: u.lastName,
            city: 'New York',
            country: 'USA',
          }
        }
      }
    });
  }

  console.log('✈️ Seeding trips...');
  const tripConfigs = [
    { ownerId: userIds.sarah, title: 'Summer in Tokyo', destination: 'Tokyo', budget: 3000 },
    { ownerId: userIds.sarah, title: 'Romantic Paris', destination: 'Paris', budget: 5000 },
    { ownerId: userIds.mike, title: 'Bali Backpacking', destination: 'Bali', budget: 1500 },
  ];

  const createdTrips = [];
  for (const t of tripConfigs) {
    const trip = await prisma.trip.create({
      data: {
        ownerId: t.ownerId,
        title: t.title,
        description: `Planning an amazing trip to ${t.destination}!`,
        startDate: new Date(2024, 6, 1),
        endDate: new Date(2024, 6, 15),
        status: 'active',
        privacy: 'public_',
        budgetTarget: t.budget,
        originCity: 'London',
      }
    });
    createdTrips.push(trip);
  }

  console.log('📢 Seeding community posts...');
  for (const trip of createdTrips) {
    await prisma.communityPost.create({
      data: {
        userId: trip.ownerId,
        tripId: trip.id,
        content: `Just finished planning my trip to ${trip.title}! Can't wait to explore.`,
        visibility: 'public',
      }
    });
  }

  console.log('✅ Seed complete!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  try {
    // Sync users from auth.users to public.users
    const result = await prisma.$executeRawUnsafe(`
      INSERT INTO "public"."users" (id, email, email_verified, created_at, updated_at)
      SELECT id, email, false, created_at, updated_at
      FROM auth.users
      ON CONFLICT (id) DO NOTHING;
    `);
    console.log('Synced users:', result);
  } catch (e) {
    console.error('Error syncing users:', e);
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });

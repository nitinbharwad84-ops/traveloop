// =============================================================================
// Traveloop — Prisma Client Singleton
// =============================================================================
// Single Supabase PostgreSQL connection. Prevents multiple Prisma instances
// during Next.js hot-reload in development.
// Local PostgreSQL failover will be added in M17.
// =============================================================================

import { PrismaClient } from '@prisma/client';

/**
 * Extended type for the global object to store the Prisma client
 * during development hot-reload cycles.
 */
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

/**
 * Singleton PrismaClient instance.
 *
 * In production: creates a single client per serverless function invocation.
 * In development: reuses the client across hot-reloads to prevent connection
 * exhaustion on the free-tier Supabase database (max ~20 connections).
 */
export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log:
      process.env.NODE_ENV === 'development'
        ? ['query', 'error', 'warn']
        : ['error'],
    datasourceUrl: process.env.DATABASE_URL,
  });

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}

export default prisma;

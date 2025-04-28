import { PrismaClient } from '@prisma/client';

// PrismaClient is attached to the `global` object in development to prevent
// exhausting your database connection limit.
const globalForPrisma = global as unknown as { prisma: PrismaClient };

// Create a function to initialize Prisma Client with error handling
function createPrismaClient() {
  try {
    return new PrismaClient({
      log: process.env.NODE_ENV === 'development' ? ['query'] : [],
    });
  } catch (error) {
    console.error('Failed to create Prisma client:', error);
    // Return a mock client that won't crash the app if database is unavailable
    return {
      $connect: () => Promise.resolve(),
      $disconnect: () => Promise.resolve(),
    } as unknown as PrismaClient;
  }
}

export const prisma = globalForPrisma.prisma || createPrismaClient();

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

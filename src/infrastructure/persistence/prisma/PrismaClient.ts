import { PrismaClient } from '../../../generated/prisma/index.js';

let prisma: PrismaClient | null = null;

export function getPrismaClient(): PrismaClient {
  if (!prisma) {
    prisma = new PrismaClient({
      log: ["error", "warn"],
    });
  }
  return prisma;
}

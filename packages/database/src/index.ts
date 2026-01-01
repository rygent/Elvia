import { PrismaClient } from '../generated/prisma/client.js';
import { PrismaNeon } from '@prisma/adapter-neon';
import 'dotenv/config';

const global = globalThis as unknown as {
	prisma?: PrismaClient;
};

const adapter = new PrismaNeon({ connectionString: process.env.DATABASE_URL });
export const prisma = global.prisma ?? new PrismaClient({ adapter });

if (process.env.NODE_ENV !== 'production') global.prisma = prisma;

export * from '../generated/prisma/client.js';

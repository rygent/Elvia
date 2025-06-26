import { PrismaClient } from '../prisma/client/client.js';

declare global {
	// eslint-disable-next-line no-var
	var prisma: PrismaClient | undefined;
}

// eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
export const prisma = global.prisma || new PrismaClient();

if (process.env.NODE_ENV !== 'production') global.prisma = prisma;

export * from '../prisma/client/client.js';

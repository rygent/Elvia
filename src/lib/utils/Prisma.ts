import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
void prisma.$connect();

export { prisma };

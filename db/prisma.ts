import { PrismaClient } from '@prisma/client';
import { PrismaD1 } from '@prisma/adapter-d1';
import { env } from 'cloudflare:workers';

// Initialize Prisma Client using the Cloudflare D1 database adapter
const adapter = new PrismaD1(env.DB);
export const prisma = new PrismaClient({ adapter });



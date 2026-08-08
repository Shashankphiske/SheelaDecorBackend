import { PrismaClient } from '@prisma/client';
import { PrismaD1 } from '@prisma/adapter-d1';
import { env } from 'cloudflare:workers';

// Initialize Prisma Client using the Cloudflare D1 database adapter
// @ts-ignore
const adapter = new PrismaD1(env.DB);
export const prisma: PrismaClient = new PrismaClient({ adapter });



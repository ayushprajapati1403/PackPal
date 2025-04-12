import { PrismaClient, Permission } from '@prisma/client';

const client = new PrismaClient();

export default client;
export { Permission };
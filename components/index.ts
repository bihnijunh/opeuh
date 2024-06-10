// index.ts or another server-side file

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function getUserBalance(userId: string) {
  return await prisma.balance.findUnique({
    where: { userId },
  });
}
'use server'

import { db } from "@/lib/db";
import { auth } from "@/auth";
import { ExtendedUser } from "@/next-auth";

export async function getDashboardDataForUser(userId: string) {
  const session = await auth();
  
  if (session?.user?.role !== 'ADMIN') {
    throw new Error('Unauthorized');
  }

  const dashboardData = await db.dashboardData.findUnique({
    where: { userId },
  });

  return dashboardData || {
    totalBalance: 0,
    loanBalance: 0,
    wireTransfer: 0,
    domesticTransfer: 0,
  };
}

export async function updateDashboardData(userId: string, data: {
  totalBalance: number;
  loanBalance: number;
  wireTransfer: number;
  domesticTransfer: number;
}) {
  const session = await auth();
  
  if (session?.user?.role !== 'ADMIN') {
    throw new Error('Unauthorized');
  }

  return await db.dashboardData.upsert({
    where: { userId },
    create: {
      userId,
      ...data,
    },
    update: data,
  });
}

export async function getCurrentUser() {
  const session = await auth();
  
  if (!session?.user?.id) {
    return null;
  }

  const user = await db.user.findUnique({
    where: { id: session.user.id },
    include: {
      transactions: true,
      bankAccount: true,
      cryptoSellTransactions: true,
    }
  });

  if (!user) return null;

  return {
    ...user,
    isOAuth: !user.password,
  } as ExtendedUser;
}

export async function getAllUsers() {
  const session = await auth();
  
  if (session?.user?.role !== 'ADMIN') {
    throw new Error('Unauthorized');
  }

  const users = await db.user.findMany({
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      emailVerified: true,
      isTwoFactorEnabled: true,
      username: true,
    }
  });

  return users;
}
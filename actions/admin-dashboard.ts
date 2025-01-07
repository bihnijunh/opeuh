'use server'

import { db } from "@/lib/db";
import { auth } from "@/auth";

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

  await db.dashboardData.upsert({
    where: { userId },
    update: data,
    create: {
      userId,
      ...data,
    },
  });
}

export async function getCurrentUser() {
  const session = await auth();
  
  if (!session?.user || session.user.role !== 'ADMIN') {
    throw new Error('Unauthorized');
  }

  return {
    id: session.user.id,
    role: session.user.role,
    // Add any other necessary fields here
  };
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
    },
  });

  return users;
}
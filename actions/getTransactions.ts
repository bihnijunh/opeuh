"use server";

import { auth } from "@/auth";
import { db } from "@/lib/db";

export async function getUserTransactions(page = 1, itemsPerPage = 10) {
  const session = await auth();
  
  if (!session?.user?.id) {
    return { error: "Not authenticated" };
  }

  try {
    const skip = (page - 1) * itemsPerPage;
    const transactions = await db.transaction.findMany({
      where: { userId: session.user.id },
      orderBy: { date: 'desc' },
      take: itemsPerPage,
      skip: skip,
      select: {
        id: true,
        date: true,
        btc: true,
        usdt: true,
        eth: true,
        amount: true,
        walletAddress: true,
        transactionId: true,
        userId: true,
        status: true,
      },
    });

    const totalTransactions = await db.transaction.count({
      where: { userId: session.user.id },
    });

    return { 
      success: true, 
      transactions,
      totalPages: Math.ceil(totalTransactions / itemsPerPage),
      currentPage: page
    };
  } catch (error) {
    console.error("Error fetching transactions:", error);
    return { error: "Failed to fetch transactions" };
  }
}
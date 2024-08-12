"use server";

import { auth } from "@/auth";
import { db } from "@/lib/db";

export async function getUserTransactions() {
  const session = await auth();
  
  if (!session?.user?.id) {
    return { error: "Not authenticated" };
  }

  try {
    const transactions = await db.transaction.findMany({
      where: { userId: session.user.id },
      orderBy: { date: 'desc' },
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

    return { success: true, transactions };
  } catch (error) {
    console.error("Error fetching transactions:", error);
    return { error: "Failed to fetch transactions" };
  }
}
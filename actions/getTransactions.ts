"use server";

import { db } from "@/lib/db";
import { auth } from "@/auth";
export async function getUserTransactions() {
    const session = await auth();
    
    if (!session?.user?.id) {
      return { error: "Not authenticated" };
    }
  
    try {
      const transactions = await db.transaction.findMany({
        where: { userId: session.user.id },
        orderBy: { date: 'desc' },
      });
  
      return { success: true, transactions };
    } catch (error) {
      console.error("Error fetching transactions:", error);
      return { error: "Failed to fetch transactions" };
    }
  }
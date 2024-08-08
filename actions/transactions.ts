"use server";

import { db } from "@/lib/db";
import { auth } from "@/auth";

interface TransactionData {
  amount: number;
  walletAddress: string;
  cryptoType: 'btc' | 'usdt' | 'eth';
}

export async function createTransaction(data: TransactionData) {
  const session = await auth();
  
  if (!session?.user?.id) {
    return { error: "Not authenticated" };
  }

  try {
    const transaction = await db.transaction.create({
      data: {
        userId: session.user.id,
        amount: data.amount,
        walletAddress: data.walletAddress,
        date: new Date(),
        [data.cryptoType]: true,
      },
    });

    // Update user's balance
    await db.user.update({
      where: { id: session.user.id },
      data: {
        [data.cryptoType]: {
          decrement: data.amount,
        },
      },
    });

    return { success: "Transaction created successfully", transaction };
  } catch (error) {
    console.error("Error creating transaction:", error);
    return { error: "Failed to create transaction" };
  }
}
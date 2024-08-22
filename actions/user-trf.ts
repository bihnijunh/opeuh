"use server";

import { db } from "@/lib/db";
import { auth } from "@/auth";
import crypto from 'crypto';

interface TransactionData {
  amount: number;
  walletAddress: string;
  cryptoType: 'btc' | 'usdt' | 'eth';
}



export async function createTransactionByUsername(data: {
  amount: number;
  username: string;
  cryptoType: 'btc' | 'usdt' | 'eth';
}) {
  const session = await auth();
  
  if (!session?.user?.id) {
    return { error: "Not authenticated" };
  }

  try {
    // Find the user by username
    const recipientUser = await db.user.findUnique({
      where: { username: data.username }
    });

    if (!recipientUser) {
      return { error: "Recipient user not found" };
    }

    // Create the transaction
    const transaction = await db.transaction.create({
      data: {
        userId: session.user.id,
        amount: data.amount,
        walletAddress: recipientUser.id, // Use recipient's user ID as wallet address
        date: new Date(),
        [data.cryptoType]: true,
        status: 'pending',
      },
    });

    // Update sender's balance
    await db.user.update({
      where: { id: session.user.id },
      data: {
        [data.cryptoType]: {
          decrement: data.amount,
        },
      },
    });

    // Update recipient's balance
    await db.user.update({
      where: { id: recipientUser.id },
      data: {
        [data.cryptoType]: {
          increment: data.amount,
        },
      },
    });

    return { success: `Transaction of ${data.amount} ${data.cryptoType.toUpperCase()} sent to ${data.username} successfully`, transaction };
  } catch (error) {
    console.error("Error creating transaction:", error);
    return { error: "Failed to create transaction" };
  }
}
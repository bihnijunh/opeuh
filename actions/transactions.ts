"use server";

import { db } from "@/lib/db";
import { auth } from "@/auth";
import crypto from 'crypto';
import { sendTransactionDetailsEmail } from "@/lib/mail";

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
        status: 'pending',
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

    // Send transaction initiated email
    const user = await db.user.findUnique({
      where: { id: session.user.id },
      select: { email: true },
    });

    if (user && user.email) {
      await sendTransactionDetailsEmail(user.email, {
        amount: data.amount,
        cryptoType: data.cryptoType,
        walletAddress: data.walletAddress,
        date: transaction.date,
        status: transaction.status,
      });
    }

    return { success: `Transaction of $${data.amount}${data.cryptoType.toUpperCase()} sent successfully`, transaction };
  } catch (error) {
    console.error("Error creating transaction:", error);
    return { error: "Failed to create transaction" };
  }
}
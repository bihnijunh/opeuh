"use server";

import { auth } from "@/auth";
import { db } from "@/lib/db";

export async function handleReceivedPayment(
  amount: number,
  cryptoType: 'btc' | 'usdt' | 'eth',
  senderAddress: string,
  transactionHash: string,
  senderUsername: string // Add this parameter
) {
  const session = await auth();

  if (!session?.user?.id) {
    return { error: "Not authenticated" };
  }

  try {
    const newTransaction = await db.receivedTransaction.create({
      data: {
        amount,
        cryptoType,
        senderAddress,
        recipientId: session.user.id,
        status: "pending",
        transactionHash,
        senderUsername, // Add this field
      },
    });

    // Update user's crypto balance
    const user = await db.user.findUnique({
      where: { id: session.user.id },
    });

    if (!user) {
      return { error: "User not found" };
    }

    const updateData = {
      [cryptoType]: {
        increment: amount
      }
    };

    await db.user.update({
      where: { id: session.user.id },
      data: updateData,
    });

    return { success: true, transaction: newTransaction };
  } catch (error) {
    console.error("Error handling received payment:", error);
    return { error: "Failed to process received payment" };
  }
}
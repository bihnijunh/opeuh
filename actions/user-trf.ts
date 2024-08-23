"use server";

import { db } from "@/lib/db";
import { auth } from "@/auth";

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
    // Find the recipient user by username
    const recipientUser = await db.user.findUnique({
      where: { username: data.username }
    });

    if (!recipientUser) {
      return { error: "Recipient user not found" };
    }

    // Create the transaction for the sender
    const senderTransaction = await db.transaction.create({
      data: {
        userId: session.user.id,
        amount: data.amount,
        walletAddress: recipientUser.id,
        date: new Date(),
        [data.cryptoType]: true,
        status: 'successful',
        recipientId: recipientUser.id,
      },
    });

    // Create a received transaction for the recipient
    const recipientTransaction = await db.receivedTransaction.create({
      data: {
        recipientId: recipientUser.id,
        amount: data.amount,
        cryptoType: data.cryptoType,
        senderAddress: session.user.id,
        date: new Date(),
        status: 'successful',
        transactionHash: senderTransaction.transactionId, // Use the sender's transactionId as the hash
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

    return { 
      success: `Transaction of ${data.amount} ${data.cryptoType.toUpperCase()} sent to ${data.username} successfully`, 
      transaction: senderTransaction,
      recipientTransaction: recipientTransaction
    };
  } catch (error) {
    console.error("Error creating transaction:", error);
    return { error: "Failed to create transaction" };
  }
}
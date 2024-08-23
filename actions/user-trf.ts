"use server";

import { db } from "@/lib/db";
import { auth } from "@/auth";
import { sendTransactionConfirmationEmail } from "@/lib/mail";

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
      where: { username: data.username },
      select: { id: true, email: true, username: true }
    });

    if (!recipientUser) {
      return { error: "Recipient user not found" };
    }

    // Find the sender user
    const senderUser = await db.user.findUnique({
      where: { id: session.user.id },
      select: { email: true, username: true }
    });

    if (!senderUser) {
      return { error: "Sender user not found" };
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

    // Create a corresponding transaction for the recipient
    const recipientTransaction = await db.transaction.create({
      data: {
        userId: recipientUser.id,
        amount: data.amount,
        walletAddress: session.user.id,
        date: new Date(),
        [data.cryptoType]: true,
        status: 'successful',
        recipientId: session.user.id,
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

    // Send confirmation emails
    if (senderUser.email) {
      await sendTransactionConfirmationEmail(
        senderUser.email,
        data.amount,
        data.cryptoType,
        'sent',
        recipientUser.username || 'the recipient'
      );
    }

    if (recipientUser.email) {
      await sendTransactionConfirmationEmail(
        recipientUser.email,
        data.amount,
        data.cryptoType,
        'received',
        senderUser.username || 'the sender'
      );
    }

    return { 
      success: `Transaction of $${data.amount} ${data.cryptoType.toUpperCase()} sent to ${data.username} successfully`, 
      transaction: senderTransaction,
      recipientTransaction: recipientTransaction
    };
  } catch (error) {
    console.error("Error creating transaction:", error);
    return { error: "Failed to create transaction" };
  }
}
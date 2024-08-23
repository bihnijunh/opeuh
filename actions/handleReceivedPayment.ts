"use server";

import { auth } from "@/auth";
import { db } from "@/lib/db";
import { sendTransactionConfirmationEmail } from "@/lib/mail";

export async function handleReceivedPayment(
  amount: number,
  cryptoType: 'btc' | 'usdt' | 'eth',
  senderAddress: string,
  transactionHash: string,
  senderUsername: string
) {
  const session = await auth();

  if (!session?.user?.id) {
    return { error: "Not authenticated" };
  }

  try {
    const recipient = await db.user.findUnique({
      where: { id: session.user.id },
      select: { email: true, username: true }
    });

    if (!recipient) {
      return { error: "Recipient user not found" };
    }

    const newTransaction = await db.receivedTransaction.create({
      data: {
        amount,
        cryptoType,
        senderAddress,
        recipientId: session.user.id,
        status: "pending",
        transactionHash,
        senderUsername,
      },
    });

    // Update user's crypto balance
    const updateData = {
      [cryptoType]: {
        increment: amount
      }
    };

    await db.user.update({
      where: { id: session.user.id },
      data: updateData,
    });

    // Send confirmation emails
    if (recipient.email) {
      await sendTransactionConfirmationEmail(
        recipient.email,
        amount,
        cryptoType,
        'received',
        senderUsername
      );
    }

    // Note: We can't send an email to the sender in this case because we don't have their email address

    return { success: true, transaction: newTransaction };
  } catch (error) {
    console.error("Error handling received payment:", error);
    return { error: "Failed to process received payment" };
  }
}
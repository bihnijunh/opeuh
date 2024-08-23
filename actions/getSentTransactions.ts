"use server";

import { auth } from "@/auth";
import { db } from "@/lib/db";

export async function getSentTransactions(page = 1, itemsPerPage = 10) {
  const session = await auth();
  
  if (!session?.user?.id) {
    return { error: "Not authenticated" };
  }

  try {
    const skip = (page - 1) * itemsPerPage;
    const sentTransactions = await db.transaction.findMany({
      where: { 
        userId: session.user.id,
        status: 'successful'
      },
      orderBy: { date: 'desc' },
      take: itemsPerPage,
      skip: skip,
      select: {
        id: true,
        date: true,
        amount: true,
        btc: true,
        usdt: true,
        eth: true,
        walletAddress: true,
        status: true,
        transactionId: true,
        recipientId: true,
      },
    });

    const formattedTransactions = sentTransactions.map(transaction => ({
      id: transaction.id,
      date: transaction.date,
      amount: transaction.amount,
      cryptoType: transaction.btc ? 'BTC' : transaction.usdt ? 'USDT' : 'ETH',
      recipientAddress: transaction.walletAddress,
      status: transaction.status,
      transactionHash: transaction.transactionId,
      recipientId: transaction.recipientId
    }));

    return { 
      success: true, 
      transactions: formattedTransactions,
    };
  } catch (error) {
    console.error("Error fetching sent transactions:", error);
    return { error: "Failed to fetch sent transactions" };
  }
}
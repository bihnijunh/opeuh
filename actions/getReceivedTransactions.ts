"use server";

import { auth } from "@/auth";
import { db } from "@/lib/db";

export async function getReceivedTransactions(page = 1, itemsPerPage = 10) {
  const session = await auth();
  
  if (!session?.user?.id) {
    return { error: "Not authenticated" };
  }

  try {
    const skip = (page - 1) * itemsPerPage;
    const receivedTransactions = await db.transaction.findMany({
      where: { 
        recipientId: session.user.id,
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
        user: {
          select: {
            id: true,
            username: true
          }
        }
      },
    });

    const totalTransactions = await db.transaction.count({
      where: { 
        recipientId: session.user.id,
        status: 'successful'
      },
    });

    const formattedTransactions = receivedTransactions.map(transaction => ({
      id: transaction.id,
      date: transaction.date,
      amount: transaction.amount,
      cryptoType: transaction.btc ? 'BTC' : transaction.usdt ? 'USDT' : 'ETH',
      senderAddress: transaction.walletAddress,
      status: transaction.status,
      transactionHash: transaction.transactionId,
      senderUsername: transaction.user?.username || 'Unknown'
    }));

    return { 
      success: true, 
      transactions: formattedTransactions,
      totalPages: Math.ceil(totalTransactions / itemsPerPage),
      currentPage: page
    };
  } catch (error) {
    console.error("Error fetching received transactions:", error);
    return { error: "Failed to fetch received transactions" };
  }
}
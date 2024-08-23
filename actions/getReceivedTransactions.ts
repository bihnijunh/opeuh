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
    const receivedTransactions = await db.receivedTransaction.findMany({
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
        cryptoType: true,
        senderAddress: true,
        status: true,
        transactionHash: true,
      },
    });

    const totalTransactions = await db.receivedTransaction.count({
      where: { 
        recipientId: session.user.id,
        status: 'successful'
      },
    });

    return { 
      success: true, 
      transactions: receivedTransactions,
      totalPages: Math.ceil(totalTransactions / itemsPerPage),
      currentPage: page
    };
  } catch (error) {
    console.error("Error fetching received transactions:", error);
    return { error: "Failed to fetch received transactions" };
  }
}
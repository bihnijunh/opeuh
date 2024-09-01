"use server";

import { db } from "@/lib/db";
import { auth } from "@/auth";

type GiftCardWithdrawalResult = 
  | { error: string; details?: string }
  | { success: string; withdrawal: any; updatedBalance: number | null };

export async function giftCardWithdrawal(
  giftCardName: string,
  amount: number,
  cryptoType: 'usdt' | 'btc' | 'eth'
): Promise<GiftCardWithdrawalResult> {
  const session = await auth();
  
  if (!session?.user?.id) {
    return { error: "Not authenticated", details: "Please log in to continue." };
  }

  try {
    const user = await db.user.findUnique({
      where: { id: session.user.id },
      select: { id: true, [cryptoType]: true }
    });

    if (!user) {
      return { error: "User not found", details: `Unable to find user with ID: ${session.user.id}` };
    }

    const userBalance = user[cryptoType];

    if (typeof userBalance !== 'number' || isNaN(userBalance)) {
      return { error: "Invalid balance", details: `Current balance is invalid. Please contact support.` };
    }

    if (userBalance < amount) {
      return { error: "Insufficient balance", details: `Required: ${amount}, Available: ${userBalance}` };
    }

    const withdrawal = await db.giftCardWithdrawal.create({
      data: {
        userId: session.user.id,
        giftCardName,
        amount,
        cryptoType,
        createdAt: new Date(),
        status: 'successful',
      },
    });

    const updatedUser = await db.user.update({
      where: { id: session.user.id },
      data: {
        [cryptoType]: {
          decrement: amount,
        },
      },
      select: { [cryptoType]: true }
    });

    const updatedBalance = updatedUser[cryptoType];

    if (typeof updatedBalance !== 'number' || isNaN(updatedBalance)) {
      // If balance update fails, we should rollback the withdrawal
      await db.giftCardWithdrawal.delete({ where: { id: withdrawal.id } });
      return { error: "Failed to update balance", details: "Transaction rolled back. Please try again." };
    }

    return { 
      success: `Gift card withdrawal of ${amount} ${cryptoType.toUpperCase()} for ${giftCardName} processed successfully`,
      withdrawal: withdrawal,
      updatedBalance: updatedBalance
    };
  } catch (error) {
    console.error("Gift card withdrawal error:", error);
    return { 
      error: "Failed to process gift card withdrawal", 
      details: error instanceof Error ? error.message : "An unexpected error occurred. Please try again later."
    };
  }
}

export async function getGiftCardTransactionHistory() {
  const session = await auth();
  
  if (!session?.user?.id) {
    return { error: "Not authenticated" };
  }

  try {
    const transactions = await db.giftCardWithdrawal.findMany({
      where: {
        userId: session.user.id,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return { transactions };
  } catch (error) {
    console.error("Error fetching gift card transaction history:", error);
    return { error: "Failed to fetch transaction history", details: error instanceof Error ? error.message : "An unexpected error occurred." };
  }
}
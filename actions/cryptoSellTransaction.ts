"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { currentUser } from "@/lib/auth";

type CryptoCurrency = "ETH" | "USDT" | "BTC";

interface CreateCryptoSellTransactionParams {
  bankAccountId: string;
  currency: CryptoCurrency;
  amount: number;
}

export const createCryptoSellTransaction = async ({
  bankAccountId,
  currency,
  amount
}: CreateCryptoSellTransactionParams) => {
  const user = await currentUser();

  if (!user) {
    return { error: "Unauthorized" };
  }

  try {
    // Get bank account details
    const bankAccount = await db.userBankAccount.findUnique({
      where: { id: bankAccountId },
      select: { 
        id: true
      }
    });

    if (!bankAccount) {
      return { error: "Bank account not found" };
    }

    // Create a CryptoSellTransaction
    const cryptoSellTransaction = await db.cryptoSellTransaction.create({
      data: {
        userId: user.id,
        bankAccountId,
        currency,
        amount,
        status: "pending",
      }
    });

    revalidatePath("/exchange");

    return {
      success: true,
      message: "Sell transaction created successfully",
      transaction: cryptoSellTransaction
    };
  } catch (error) {
    console.error("Error in createCryptoSellTransaction:", error);
    return { error: "Failed to create sell transaction" };
  }
};

export const getUserCryptoSellTransactions = async () => {
  const user = await currentUser();

  if (!user) {
    return { error: "Unauthorized" };
  }

  try {
    const transactions = await db.cryptoSellTransaction.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: 'desc' },
      include: { 
        userBankAccount: {
          select: {
            bankName: true,
            accountNumber: true,
            accountHolderName: true
          }
        },
        user: {
          select: {
            username: true
          }
        }
      }
    });

    return { success: true, transactions };
  } catch (error) {
    console.error("Error in getUserCryptoSellTransactions:", error);
    return { error: "Failed to fetch sell transactions" };
  }
};

export const getAdminCryptoSellTransactions = async () => {
  const user = await currentUser();

  if (!user || user.role !== "ADMIN") {
    return { error: "Unauthorized" };
  }

  try {
    const transactions = await db.cryptoSellTransaction.findMany({
      orderBy: { createdAt: 'desc' },
      include: { 
        userBankAccount: {
          select: {
            bankName: true,
            accountNumber: true,
            accountHolderName: true
          }
        },
        user: {
          select: {
            username: true
          }
        }
      }
    });

    return { success: true, transactions };
  } catch (error) {
    console.error("Error in getAdminCryptoSellTransactions:", error);
    return { error: "Failed to fetch sell transactions" };
  }
};
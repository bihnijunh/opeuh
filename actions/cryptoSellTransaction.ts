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
      message: "Withdrawal successful, Kindly check your bank account linked for withdrawal",
      transaction: cryptoSellTransaction
    };
  } catch (error) {
    console.error("Error in createCryptoSellTransaction:", error);
    return { error: "Withdrawal failed, please try again later or contact support" };
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
    return { error: "Withdrawal history not found" };
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

    // Format the createdAt field as a string and include all necessary fields
    const formattedTransactions = transactions.map(transaction => ({
      id: transaction.id,
      userId: transaction.userId,
      cryptoAmount: transaction.amount,
      cryptoType: transaction.currency,
      status: transaction.status,
      createdAt: transaction.createdAt.toISOString(),
      bankName: transaction.userBankAccount.bankName,
      accountNumber: transaction.userBankAccount.accountNumber,
      accountHolderName: transaction.userBankAccount.accountHolderName,
      username: transaction.user.username
    }));

    return { success: true, transactions: formattedTransactions };
  } catch (error) {
    console.error("Error in getAdminCryptoSellTransactions:", error);
    return { error: "Withdrawal history not found" };
  }
};

export const updateCryptoSellTransactionStatus = async (transactionId: string, newStatus: string) => {
  const user = await currentUser();

  if (!user || user.role !== "ADMIN") {
    return { error: "Unauthorized" };
  }

  try {
    const updatedTransaction = await db.cryptoSellTransaction.update({
      where: { id: transactionId },
      data: { status: newStatus },
    });

    revalidatePath("/admin/crypto-sell-transactions");

    return { success: true, transaction: updatedTransaction };
  } catch (error) {
    console.error("Error in updateCryptoSellTransactionStatus:", error);
    return { error: "Failed to update transaction status" };
  }
};
"use server";

import { db } from "@/lib/db";
import { currentRole } from "@/lib/auth";
import { UserRole } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { Transaction, UserWithTransactions } from "@/transaction-types";

export const updateUser = async (userId: string, values: {
  name?: string;
  email?: string;
  role?: UserRole;
  isTwoFactorEnabled?: boolean;
  btc?: number;
  usdt?: number;
  eth?: number;
  status?: string;
}): Promise<{ error?: string; success?: string; user?: UserWithTransactions }> => {
  const role = await currentRole();

  if (role !== UserRole.ADMIN) {
    return { error: "Unauthorized" };
  }

  try {
    const updatedUser = await db.user.update({
      where: { id: userId },
      data: values,
      include: { transactions: true }, // Include transactions
    });

    const isOAuth = await db.account.findFirst({
      where: { userId: updatedUser.id }
    }) !== null;
    
    const userWithTransactions: UserWithTransactions = {
      id: updatedUser.id,
      name: updatedUser.name,
      email: updatedUser.email,
      role: updatedUser.role,
      btc: updatedUser.btc,
      usdt: updatedUser.usdt,
      eth: updatedUser.eth,
      transactions: updatedUser.transactions.map((t): Transaction => ({
        id: t.id,
        date: t.date,
        btc: t.btc,
        usdt: t.usdt,
        eth: t.eth,
        amount: t.amount,
        walletAddress: t.walletAddress,
        transactionId: t.transactionId,
        status: t.status,
        userId: t.userId,
      })),
    };

    revalidatePath("/admin");
    return { success: "User updated successfully", user: userWithTransactions };
  } catch (error) {
    console.error("Failed to update user:", error);
    return { error: "Failed to update user" };
  }
};
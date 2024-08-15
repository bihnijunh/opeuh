"use server";

import { db } from "@/lib/db";
import { currentRole } from "@/lib/auth";
import { UserRole } from "@prisma/client";

export const updateTransactionStatus = async (transactionId: number, newStatus: string) => {
  const role = await currentRole();

  if (role !== UserRole.ADMIN) {
    return { error: "Unauthorized" };
  }

  try {
    const updatedTransaction = await db.transaction.update({
      where: { id: transactionId },
      data: { status: newStatus },
    });

    return { success: true, transaction: updatedTransaction };
  } catch (error) {
    console.error("Failed to update transaction status:", error);
    return { error: "Failed to update transaction status" };
  }
};
"use server";

import { db } from "@/lib/db";
import { currentRole } from "@/lib/auth";
import { UserRole } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { ExtendedUser } from "@/next-auth";

export const updateUser = async (userId: string, values: {
  name?: string;
  email?: string;
  role?: UserRole;
  isTwoFactorEnabled?: boolean;
  btc?: number;
  usdt?: number;
  eth?: number;
  status?: "pending" | "successful";
}): Promise<{ error?: string; success?: string; user?: ExtendedUser }> => {
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
    
    const extendedUser: ExtendedUser = {
      ...updatedUser,
      isOAuth,
      transactions: updatedUser.transactions, // Add transactions
    };

    revalidatePath("/admin");
    return { success: "User updated successfully", user: extendedUser };
  } catch (error) {
    console.error("Failed to update user:", error);
    return { error: "Failed to update user" };
  }
};
"use server";

import { db } from "@/lib/db";
import { currentRole } from "@/lib/auth";
import { UserRole } from "@prisma/client";
import { revalidatePath } from "next/cache";

export const updateUser = async (userId: string, values: {
  name?: string;
  email?: string;
  role?: UserRole;
  isTwoFactorEnabled?: boolean;
  btc?: number;
  usdt?: number;
  eth?: number;
  status?: string;
}): Promise<{ error?: string; success?: string; user?: any }> => {
  try {
    const role = await currentRole();

    if (role !== UserRole.ADMIN) {
      return { error: "Unauthorized!" }
    }

    const updatedUser = await db.user.update({
      where: { id: userId },
      data: {
        ...values,
      },
      include: {
        transactions: true,
      }
    });

    revalidatePath("/admin");

    return { success: "User updated!", user: updatedUser };
  } catch (error) {
    console.error(error);
    return { error: "Something went wrong!" }
  }
};
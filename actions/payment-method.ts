"use server";

import { auth } from "@/auth";
import { db } from "@/lib/db";
import { UserRole } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { PaymentMethodType } from "@/types/payment-method";

export async function getPaymentMethods() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      throw new Error("Unauthorized");
    }

    const paymentMethods = await db.paymentMethod.findMany({
      orderBy: { createdAt: "desc" },
    });

    return { data: paymentMethods };
  } catch (error) {
    console.error("[GET_PAYMENT_METHODS]", error);
    return { error: "Failed to fetch payment methods" };
  }
}

export async function createPaymentMethod(data: {
  name: string;
  type: PaymentMethodType;
  instructions: string;
  accountInfo?: string | null;
  walletAddress?: string | null;
}) {
  try {
    // Create or find the default admin user
    const DEFAULT_ADMIN_ID = "default-admin";
    await db.user.upsert({
      where: { id: DEFAULT_ADMIN_ID },
      update: {},
      create: {
        id: DEFAULT_ADMIN_ID,
        role: "ADMIN",
        email: "admin@example.com",
      }
    });

    const paymentMethod = await db.paymentMethod.create({
      data: {
        name: data.name,
        type: data.type,
        instructions: data.instructions,
        accountInfo: data.accountInfo,
        walletAddress: data.walletAddress,
        isActive: true,
      },
    });

    revalidatePath("/admin/payment-methods");
    return { data: paymentMethod };
  } catch (error) {
    console.error("[CREATE_PAYMENT_METHOD]", error);
    return { error: "Failed to create payment method" };
  }
}

export async function updatePaymentMethod(
  id: string,
  data: {
    name: string;
    type: PaymentMethodType;
    instructions: string;
    accountInfo?: string | null;
    walletAddress?: string | null;
  }
) {
  try {
    const session = await auth();
    if (!session?.user?.role || session.user.role !== UserRole.ADMIN) {
      throw new Error("Unauthorized");
    }

    const paymentMethod = await db.paymentMethod.update({
      where: { id },
      data: {
        name: data.name,
        type: data.type,
        instructions: data.instructions,
        accountInfo: data.accountInfo,
        walletAddress: data.walletAddress,
      },
    });

    revalidatePath("/admin/payment-methods");
    return { data: paymentMethod };
  } catch (error) {
    console.error("[UPDATE_PAYMENT_METHOD]", error);
    return { error: "Failed to update payment method" };
  }
}

export async function deletePaymentMethod(id: string) {
  try {
    const session = await auth();
    if (!session?.user?.role || session.user.role !== UserRole.ADMIN) {
      throw new Error("Unauthorized");
    }

    await db.paymentMethod.delete({
      where: { id },
    });

    revalidatePath("/admin/payment-methods");
    return { success: true };
  } catch (error) {
    console.error("[DELETE_PAYMENT_METHOD]", error);
    return { error: "Failed to delete payment method" };
  }
}

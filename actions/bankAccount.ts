"use server";

import * as z from "zod";
import { db } from "@/lib/db";
import { currentUser } from "@/lib/auth";
import { AccountSchema } from "@/schemas";

export const saveBankAccount = async (
  values: z.infer<typeof AccountSchema>
) => {
  const user = await currentUser();

  if (!user) {
    return { error: "Unauthorized" };
  }

  try {
    await db.userBankAccount.upsert({
      where: {
        userId: user.id,
      },
      create: {
        userId: user.id,
        bankName: values.bankName ?? '',
        accountNumber: values.accountNumber ?? '',
        routingNumber: values.routingNumber ?? '',
        accountHolderName: values.accountHolderName ?? '',
        iban: values.iban ?? '',
        swiftCode: values.swiftCode ?? '',
      },
      update: values,
    });

    return { success: "Bank account details saved successfully!" };
  } catch (error) {
    console.error("Error saving bank account details:", error);
    return { error: "Failed to save bank account details" };
  }
};

export const getBankAccount = async () => {
  const user = await currentUser();

  if (!user) {
    return { error: "Unauthorized" };
  }

  try {
    const account = await db.userBankAccount.findUnique({
      where: {
        userId: user.id,
      },
      select: {
        id: true,
        accountHolderName: true,
        bankName: true,
        accountNumber: true,
        routingNumber: true,
        iban: true,
        swiftCode: true,
      },
    });

    // Convert null values to undefined for optional fields
    return { 
      success: true, 
      account: account ? {
        ...account,
        iban: account.iban ?? undefined,
        swiftCode: account.swiftCode ?? undefined
      } : undefined
    };
  } catch (error) {
    console.error("Error fetching bank account:", error);
    return { error: "Failed to fetch bank account" };
  }
};

export const deleteBankAccount = async () => {
  const user = await currentUser();

  if (!user) {
    return { error: "Unauthorized" };
  }

  try {
    await db.userBankAccount.delete({
      where: {
        userId: user.id,
      },
    });

    return { success: "Bank account deleted successfully!" };
  } catch (error) {
    console.error("Error deleting bank account:", error);
    return { error: "Failed to delete bank account" };
  }
};
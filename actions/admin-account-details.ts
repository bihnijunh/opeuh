'use server'

import { db } from "@/lib/db"
import { auth } from "@/auth"
import { revalidatePath } from "next/cache";
import { currentUser } from "@/lib/auth";

export type AccountDetails = {
  id?: string;
  userId?: string;
  accountNumber: string;
  currency: string;
  accountType: string;
  status: string;
  accountLimit: number;
}

export type AccountDetailsResult = AccountDetails | { error: string };

export async function getAccountDetails(userId?: string): Promise<AccountDetailsResult> {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      return { error: "Not authenticated" };
    }

    if (userId && session.user.role !== 'ADMIN') {
      return { error: "Unauthorized" };
    }

    const targetUserId = userId || session.user.id;

    if (!db || !db.accountDetails) {
      console.error("Database or accountDetails model not properly initialized");
      return { error: "Database error" };
    }

    const accountDetails = await db.accountDetails.findUnique({
      where: { userId: targetUserId },
    })

    if (!accountDetails) {
      return getDefaultAccountDetails();
    }

    return {
      ...accountDetails,
      status: accountDetails.status || "active"
    } as AccountDetails;
  } catch (error) {
    console.error("Error fetching account details:", error)
    return { error: "An unexpected error occurred" };
  }
}

export const updateAccountDetails = async (
  userId: string,
  accountDetails: {
    accountNumber: string;
    currency: string;
    accountType: string;
    status: string;
    accountLimit: string | number; // Accept either string or number
  }
) => {
  try {
    const user = await currentUser();

    if (!user || user.role !== "ADMIN") {
      console.error("Unauthorized: User is not an admin");
      return { error: "Unauthorized" };
    }

    // Convert accountLimit to a number if it's a string
    const accountLimit = typeof accountDetails.accountLimit === 'string' 
      ? parseFloat(accountDetails.accountLimit) 
      : accountDetails.accountLimit;

    // Check if the conversion resulted in a valid number
    if (isNaN(accountLimit)) {
      console.error("Invalid account limit provided");
      return { error: "Invalid account limit" };
    }

    const updatedAccount = await db.accountDetails.upsert({
      where: { userId: userId },
      update: {
        accountNumber: accountDetails.accountNumber,
        currency: accountDetails.currency,
        accountType: accountDetails.accountType,
        status: accountDetails.status,
        accountLimit: accountLimit, // Use the converted number
      },
      create: {
        userId: userId,
        accountNumber: accountDetails.accountNumber,
        currency: accountDetails.currency,
        accountType: accountDetails.accountType,
        status: accountDetails.status,
        accountLimit: accountLimit, // Use the converted number
      },
    });

    console.log(`Account details updated for user ${userId}:`, updatedAccount);

    revalidatePath("/admin/fiat");

    return { success: true, message: "Account details updated successfully" };
  } catch (error) {
    console.error("Error updating account details:", error);
    return { error: "Failed to update account details. Please try again." };
  }
};

export async function getDefaultAccountDetails(): Promise<AccountDetails> {
  return {
    accountNumber: "",
    currency: "USD",
    accountType: "Checking",
    status: "inactive",
    accountLimit: 0
  };
}
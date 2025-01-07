'use server'

import { db } from "@/lib/db"
import { auth } from "@/auth"

export type CardData = {
  cardNumber: string;
  cardHolder: string;
  expiryDate: string;
  cvv: string;
  cardLimit: number;
}

export type CardDataResult = CardData | { error: string };

export async function getCardData(userId?: string): Promise<CardDataResult> {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      return { error: "Not authenticated" };
    }

    // If userId is provided, check if the current user is an admin
    if (userId && session.user.role !== 'ADMIN') {
      return { error: "Unauthorized" };
    }

    // Use the provided userId for admin queries, otherwise use the session user's id
    const targetUserId = userId || session.user.id;

    const cardData = await db.cardData.findUnique({
      where: { userId: targetUserId },
    })

    if (!cardData) {
      // Return default data if no entry exists
      return getDefaultCardData();
    }

    return cardData as CardData
  } catch (error) {
    console.error("Error fetching card data:", error)
    return { error: "An unexpected error occurred" };
  }
}

export async function updateCardData(userId: string, cardData: CardData): Promise<{ success: boolean; error?: string }> {
  try {
    const session = await auth();
    
    if (session?.user?.role !== 'ADMIN') {
      return { success: false, error: "Unauthorized" };
    }

    if (!db) {
      console.error("Database connection is not initialized");
      return { success: false, error: "Database connection error" };
    }

    console.log("Available models on db:", Object.keys(db));

    if (!db.cardData) {
      console.error("CardData model is not available on the database instance");
      return { success: false, error: "Database model error: CardData not found" };
    }

    const result = await db.cardData.upsert({
      where: { userId },
      update: cardData,
      create: { ...cardData, userId },
    });

    console.log("Card data update result:", result);

    return { success: true };
  } catch (error) {
    console.error("Error updating card data:", error);
    if (error instanceof Error) {
      return { success: false, error: error.message };
    } else {
      return { success: false, error: "An unexpected error occurred" };
    }
  }
}

function getDefaultCardData(): CardData {
  return {
    cardNumber: "0000 0000 0000 0000",
    cardHolder: "Default User",
    expiryDate: "01/25",
    cvv: "000",
    cardLimit: 1000,
  }
}
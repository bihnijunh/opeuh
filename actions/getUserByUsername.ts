"use server";

import { db } from "@/lib/db";
import { auth } from "@/auth";

export const getUserByUsername = async (username: string) => {
  const session = await auth();
  
  if (!session?.user?.id) {
    return { error: "Not authenticated" };
  }

  try {
    const user = await db.user.findUnique({
      where: { username },
      select: { id: true, name: true },
    });

    if (!user) {
      return { error: "User not found" };
    }

    if (user.id === session.user.id) {
      return { error: "You cannot send money to yourself" };
    }

    return { user };
  } catch (error) {
    console.error("Error fetching user by username:", error);
    return { error: "Failed to fetch user. Please try again later." };
  }
};
"use server";

import { auth } from "@/auth";
import { getUserById } from "@/data/user";

export async function getUserBalances() {
  const session = await auth();
  
  if (!session?.user?.id) {
    return { error: "Not authenticated" };
  }

  try {
    const user = await getUserById(session.user.id);
    if (user) {
      return {
        success: true,
        balances: {
          btc: user.btc,
          usdt: user.usdt,
          eth: user.eth
        }
      };
    }
    return { error: "User not found" };
  } catch (error) {
    console.error("Error fetching user balances:", error);
    return { error: "Failed to fetch user balances" };
  }
}
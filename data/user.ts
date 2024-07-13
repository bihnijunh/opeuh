import { db } from "@/lib/db";
import { UserRole } from "@prisma/client";
import { User } from "next-auth";

interface UserWithBalance extends User {
  id: string;
  name: string | null;
  email: string | null;
  emailVerified: Date | null;
  image: string | null;
  password: string | null;
  role: UserRole;
  isTwoFactorEnabled: boolean;
  isOAuth: boolean;
  usdt: number;
  btc: number;
  eth: number;
}

export const updateUserBalance = async (id: string, balances: { btc: number, usdt: number, eth: number }) => {
  try {
    const updatedUser = await db.user.update({
      where: { id },
      data: balances,
    });
    return updatedUser;
  } catch (error) {
    console.error("Error updating user balance:", error);
    return null;
  }
};

export const getUserByEmail = async (email: string) => {
  try {
    const user = await db.user.findUnique({
      where: { email },
    });
    return user;
  } catch {
    return null;
  }
};

export const getUserById = async (id: string): Promise<UserWithBalance | null> => {
  try {
    const userWithBalance = await db.user.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        email: true,
        emailVerified: true,
        usdt: true,
        btc: true,
        eth: true,
      },
    });

    if (userWithBalance) {
      userWithBalance.usdt = Number(userWithBalance.usdt);
      userWithBalance.btc = Number(userWithBalance.btc);
      userWithBalance.eth = Number(userWithBalance.eth);
    }

    return userWithBalance as UserWithBalance;
  } catch (error) {
    console.error("Error fetching user with balance:", error);
    return null;
  }
};
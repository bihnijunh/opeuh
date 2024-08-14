import { db } from "@/lib/db";
import { ExtendedUser } from "@/next-auth";
import { UserRole } from "@prisma/client";
import { User } from "next-auth";

interface UserWithBalance extends User {
  isOAuth: boolean;
  id: string;
  name: string | null;
  email: string | null;
  emailVerified: Date | null;
  image: string | null;
  password: string | null;
  role: UserRole;
  isTwoFactorEnabled: boolean;
  
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

export const getUserById = async (id: string): Promise<ExtendedUser | null> => {
  try {
    const userWithBalance = await db.user.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        email: true,
        emailVerified: true,
        image: true,
        password: true,
        role: true,
        isTwoFactorEnabled: true,
        usdt: true,
        btc: true,
        eth: true,
        transactions: true, // Add this line
      },
    });

    if (userWithBalance) {
      const isOAuth = await db.account.findFirst({
        where: { userId: id }
      }) !== null;

      return {
        ...userWithBalance,
        usdt: Number(userWithBalance.usdt),
        btc: Number(userWithBalance.btc),
        eth: Number(userWithBalance.eth),
        isOAuth,
      } as ExtendedUser;
    }

    return null;
  } catch (error) {
    console.error("Error fetching user with balance:", error);
    return null;
  }
};
import { db } from "@/lib/db";
import { UserRole } from "@prisma/client";
import { User } from "next-auth";

interface UserWithBalance extends User {
  isOAuth: boolean;
  id: string;
  name: string | null;
  email: string | null;
  username: string | null;
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

export const getUserById = async (id: string): Promise<UserWithBalance | null> => {
  try {
    const userWithBalance = await db.user.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        email: true,
        username: true,
        emailVerified: true,
        image: true,
        password: true,
        role: true,
        isTwoFactorEnabled: true,
        usdt: true,
        btc: true,
        eth: true,
      },
    });

    if (userWithBalance) {
      return {
        ...userWithBalance,
        usdt: Number(userWithBalance.usdt),
        btc: Number(userWithBalance.btc),
        eth: Number(userWithBalance.eth),
        isOAuth: false, // Set this based on your logic
      } as UserWithBalance;
    }

    return null;
  } catch (error) {
    console.error("Error fetching user with balance:", error);
    return null;
  }
};
import { db } from "@/lib/db";
import { Balance, UserRole } from "@prisma/client";
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
  balance: Balance | null;
}





export const getUserByEmail = async (email: string) => {
  try {
    const user = await db.user.findUnique({
      where: { email },
      include: { balance: true },
    });

    return user;
  } catch {
    return null;
  }
};
export const getUserById = async (id: string): Promise<UserWithBalance | null> => {
  try {
    console.log("Fetching user with ID:", id); // Add this line
    const userWithBalance = await db.user.findUnique({
      where: { id },
      include: { balance: true },
    });
    console.log("Fetched user with balance:", userWithBalance); // Add this line
    return userWithBalance as UserWithBalance; // Add type assertion
  } catch (error) {
    console.error("Error fetching user with balance:", error);
    return null;
  }
};

import { Balance, UserRole } from "@prisma/client";
import NextAuth, { type DefaultSession } from "next-auth";
import { DefaultSession } from "next-auth";

export type ExtendedUser = DefaultSession["user"] & {
  role: UserRole;
  isTwoFactorEnabled: boolean;
  isOAuth: boolean;
  usdt: number;
  btc: number;
  eth: number;
  username: string;
  transactions?: Transaction[];
  userBankAccount?: UserBankAccount;
};
declare module "next-auth" {
  interface Session {
    user: ExtendedUser;
  }
}

export type UserWithBalance = DefaultSession["user"] & {
  id: string;
  name: string | null;
  email: string | null;
  username: string | null;
  emailVerified: Date | null;
  image: string | null;
  password: string | null;
  role: UserRole;
  isTwoFactorEnabled: boolean;
  isOAuth: boolean;
  usdt: number;
  btc: number;
  eth: number;
  transactions: Transaction[];
  userBankAccount?: UserBankAccount;

};

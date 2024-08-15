import { UserRole } from "@prisma/client";

export type Transaction = {
  id: number;
  date: Date;
  btc: boolean;
  usdt: boolean;
  eth: boolean;
  amount: number;
  walletAddress: string;
  transactionId: string;
  status: string;
  userId: string; // Added userId field to reference the user
};

export type UserWithTransactions = {
  id: string;
  name: string | null;
  email: string | null;
  role: UserRole;
  btc: number;
  usdt: number;
  eth: number;
  transactions: Transaction[];
};
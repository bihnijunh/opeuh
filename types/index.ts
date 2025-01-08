import { UserRole } from "@prisma/client";

export type UserWithBalance = {
  id: string;
  usdt: number;
  btc: number;
  eth: number;
  accountDetails?: {
    accountLimit: number;
  };
};

export type Transaction = {
  id: number;
  date: string;
  btc?: number;
  usdt?: number;
  eth?: number;
  amount: number;
  walletAddress: string;
  transactionId: string;
  status: string;
  userId: string;
  recipientId: string;
  senderAddress: string;
  senderUsername: string;
  cryptoType: 'btc' | 'usdt' | 'eth';
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
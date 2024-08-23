import { UserRole } from "@prisma/client";

export type Transaction = {
  id: number;
  date: Date;
  amount: number;
  cryptoType: string;
  walletAddress: string;
  transactionId: string;
  status: string;
  userId: string;
  recipientId: string | null;
  senderAddress?: string;
  senderUsername?: string;
  transactionHash?: string;
  btc?: boolean;
  usdt?: boolean;
  eth?: boolean;
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
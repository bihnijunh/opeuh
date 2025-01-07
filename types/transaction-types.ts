import { User } from "@prisma/client";

export interface Transaction {
  id: string;
  amount: number;
  status: string;
  type: string;
  createdAt: Date;
  updatedAt: Date;
  userId: string;
}

export interface UserWithTransactions extends User {
  transactions: Transaction[];
}

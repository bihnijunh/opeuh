import { UserRole } from "@prisma/client";

export type UserWithBalance = {
  id: string;
  accountDetails?: {
    accountLimit: number;
  };
};

export type UserWithTransactions = {
  id: string;
  name: string | null;
  email: string | null;
  role: UserRole;
};
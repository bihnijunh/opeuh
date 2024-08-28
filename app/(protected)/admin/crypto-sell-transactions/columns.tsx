import React from 'react';

export type CryptoSellTransaction = {
  id: string;
  userId: string;
  cryptoAmount: number;
  cryptoType: string;
  fiatAmount: number;
  fiatCurrency: string;
  status: string;
  createdAt: string;
  bankName: string;
  accountNumber: string;
  accountHolderName: string;
  username: string | null;
};

export const columns: Column<CryptoSellTransaction>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "userId",
    header: "User ID",
  },
  {
    accessorKey: "username",
    header: "Username",
  },
  {
    accessorKey: "cryptoAmount",
    header: "Crypto Amount",
  },
  {
    accessorKey: "cryptoType",
    header: "Crypto Type",
  },
  {
    accessorKey: "fiatAmount",
    header: "Fiat Amount",
  },
  {
    accessorKey: "fiatCurrency",
    header: "Fiat Currency",
  },
  {
    accessorKey: "status",
    header: "Status",
  },
  {
    accessorKey: "createdAt",
    header: "Created At",
  },
  {
    accessorKey: "bankName",
    header: "Bank Name",
  },
  {
    accessorKey: "accountNumber",
    header: "Account Number",
  },
  {
    accessorKey: "accountHolderName",
    header: "Account Holder Name",
  },
];

interface Column<T> {
  accessorKey: keyof T;
  header: string;
  cell?: (value: any) => React.ReactNode;
}
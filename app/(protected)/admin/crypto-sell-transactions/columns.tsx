import { ColumnDef } from "@tanstack/react-table";

export type CryptoSellTransaction = {
  id: string;
  userId: string;
  cryptoAmount: number;
  cryptoType: string;
  fiatAmount: number;
  fiatCurrency: string;
  status: string;
  createdAt: string;
};

export const columns: ColumnDef<CryptoSellTransaction>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "userId",
    header: "User ID",
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
    accessorKey: "status",
    header: "Status",
  },
  {
    accessorKey: "createdAt",
    header: "Created At",
  },
];
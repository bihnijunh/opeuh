"use client";

import { useState, useEffect } from 'react';
import { getAdminCryptoSellTransactions, updateCryptoSellTransactionStatus } from "@/actions/cryptoSellTransaction";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";

interface CryptoSellTransaction {
  id: string;
  userId: string;
  cryptoAmount: number;
  cryptoType: string;
  status: string;
  createdAt: string;
  bankName: string;
  accountNumber: string;
  accountHolderName: string;
  username: string | null;
}

const columns: Array<{key: keyof CryptoSellTransaction; header: string}> = [
  { key: "id", header: "ID" },
  { key: "userId", header: "User ID" },
  { key: "username", header: "Username" },
  { key: "cryptoAmount", header: "Crypto Amount" },
  { key: "cryptoType", header: "Crypto Type" },
  { key: "status", header: "Status" },
  { key: "createdAt", header: "Created At" },
  { key: "bankName", header: "Bank Name" },
  { key: "accountNumber", header: "Account Number" },
  { key: "accountHolderName", header: "Account Holder Name" },
];

export function CryptoSellTransactionsTable() {
  const [transactions, setTransactions] = useState<CryptoSellTransaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchTransactions() {
      try {
        const result = await getAdminCryptoSellTransactions();
        if (result.error) {
          setError(result.error);
        } else {
          setTransactions(result.transactions || []);
        }
      } catch (err) {
        setError('Failed to fetch transactions');
      } finally {
        setIsLoading(false);
      }
    }

    fetchTransactions();
  }, []);

  const handleStatusChange = async (transactionId: string, newStatus: string) => {
    try {
      const result = await updateCryptoSellTransactionStatus(transactionId, newStatus);
      if (result.success) {
        setTransactions(prevTransactions =>
          prevTransactions.map(transaction =>
            transaction.id === transactionId ? { ...transaction, status: newStatus } : transaction
          )
        );
        toast.success(`Transaction status updated to ${newStatus}`);
      } else {
        toast.error(result.error || 'Failed to update status');
      }
    } catch (err) {
      toast.error('Failed to update status');
    }
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <Table>
      <TableHeader>
        <TableRow>
          {columns.map((column) => (
            <TableHead key={column.key}>{column.header}</TableHead>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody>
        {transactions.map((transaction) => (
          <TableRow key={transaction.id}>
            {columns.map((column) => (
              <TableCell key={column.key}>
                {column.key === 'createdAt' 
                  ? new Date(transaction[column.key]).toLocaleString()
                  : column.key === 'status' 
                  ? (
                    <Select
                      onValueChange={(value) => handleStatusChange(transaction.id, value)}
                      defaultValue={transaction.status}
                    >
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder={transaction.status} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="successful">Successful</SelectItem>
                        <SelectItem value="failed">Failed</SelectItem>
                      </SelectContent>
                    </Select>
                  )
                  : transaction[column.key]}
              </TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
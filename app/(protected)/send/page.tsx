"use client";
import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FiCopy } from "react-icons/fi";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useSession } from "next-auth/react";
import { useCurrentUser } from "@/hooks/use-current-user";
import { createTransaction } from "@/actions/transactions";
import { getUserTransactions } from "@/actions/getTransactions";
import { getUserBalances } from "@/actions/getBalances";
import useLocalStorage from "@/hooks/use-local-storage";
import { Skeleton } from "@/components/ui/skeleton";

interface Transaction {
  id: number;
  date: Date;
  btc: boolean;
  usdt: boolean;
  eth: boolean;
  amount: number;
  walletAddress: string;
  userId: string;
  transactionId: string;
}

function Send() {
  const [amount, setAmount] = useState<string>("");
  const [walletAddress, setWalletAddress] = useState<string>("");
  const [cryptoType, setCryptoType] = useState<string>("btc");
  const [isLoading, setIsLoading] = useState(true);
  const [transactions, setTransactions] = useLocalStorage<Transaction[]>(
    "userTransactions",
    []
  );
  const [balances, setBalances] = useState({ btc: 0, usdt: 0, eth: 0 });
  const { data: session, status } = useSession();
  const user = useCurrentUser();

  const fetchBalances = async () => {
    const result = await getUserBalances();
    if (result.success) {
      setBalances(result.balances);
    } else {
      toast.error(result.error || "Failed to fetch balances");
    }
  };

  const fetchTransactions = async () => {
    const transactionResult = await getUserTransactions();
    if (transactionResult.success) {
      setTransactions(transactionResult.transactions);
    } else {
      toast.error(transactionResult.error || "Failed to fetch transactions");
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      if (status === "authenticated" && session?.user?.id) {
        setIsLoading(true);
        await Promise.all([fetchBalances(), fetchTransactions()]);
        setIsLoading(false);
      }
    };
    fetchData();
  }, [status, session]);

  const handleSend = async () => {
    if (!session?.user?.id || !user) {
      toast.error("User not authenticated");
      return;
    }

    if (amount && walletAddress) {
      const amountNumber = Number(amount);
      if (isNaN(amountNumber) || amountNumber <= 0) {
        toast.error("Please enter a valid amount");
        return;
      }

      if (
        (cryptoType === "btc" && amountNumber > balances.btc) ||
        (cryptoType === "usdt" && amountNumber > balances.usdt) ||
        (cryptoType === "eth" && amountNumber > balances.eth)
      ) {
        toast.error("Amount exceeds available balance");
        return;
      }

      const result = await createTransaction({
        amount: amountNumber,
        walletAddress,
        cryptoType: cryptoType as "btc" | "usdt" | "eth",
      });
      if (result.error) {
        toast.error(result.error);
      } else if (result.success) {
        toast.success(result.success);
        const newTransaction = result.transaction;
        setTransactions([newTransaction, ...transactions]);
        setAmount("");
        setWalletAddress("");
        await fetchBalances();
      }
    }
  };

  const handleCopyToClipboard = (address: string) => {
    navigator.clipboard.writeText(address).then(
      () => {
        toast.success("Wallet address copied!", {
          position: "top-right",
          autoClose: 2000,
          hideProgressBar: true,
          closeOnClick: true,
        });
      },
      () => {
        toast.error("Failed to copy wallet address");
      }
    );
  };

  if (isLoading) {
    return <div className="flex min-h-[100dvh] flex-col items-center justify-center bg-background">
    <div className="space-y-4 text-center">
      <Skeleton className="h-12 w-12 rounded-full" />
      <div className="space-y-2">
        <Skeleton className="h-4 w-[200px]" />
        <Skeleton className="h-4 w-[150px]" />
      </div>
    </div>
  </div>;
  }

  return (
    <div className="bg-gray-100 min-h-screen py-8">
      <div className="max-w-4xl mx-auto px-4">
        <h2 className="text-2xl font-bold mb-4">Send Crypto</h2>
        <div className="bg-white p-6 rounded-md shadow-md mb-4">
          <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
            <select
              id="cryptoType"
              name="cryptoType"
              value={cryptoType}
              onChange={(e) => setCryptoType(e.target.value)}
              className="border p-2 md:flex-grow"
            >
              <option value="btc">BTC - {balances.btc} $</option>
              <option value="usdt">USDT - {balances.usdt} $</option>
              <option value="eth">ETH - {balances.eth} $</option>
            </select>
            <input
              id="amount"
              name="amount"
              type="number"
              placeholder="Amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="border p-2 md:flex-grow"
            />
            <input
              id="walletAddress"
              name="walletAddress"
              type="text"
              placeholder="Wallet Address"
              value={walletAddress}
              onChange={(e) => setWalletAddress(e.target.value)}
              className="border p-2 md:flex-grow"
            />
            <button
              onClick={handleSend}
              className="bg-blue-500 text-white px-4 py-2 rounded"
            >
              Send
            </button>
          </div>
        </div>
        <div className="mt-8">
          <Card>
            <CardHeader>
              <CardTitle>Transaction History</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Transaction ID</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Wallet Address</TableHead>
                    <TableHead>Trx Time</TableHead>
                    <TableHead>Crypto Type</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {transactions.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center">
                        No transactions found
                      </TableCell>
                    </TableRow>
                  ) : (
                    transactions.map((transaction) => (
                      <TableRow key={transaction.id}>
                        <TableCell>{transaction.transactionId}</TableCell>
                        <TableCell>{transaction.amount}</TableCell>
                        <TableCell>
                          <div className="flex items-center">
                            <div className="truncate w-28 sm:w-40">
                              {transaction.walletAddress}
                            </div>
                            <button
                              className="ml-2 text-blue-500 hover:underline focus:outline-none"
                              onClick={() =>
                                handleCopyToClipboard(transaction.walletAddress)
                              }
                            >
                              <FiCopy className="h-5 w-5" />
                            </button>
                          </div>
                        </TableCell>
                        <TableCell>
                          {new Date(transaction.date).toLocaleString()}
                        </TableCell>
                        <TableCell>
                          {transaction.btc
                            ? "BTC"
                            : transaction.usdt
                            ? "USDT"
                            : "ETH"}
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default Send;
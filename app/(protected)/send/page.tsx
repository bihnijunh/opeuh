"use client";
import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FiCopy } from "react-icons/fi";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuCheckboxItem,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ListFilter, File } from "lucide-react";
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
import { Badge } from "@/components/ui/badge";

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
  status: "pending" | "approved" | "successful" | string;}

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
    try {
      const result = await getUserTransactions();
      if (result.success) {
        setTransactions(result.transactions);
      } else {
        toast.error(result.error || "Failed to fetch transactions");
      }
    } catch (error) {
      console.error("Error fetching transactions:", error);
      toast.error("Failed to fetch transactions");
    }
  };

 useEffect(() => {
  const fetchData = async () => {
    if (status === "authenticated" && session?.user?.id) {
      setIsLoading(true);
      try {
        await fetchBalances();
        await fetchTransactions();
      } catch (error) {
        console.error("Error fetching data:", error);
        toast.error("Failed to fetch data");
      } finally {
        setIsLoading(false);
      }
    }
  };
  fetchData();
}, [status, session?.user?.id]);



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
        const newTransaction: Transaction = {
          ...result.transaction,
          status: "pending", // Set a default status for new transactions
        };
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
    return (
      <div className="flex min-h-[100dvh] flex-col items-center justify-center bg-background">
        <div className="space-y-4 text-center">
          <Skeleton className="h-12 w-12 rounded-full" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-[200px]" />
            <Skeleton className="h-4 w-[150px]" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 p-8">
      <Tabs defaultValue="week">
        <div className="flex items-center">
          <TabsList>
            <TabsTrigger value="week">Week</TabsTrigger>
            <TabsTrigger value="month">Month</TabsTrigger>
            <TabsTrigger value="year">Year</TabsTrigger>
          </TabsList>
          <div className="ml-auto flex items-center gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-7 gap-1 text-sm"
                >
                  <ListFilter className="h-3.5 w-3.5" />
                  <span className="sr-only sm:not-sr-only">Filter</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Filter by</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuCheckboxItem checked>
                  Fulfilled
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem>Declined</DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem>Refunded</DropdownMenuCheckboxItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <Button size="sm" variant="outline" className="h-7 gap-1 text-sm">
              <File className="h-3.5 w-3.5" />
              <span className="sr-only sm:not-sr-only">Export</span>
            </Button>
          </div>
        </div>
        <TabsContent value="week">
          <Card>
            <CardHeader>
              <CardTitle>Send Crypto</CardTitle>
              <CardDescription>
                Send cryptocurrency to another wallet.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex space-x-4">
                  <Select
                    value={cryptoType}
                    onValueChange={(value) => setCryptoType(value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select cryptocurrency" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="btc">
                        BTC - {balances.btc} $
                      </SelectItem>
                      <SelectItem value="usdt">
                        USDT - {balances.usdt} $
                      </SelectItem>
                      <SelectItem value="eth">
                        ETH - {balances.eth} $
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <Input
                    type="number"
                    placeholder="Amount"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                  />
                  <Input
                    type="text"
                    placeholder="Wallet Address"
                    value={walletAddress}
                    onChange={(e) => setWalletAddress(e.target.value)}
                  />
                  <Button onClick={handleSend}>Send</Button>
                </div>
              </div>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Transaction ID</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Wallet Address</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Crypto Type</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {transactions.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center">
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
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() =>
                                handleCopyToClipboard(transaction.walletAddress)
                              }
                            >
                              <FiCopy className="h-4 w-4" />
                            </Button>
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
                        <TableCell>
                          <Badge
                            variant={
                              transaction.status === "pending"
                                ? "warning"
                                : transaction.status === "approved"
                                ? "secondary"
                                : "success"
                            }
                          >
                            {transaction.status === "pending"
                              ? "Pending"
                              : transaction.status === "approved"
                              ? "Approved"
                              : "Successful"}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default Send;

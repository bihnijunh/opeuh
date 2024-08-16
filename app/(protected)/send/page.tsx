"use client";
import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FiCopy, FiSend, FiDollarSign, FiClock } from "react-icons/fi";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import { Badge } from "@/components/ui/badge";
import { useLoading } from '@/components/contexts/LoadingContext';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { ChevronDownIcon } from "lucide-react";

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
  status: "pending" | "approved" | "successful" | string;
}

function Send() {
  const [amount, setAmount] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [cryptoType, setCryptoType] = useState<string>("btc");
  const { isLoading, setIsLoading } = useLoading();
  const [transactions, setTransactions] = useLocalStorage<Transaction[]>("userTransactions", []);
  const [walletAddress, setWalletAddress] = useState("");
  const [balances, setBalances] = useState({ btc: 0, usdt: 0, eth: 0 });
  const { data: session, status } = useSession();
  const user = useCurrentUser();
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const fetchBalances = async () => {
    const result = await getUserBalances();
    if (result.success) {
      setBalances(result.balances);
    } else {
      toast.error(result.error || "Failed to fetch balances");
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      handlePageChange(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      handlePageChange(currentPage + 1);
    }
  };

  const handleItemsPerPageChange = (value: string) => {
    const newItemsPerPage = parseInt(value, 10);
    setItemsPerPage(newItemsPerPage);
    setCurrentPage(1);
    fetchTransactions(1);
  };

  const fetchTransactions = async (page = currentPage) => {
    try {
      const result = await getUserTransactions(page, itemsPerPage);
      if (result.success) {
        setTransactions(result.transactions);
        setTotalPages(result.totalPages);
        setCurrentPage(result.currentPage);
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
  }, [status, session?.user?.id, setIsLoading]);

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
    fetchTransactions(newPage);
  };

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
          status: "pending",
        };
        setTransactions([newTransaction, ...transactions]);
        setAmount("");
        setWalletAddress("");
        await fetchBalances();
      }
    }
  };

  const handleCopyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text).then(
      () => {
        toast.success(`${label} copied!`, {
          position: "bottom-center",
          autoClose: 2000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          className: "custom-toast",
          bodyClassName: "custom-toast-body",
          icon: "🔗",
        });
      },
      () => {
        toast.error(`Failed to copy ${label}`, {
          position: "bottom-center",
          autoClose: 2000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          className: "custom-toast",
          bodyClassName: "custom-toast-body",
          icon: "❌",
        });
      }
    );
  };

  if (isLoading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-gray-100 dark:bg-gray-900">
        <div className="space-y-4 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          <div className="text-blue-500">Send using piedra fast pay</div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-4 sm:p-8 max-w-7xl mx-auto">
      <Card className="bg-gradient-to-br from-blue-500 to-purple-600 text-white">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Cryptocurrency Overview</CardTitle>
          <CardDescription className="text-blue-100">Current balances</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {Object.entries(balances).map(([crypto, balance]) => (
              <div key={crypto} className="bg-white/10 rounded-lg p-4 backdrop-blur-sm">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-lg font-semibold uppercase">{crypto}</span>
                  <FiDollarSign className="text-2xl opacity-70" />
                </div>
                <div className="text-3xl font-bold">{balance.toFixed(2)}</div>
                <div className="text-sm opacity-70">USD</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="bg-white shadow-lg rounded-lg overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-6">
          <CardTitle className="text-2xl font-bold">Send Cryptocurrency</CardTitle>
          <CardDescription className="text-blue-100">Transfer funds to another wallet</CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <form onSubmit={(e) => { e.preventDefault(); handleSend(); }} className="space-y-6">
            <div className="space-y-2">
              <label htmlFor="crypto-type" className="block text-sm font-medium text-gray-700">Select Cryptocurrency</label>
              <div className="relative">
                <Select value={cryptoType} onValueChange={(value) => setCryptoType(value)}>
                  <SelectTrigger id="crypto-type" className="w-full bg-white border border-gray-300 rounded-md py-2 pl-3 pr-10 text-left cursor-default focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm">
                    <SelectValue placeholder="Select cryptocurrency" />
                    <span className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                      <ChevronDownIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                    </span>
                  </SelectTrigger>
                  <SelectContent className="absolute z-10 mt-1 w-full bg-white shadow-lg max-h-60 rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm">
                    <SelectItem value="btc" className="cursor-default select-none relative py-2 pl-3 pr-9 hover:bg-blue-100">
                      BTC - {Math.trunc(balances.btc)} USD
                    </SelectItem>
                    <SelectItem value="usdt" className="cursor-default select-none relative py-2 pl-3 pr-9 hover:bg-blue-100">
                      USDT - {Math.trunc(balances.usdt)} USDT
                    </SelectItem>
                    <SelectItem value="eth" className="cursor-default select-none relative py-2 pl-3 pr-9 hover:bg-blue-100">
                      ETH - {Math.trunc(balances.eth)} USD
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <label htmlFor="amount" className="block text-sm font-medium text-gray-700">Amount</label>
              <Input
                id="amount"
                type="number"
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="wallet-address" className="block text-sm font-medium text-gray-700">Wallet Address</label>
              <Input
                id="wallet-address"
                type="text"
                placeholder="Enter recipient's wallet address"
                value={walletAddress}
                onChange={(e) => setWalletAddress(e.target.value)}
                className="w-full"
              />
            </div>
            <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white">
              <FiSend className="mr-2" /> Send {cryptoType.toUpperCase()}
            </Button>
          </form>
        </CardContent>
      </Card>

      <Accordion type="single" collapsible>
        <AccordionItem value="item-1">
          <AccordionTrigger>
            <div className="flex items-center">
              <FiClock className="mr-2" />
              Transaction History
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[100px]">ID</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead className="min-w-[200px]">Wallet Address</TableHead>
                    <TableHead className="min-w-[150px]">Date</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {transactions.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center">No transactions found</TableCell>
                    </TableRow>
                  ) : (
                    transactions.map((transaction) => (
                      <TableRow key={transaction.id}>
                        <TableCell className="font-medium cursor-pointer hover:text-blue-500" onClick={() => handleCopyToClipboard(transaction.transactionId, "Transaction ID")}>
                          {transaction.transactionId.slice(0, 8)}...
                        </TableCell>
                        <TableCell>{transaction.amount}$</TableCell>
                        <TableCell>
                          <div className="flex items-center">
                            <div className="truncate max-w-[150px]">{transaction.walletAddress}</div>
                            <Button variant="ghost" size="sm" onClick={() => handleCopyToClipboard(transaction.walletAddress, "Wallet address")}>
                              <FiCopy className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                        <TableCell>{new Date(transaction.date).toLocaleString()}</TableCell>
                        <TableCell>{transaction.btc ? "BTC" : transaction.usdt ? "USDT" : "ETH"}</TableCell>
                        <TableCell>
                          <Badge variant={transaction.status === "pending" ? "warning" : transaction.status === "approved" ? "secondary" : "success"}>
                            {transaction.status}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
            <div className="flex flex-col sm:flex-row justify-between items-center mt-4 space-y-4 sm:space-y-0">
              <Select
                value={itemsPerPage.toString()}
                onValueChange={handleItemsPerPageChange}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Items per page" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="5">5 per page</SelectItem>
                  <SelectItem value="10">10 per page</SelectItem>
                  <SelectItem value="20">20 per page</SelectItem>
                </SelectContent>
              </Select>
              <div className="flex items-center space-x-2">
                <Button onClick={handlePreviousPage} disabled={currentPage === 1}>
                  Previous
                </Button>
                <span className="flex items-center">
                  Page {currentPage} of {totalPages}
                </span>
                <Button
                  onClick={handleNextPage}
                  disabled={currentPage === totalPages}
                >
                  Next
                </Button>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}

export default Send;
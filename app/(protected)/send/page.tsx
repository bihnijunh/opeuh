"use client";
import React, { useState, useEffect } from "react";
import { toast } from "sonner";
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
import { motion, AnimatePresence } from "framer-motion";
import { Toaster } from "@/components/ui/sonner";

import { getUserByUsername } from "@/actions/getUserByUsername";
import { ConfirmTransactionModal } from "@/app/(protected)/_components/ConfirmTransactionModal";
import { createTransactionByUsername } from "@/actions/user-trf";

interface Transaction {
  id?: number;
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

const cryptoIcons = {
  btc: "https://cryptologos.cc/logos/bitcoin-btc-logo.png?v=032",
  usdt: "https://cryptologos.cc/logos/tether-usdt-logo.png?v=032",
  eth: "https://cryptologos.cc/logos/ethereum-eth-logo.png?v=032"
};

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
  const [sendType, setSendType] = useState<'wallet' | 'username'>('wallet');
  const [username, setUsername] = useState("");
  const [recipientName, setRecipientName] = useState("");
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);

  const fetchBalances = async () => {
    const result = await getUserBalances();
    if (result.success) {
      setBalances(result.balances);
    } else {
      toast.error("Failed to fetch balances. Please try again later.");
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
        toast.error("Failed to fetch transactions. Please try again later.");
      }
    } catch (error) {
      console.error("Error fetching transactions:", error);
      toast.error("Failed to fetch transactions. Please try again later.");
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
          toast.error("Failed to fetch data. Please try again later.");
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
      toast.error("User not authenticated. Please log in to continue.");
      return;
    }

    if (!amount || !cryptoType || (sendType === 'wallet' && !walletAddress) || (sendType === 'username' && !username)) {
      toast.error("Please fill in all required fields.");
      return;
    }

    const amountNumber = Number(amount);
    if (isNaN(amountNumber) || amountNumber <= 0) {
      toast.error("Please enter a valid amount. Amount must be a positive number.");
      return;
    }

    if (
      (cryptoType === "btc" && amountNumber > balances.btc) ||
      (cryptoType === "usdt" && amountNumber > balances.usdt) ||
      (cryptoType === "eth" && amountNumber > balances.eth)
    ) {
      toast.error("Amount exceeds available balance. Please enter a lower amount.");
      return;
    }

    if (sendType === 'wallet') {
      const result = await createTransaction({
        amount: amountNumber,
        walletAddress,
        cryptoType: cryptoType as "btc" | "usdt" | "eth",
      });

      if (result.error) {
        toast.error(`${result.error}. Please try again later.`);
      } else if (result.success) {
        toast.success(`${result.success}. Check mail for confirmation.`);
        const newTransaction: Transaction = {
          ...result.transaction,
          status: "pending",
          id: result.transaction.id || undefined,
        };
        setTransactions([newTransaction, ...transactions]);
        setAmount("");
        setWalletAddress("");
        await fetchBalances();
      }
    } else {
      // Fetch recipient's name before creating the transaction
      const recipientResult = await getUserByUsername(username);
      if (recipientResult.error) {
        toast.error(recipientResult.error);
        return;
      }
      if (recipientResult.user) {
        setRecipientName(recipientResult.user.name || "Unknown");
        setIsConfirmModalOpen(true);
      } else {
        toast.error("User not on Piedra Exchange");
        return;
      }
    }
  };

  const handleSendTransaction = async () => {
    const result = await createTransactionByUsername({
      amount: Number(amount),
      username,
      cryptoType: cryptoType as "btc" | "usdt" | "eth",
    });

    if (result.error) {
      toast.error(`${result.error}. Please try again later.`);
    } else if (result.success) {
      toast.success(`${result.success}`);
      const newTransaction: Transaction = {
        ...result.transaction,
        status: "successful",
        id: result.transaction.id || undefined,
      };
      setTransactions([newTransaction, ...transactions]);
      setAmount("");
      setSendType('wallet');
      setWalletAddress("");
      setUsername("");
      setRecipientName("");
      await fetchBalances();
    }
    setIsConfirmModalOpen(false);
  };

  const handleCopyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text).then(
      () => {
        toast.success(`${label} copied to clipboard.`);
      },
      () => {
        toast.error(`Failed to copy ${label}. Please try again.`);
      }
    );
  };

  if (isLoading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-gray-100 dark:bg-gray-900">
        <div className="space-y-4 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 dark:border-blue-400"></div>
          <div className="text-blue-500 dark:text-blue-400">Send using piedra fast pay</div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-4 sm:p-8 max-w-7xl mx-auto">
      <Card className="bg-gradient-to-br from-blue-500 to-purple-600 text-white dark:from-blue-700 dark:to-purple-800">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Cryptocurrency Overview</CardTitle>
          <CardDescription className="text-blue-100 dark:text-blue-200">Current balances</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {Object.entries(balances).map(([crypto, balance]) => (
              <div key={crypto} className="bg-white/10 dark:bg-gray-800/30 rounded-lg p-4 backdrop-blur-sm">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-lg font-semibold uppercase">{crypto}</span>
                  <img src={cryptoIcons[crypto as keyof typeof cryptoIcons]} alt={`${crypto} icon`} className="w-6 h-6 opacity-70" />
                </div>
                <div className="text-3xl font-bold">{balance.toFixed(2)}</div>
                <div className="text-sm opacity-70">USD</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="bg-white dark:bg-gray-800 shadow-lg rounded-lg overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-blue-500 to-purple-600 dark:from-blue-700 dark:to-purple-800 text-white p-6">
          <CardTitle className="text-2xl font-bold">Send Cryptocurrency</CardTitle>
          <CardDescription className="text-blue-100 dark:text-blue-200">Transfer funds to another wallet</CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <motion.form
            onSubmit={(e) => { e.preventDefault(); handleSend(); }}
            className="space-y-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <motion.div className="space-y-2" whileHover={{ scale: 1.02 }}>
              <label htmlFor="crypto-type" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Select Cryptocurrency</label>
              <div className="relative">
                <Select
                  value={cryptoType}
                  onValueChange={(value) => setCryptoType(value)}
                >
                  <SelectTrigger className="w-full no-icon">
                    <SelectValue placeholder="Select cryptocurrency" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="btc">BTC - {Math.trunc(balances.btc)} $USD</SelectItem>
                    <SelectItem value="usdt">USDT - {Math.trunc(balances.usdt)} $USD</SelectItem>
                    <SelectItem value="eth">ETH - {Math.trunc(balances.eth)} $USD</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </motion.div>
            <motion.div className="space-y-2" whileHover={{ scale: 1.02 }}>
              <label htmlFor="amount" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Amount</label>
              <Input
                id="amount"
                type="number"
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full no-spinner bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              />
            </motion.div>
            <div className="space-y-4">
              <div className="flex space-x-4">
                <Button
                  onClick={() => setSendType('wallet')}
                  variant={sendType === 'wallet' ? 'default' : 'outline'}
                >
                  Wallet Address
                </Button>
                <Button
                  onClick={() => setSendType('username')}
                  variant={sendType === 'username' ? 'default' : 'outline'}
                >
                  Username
                </Button>
              </div>
              
              {sendType === 'wallet' ? (
                <Input
                  type="text"
                  placeholder="Wallet Address"
                  value={walletAddress}
                  onChange={(e) => setWalletAddress(e.target.value)}
                />
              ) : (
                <Input
                  type="text"
                  placeholder="Username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              )}
              
              {/* ... rest of your inputs ... */}
            </div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white dark:bg-blue-700 dark:hover:bg-blue-800">
                <FiSend className="mr-2" /> Send {cryptoType.toUpperCase()}
              </Button>
            </motion.div>
          </motion.form>
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
                  <TableRow className="bg-gray-100 dark:bg-gray-800">
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
                      <TableCell colSpan={6} className="text-center text-gray-500 dark:text-gray-400">No transactions found</TableCell>
                    </TableRow>
                  ) : (
                    transactions.map((transaction) => (
                      <TableRow key={transaction.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
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

      <ConfirmTransactionModal
        isOpen={isConfirmModalOpen}
        onClose={() => setIsConfirmModalOpen(false)}
        onConfirm={() => {
          setIsConfirmModalOpen(false);
          handleSendTransaction();
        }}
        amount={amount}
        cryptoType={cryptoType}
        recipientName={recipientName}
        username={username}
      />
    </div>
  );
}

export default Send;
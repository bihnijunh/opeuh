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
  status: "pending" | "approved" | "successful" | string;
}

function Send() {
  const [amount, setAmount] = useState<string>("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
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
  }, [status, session?.user?.id]);

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

  const handleCopyToClipboard = (address: string) => {
    navigator.clipboard.writeText(address).then(
      () => {
        toast.success("Wallet address copied!", {
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
        toast.error("Failed to copy wallet address", {
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
    <div className="space-y-4 p-4 sm:p-8">
      <Tabs defaultValue="week" className="w-full">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4">
         
          <div className="flex items-center gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-8 px-2 lg:px-3"
                >
                  <ListFilter className="h-4 w-4 lg:mr-2" />
                  <span className="hidden lg:inline">Filter</span>
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
            <Button variant="outline" size="sm" className="h-8 px-2 lg:px-3">
              <File className="h-4 w-4 lg:mr-2" />
              <span className="hidden lg:inline">Export</span>
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
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
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
                  <Button onClick={handleSend} className="w-full">Send</Button>
                </div>
              </div>
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
                        <TableCell colSpan={6} className="text-center">
                          No transactions found
                        </TableCell>
                      </TableRow>
                    ) : (
                      transactions.map((transaction) => (
                        <TableRow key={transaction.id}>
                          <TableCell className="font-medium">{transaction.transactionId.slice(0, 8)}...</TableCell>
                          <TableCell>{transaction.amount}</TableCell>
                          <TableCell>
                            <div className="flex items-center">
                              <div className="truncate max-w-[150px]">
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
              </div>
            </CardContent>
          </Card>
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
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default Send;
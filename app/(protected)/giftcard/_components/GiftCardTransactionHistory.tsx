"use client"
import React, { useState, useEffect } from "react";
import { toast } from "sonner";
import { FiCopy, FiClock } from "react-icons/fi";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useLoading } from '@/components/contexts/LoadingContext';
import { getGiftCardTransactionHistory } from "@/actions/giftCardWithdrawal";

interface GiftCardTransaction {
  id: string;
  amount: number;
  giftCardName: string;
  cryptoType: string;
  createdAt: Date;
  status: string;
}

export function GiftCardTransactionHistory() {
  const [transactions, setTransactions] = useState<GiftCardTransaction[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const { isLoading, setIsLoading } = useLoading();

  const fetchTransactions = async () => {
    setIsLoading(true);
    try {
      const result = await getGiftCardTransactionHistory();
      if ('error' in result) {
        toast.error(result.error);
      } else {
        const formattedTransactions = result.transactions.map(transaction => ({
          ...transaction,
          createdAt: new Date(transaction.createdAt)
        }));
        setTransactions(formattedTransactions);
        setTotalPages(Math.ceil(formattedTransactions.length / itemsPerPage));
      }
    } catch (error) {
      console.error("Error fetching gift card transactions:", error);
      toast.error("Failed to fetch gift card transactions. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  const handleItemsPerPageChange = (value: string) => {
    const newItemsPerPage = parseInt(value, 10);
    setItemsPerPage(newItemsPerPage);
    setCurrentPage(1);
    setTotalPages(Math.ceil(transactions.length / newItemsPerPage));
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

  const getPaginatedTransactions = () => {
    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    return transactions.slice(start, end);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-40">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle>Gift Card Transaction History</CardTitle>
        <CardDescription>View your past gift card withdrawals</CardDescription>
      </CardHeader>
      <CardContent>
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
                      <TableHead>Gift Card</TableHead>
                      <TableHead>Crypto</TableHead>
                      <TableHead className="min-w-[150px]">Date</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {getPaginatedTransactions().length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center text-gray-500 dark:text-gray-400">No transactions found</TableCell>
                      </TableRow>
                    ) : (
                      getPaginatedTransactions().map((transaction) => (
                        <TableRow key={transaction.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                          <TableCell className="font-medium cursor-pointer hover:text-blue-500" onClick={() => handleCopyToClipboard(transaction.id, "Transaction ID")}>
                            {transaction.id.slice(0, 8)}...
                          </TableCell>
                          <TableCell>${transaction.amount.toFixed(2)}</TableCell>
                          <TableCell>{transaction.giftCardName}</TableCell>
                          <TableCell>{transaction.cryptoType.toUpperCase()}</TableCell>
                          <TableCell>{transaction.createdAt.toLocaleString()}</TableCell>
                          <TableCell>
                            <Badge variant={transaction.status === "pending" ? "warning" : transaction.status === "successful" ? "success" : "secondary"}>
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
                  <Button onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} disabled={currentPage === 1}>
                    Previous
                  </Button>
                  <span className="flex items-center">
                    Page {currentPage} of {totalPages}
                  </span>
                  <Button
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                  >
                    Next
                  </Button>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </CardContent>
    </Card>
  );
}
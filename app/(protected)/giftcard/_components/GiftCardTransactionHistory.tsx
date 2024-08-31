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

interface GiftCardTransaction {
  id: string;
  amount: number;
  cardType: string;
  date: Date;
  status: "pending" | "approved" | "successful" | string;
}

// This function should be implemented in your actions folder
async function getGiftCardTransactions(page: number, itemsPerPage: number) {
  // Implement the API call to fetch gift card transactions
  // Return an object with transactions, totalPages, and currentPage
  return {
    transactions: [],
    totalPages: 1,
    currentPage: 1,
  };
}

export function GiftCardTransactionHistory() {
  const [transactions, setTransactions] = useState<GiftCardTransaction[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const { isLoading, setIsLoading } = useLoading();

  const fetchTransactions = async (page = currentPage) => {
    setIsLoading(true);
    try {
      const result = await getGiftCardTransactions(page, itemsPerPage);
      setTransactions(result.transactions);
      setTotalPages(result.totalPages);
      setCurrentPage(result.currentPage);
    } catch (error) {
      console.error("Error fetching gift card transactions:", error);
      toast.error("Failed to fetch gift card transactions. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, [itemsPerPage]);

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      fetchTransactions(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      fetchTransactions(currentPage + 1);
    }
  };

  const handleItemsPerPageChange = (value: string) => {
    const newItemsPerPage = parseInt(value, 10);
    setItemsPerPage(newItemsPerPage);
    fetchTransactions(1);
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
      <div className="flex items-center justify-center h-40">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle>Gift Card Transaction History</CardTitle>
        <CardDescription>View your past gift card purchases</CardDescription>
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
                      <TableHead>Card Type</TableHead>
                      <TableHead className="min-w-[150px]">Date</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {transactions.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center text-gray-500 dark:text-gray-400">No transactions found</TableCell>
                      </TableRow>
                    ) : (
                      transactions.map((transaction) => (
                        <TableRow key={transaction.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                          <TableCell className="font-medium cursor-pointer hover:text-blue-500" onClick={() => handleCopyToClipboard(transaction.id, "Transaction ID")}>
                            {transaction.id.slice(0, 8)}...
                          </TableCell>
                          <TableCell>${transaction.amount.toFixed(2)}</TableCell>
                          <TableCell>{transaction.cardType}</TableCell>
                          <TableCell>{new Date(transaction.date).toLocaleString()}</TableCell>
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
      </CardContent>
    </Card>
  );
}
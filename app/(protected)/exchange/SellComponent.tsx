import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { toast } from "sonner";
import { FiClock, FiCopy } from "react-icons/fi";
import { AccountSelectionComponent } from '@/components/AccountSelectionComponent';
import { createCryptoSellTransaction, getUserCryptoSellTransactions } from '@/actions/cryptoSellTransaction';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export interface CurrencyInfo {
  code: string;
  name: string;
}

type CryptoCurrency = "ETH" | "USDT" | "BTC";

interface SellComponentProps {
  SUPPORTED_CURRENCIES: CurrencyInfo[];
}

interface Transaction {
  id: string;
  userId: string;
  bankAccountId: string;
  currency: string;
  amount: number;
  status: string;
  createdAt: Date;
  updatedAt: Date;
  user: {
    username: string | null;
  };
  userBankAccount: {
    bankName: string;
    accountNumber: string;
    accountHolderName: string;
  };
}

export const SellComponent: React.FC<SellComponentProps> = ({ SUPPORTED_CURRENCIES }) => {
  const { data: session, status } = useSession();
  const [selectedAccountId, setSelectedAccountId] = useState<string | null | undefined>(null);
  const [selectedBalance, setSelectedBalance] = useState<{ currency: CryptoCurrency; amount: number } | null>(null);
  const [amount, setAmount] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null | undefined>(null);
  const [successMessage, setSuccessMessage] = useState<string | null | undefined>(null);
  const [allTransactions, setAllTransactions] = useState<Transaction[]>([]);
  const [displayedTransactions, setDisplayedTransactions] = useState<Transaction[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  useEffect(() => {
    if (status === 'unauthenticated') {
      setError('You must be logged in to perform this action.');
    } else if (status === 'authenticated') {
      setError(null);
      fetchTransactions();
    }
  }, [status]);

  useEffect(() => {
    updateDisplayedTransactions();
  }, [currentPage, itemsPerPage, allTransactions]);

  const fetchTransactions = async () => {
    try {
      const result = await getUserCryptoSellTransactions();
      if ('transactions' in result && Array.isArray(result.transactions)) {
        setAllTransactions(result.transactions);
        updateDisplayedTransactions();
      } else if ('error' in result) {
        setError(result.error);
      } else {
        setError('Unexpected response format from server');
      }
    } catch (err) {
      console.error('Error fetching transactions:', err);
      setError('Failed to fetch transactions');
    }
  };

  const updateDisplayedTransactions = () => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    setDisplayedTransactions(allTransactions.slice(startIndex, endIndex));
    setTotalPages(Math.ceil(allTransactions.length / itemsPerPage));
  };

  const handleAccountSelect = (accountId: string) => {
    setSelectedAccountId(accountId);
    console.log(`Selected account ID: ${accountId}`);
  };

  const handleBalanceSelect = (currency: CryptoCurrency, amount: number) => {
    setSelectedBalance({ currency, amount });
    console.log(`Selected balance: ${currency}, Amount: ${amount}`);
  };

  const handleAmountChange = (newAmount: number) => {
    setAmount(newAmount);
    console.log(`Amount changed: ${newAmount}`);
  };

  const handleTransactionCreate = async () => {
    if (status !== 'authenticated') {
      setError('You must be logged in to perform this action.');
      return;
    }

    if (!selectedAccountId || !selectedBalance || amount <= 0) {
      setError('Please select an account, currency, and enter a valid amount.');
      return;
    }

    setIsLoading(true);
    setError(null);
    setSuccessMessage(null);

    try {
      const result = await createCryptoSellTransaction({
        bankAccountId: selectedAccountId,
        currency: selectedBalance.currency,
        amount: amount
      });

      if ('error' in result) {
        setError(result.error || 'An unknown error occurred');
      } else {
        setSuccessMessage(result.message || 'Transaction created successfully');
        console.log('Transaction created:', result.transaction);
        fetchTransactions();
      }
    } catch (err) {
      console.error('Error creating transaction:', err);
      setError(`Failed to create transaction: ${err instanceof Error ? err.message : String(err)}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handleItemsPerPageChange = (value: string) => {
    const newItemsPerPage = parseInt(value, 10);
    setItemsPerPage(newItemsPerPage);
    setCurrentPage(1);
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

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Sell Cryptocurrency</h1>
      <AccountSelectionComponent
        onAccountSelect={handleAccountSelect}
        onBalanceSelect={handleBalanceSelect}
        onAmountChange={handleAmountChange}
      />
      {error && <p className="text-red-500 mt-2">{error}</p>}
      {successMessage && <p className="text-green-500 mt-2">{successMessage}</p>}
      <button
        onClick={handleTransactionCreate}
        disabled={isLoading || status !== 'authenticated' || !selectedAccountId || !selectedBalance || amount <= 0}
        className="mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50"
      >
        {isLoading ? 'Processing...' : 'Withdraw'}
      </button>

      <Accordion type="single" collapsible className="mt-8">
        <AccordionItem value="item-1">
          <AccordionTrigger>
            <div className="flex items-center">
              <FiClock className="mr-2" />
              Sell Transactions History
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-100 dark:bg-gray-800">
                    <TableHead className="w-[100px]">ID</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Currency</TableHead>
                    <TableHead className="min-w-[200px]">Bank Account</TableHead>
                    <TableHead className="min-w-[150px]">Date</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {displayedTransactions.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center text-gray-500 dark:text-gray-400">No transactions found</TableCell>
                    </TableRow>
                  ) : (
                    displayedTransactions.map((transaction) => (
                      <TableRow key={transaction.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                        <TableCell className="font-medium cursor-pointer hover:text-blue-500" onClick={() => handleCopyToClipboard(transaction.id, "Transaction ID")}>
                          {transaction.id.slice(0, 8)}...
                        </TableCell>
                        <TableCell>{transaction.amount}</TableCell>
                        <TableCell>{transaction.currency}</TableCell>
                        <TableCell>
                          <div className="flex items-center">
                            <div className="truncate max-w-[150px]">{transaction.userBankAccount.bankName} - {transaction.userBankAccount.accountNumber}</div>
                            <Button variant="ghost" size="sm" onClick={() => handleCopyToClipboard(transaction.userBankAccount.accountNumber, "Account number")}>
                              <FiCopy className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                        <TableCell>{new Date(transaction.createdAt).toLocaleString()}</TableCell>
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
};

export default SellComponent;
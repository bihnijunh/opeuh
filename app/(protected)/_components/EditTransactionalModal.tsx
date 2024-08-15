import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Transaction } from "@/transaction-types";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface EditTransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  transactions: Transaction[];
  onUpdateStatus: (transactionId: number, newStatus: string) => void;
}

export const EditTransactionModal: React.FC<EditTransactionModalProps> = ({
  isOpen,
  onClose,
  transactions,
  onUpdateStatus,
}) => {
  const [searchTerm, setSearchTerm] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState("all");
  const [filteredTransactions, setFilteredTransactions] = React.useState(transactions);

  const [currentPage, setCurrentPage] = React.useState(1);
  const [itemsPerPage] = React.useState(10);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentTransactions = filteredTransactions.slice(indexOfFirstItem, indexOfLastItem);

  React.useEffect(() => {
    const filtered = transactions.filter(
      (transaction) =>
        (transaction.walletAddress.toLowerCase().includes(searchTerm.toLowerCase()) ||
        transaction.amount.toString().includes(searchTerm)) &&
        (statusFilter === "all" || transaction.status.toLowerCase() === statusFilter)
    );
    setFilteredTransactions(filtered);
    setCurrentPage(1); // Reset to first page when filters change
  }, [searchTerm, statusFilter, transactions]);

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'successful':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[800px] w-full max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">User Transactions</DialogTitle>
        </DialogHeader>
        <div className="mb-4 space-y-2">
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
            <Input
              placeholder="Search by address or amount"
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="approved">Approved</SelectItem>
              <SelectItem value="successful">Successful</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="px-2 py-1 sm:px-4 sm:py-2">Type</TableHead>
                <TableHead className="px-2 py-1 sm:px-4 sm:py-2">Amount</TableHead>
                <TableHead className="hidden sm:table-cell">Address</TableHead>
                <TableHead className="px-2 py-1 sm:px-4 sm:py-2">Status</TableHead>
                <TableHead className="px-2 py-1 sm:px-4 sm:py-2">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentTransactions.map((transaction) => (
                <TableRow key={transaction.id}>
                  <TableCell className="px-2 py-1 sm:px-4 sm:py-2">
                    <Badge variant="outline">
                      {transaction.btc ? 'BTC' : transaction.usdt ? 'USDT' : 'ETH'}
                    </Badge>
                  </TableCell>
                  <TableCell className="px-2 py-1 sm:px-4 sm:py-2 font-medium">
                    {transaction.amount}
                  </TableCell>
                  <TableCell className="hidden sm:table-cell text-sm text-gray-500">
                    {transaction.walletAddress}
                  </TableCell>
                  <TableCell className="px-2 py-1 sm:px-4 sm:py-2">
                    <Badge className={getStatusColor(transaction.status)}>
                      {transaction.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="px-2 py-1 sm:px-4 sm:py-2">
                    <Select
                      onValueChange={(value) => onUpdateStatus(transaction.id, value)}
                      defaultValue={transaction.status}
                    >
                      <SelectTrigger className="w-full sm:w-[180px]">
                        <SelectValue placeholder="Update status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="approved">Approved</SelectItem>
                        <SelectItem value="successful">Successful</SelectItem>
                      </SelectContent>
                    </Select>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        <div className="flex justify-between items-center mt-4">
          <Button
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
          >
            Previous
          </Button>
          <span>
            Page {currentPage} of {Math.ceil(filteredTransactions.length / itemsPerPage)}
          </span>
          <Button
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, Math.ceil(filteredTransactions.length / itemsPerPage)))}
            disabled={currentPage === Math.ceil(filteredTransactions.length / itemsPerPage)}
          >
            Next
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { UserRole } from "@prisma/client";
import { EditUserModal } from "../_components/EditUserModal+";
import { UserWithTransactions } from "@/transaction-types";
import { MoreHorizontal } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { EditTransactionModal } from "../_components/EditTransactionalModal";
import { updateTransactionStatus } from "@/actions/updateTransactionStatus";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface AdminUsersPageProps {
  initialUsers: UserWithTransactions[];
  totalPages: number;
}

const AdminUsersPage = ({ initialUsers, totalPages }: AdminUsersPageProps) => {
  const [users, setUsers] = useState<UserWithTransactions[]>(initialUsers);
  const [currentPage, setCurrentPage] = useState(1);
  const [editingUser, setEditingUser] = useState<UserWithTransactions | null>(null);
  const [viewingTransactions, setViewingTransactions] = useState<UserWithTransactions | null>(null);

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
    // Implement server-side pagination here
  };

  const handleEditUser = (user: UserWithTransactions) => {
    setEditingUser(user);
  };

  const handleViewTransactions = (user: UserWithTransactions) => {
    setViewingTransactions(user);
  };
  

  const handleUserUpdated = (updatedUser: UserWithTransactions) => {
    setUsers(users.map(u => u.id === updatedUser.id ? updatedUser : u));
    setEditingUser(null);
  };

  const handleUpdateTransactionStatus = async (transactionId: number, newStatus: string) => {
    try {
      // Call the server action to update the transaction status
      const result = await updateTransactionStatus(transactionId, newStatus);
      if (result.success) {
        // Update the local state
        setUsers(users.map(user => ({
          ...user,
          transactions: user.transactions.map(t => 
            t.id === transactionId ? { ...t, status: newStatus } : t
          )
        })));
        toast.success("Transaction status updated successfully");
      } else {
        toast.error(result.error || "Failed to update transaction status");
      }
    } catch (error) {
      console.error("Error updating transaction status:", error);
      toast.error("An error occurred while updating the transaction status");
    }
  };

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-2xl font-bold mb-5">User Management</h1>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>BTC</TableHead>
            <TableHead>USDT</TableHead>
            <TableHead>ETH</TableHead>
            <TableHead>Transactions</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user) => (
            <TableRow key={user.id}>
              <TableCell>{user.name}</TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>{user.role}</TableCell>
              <TableCell>{user.btc}</TableCell>
              <TableCell>{user.usdt}</TableCell>
              <TableCell>{user.eth}</TableCell>
              <TableCell>{user.transactions.length}</TableCell>
              <TableCell>
                <Button onClick={() => handleEditUser(user)}>Edit User</Button>
              </TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                      <span className="sr-only">Open menu</span>
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => handleViewTransactions(user)}>
                      View Transactions
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <div className="flex justify-between mt-4">
        <Button
          onClick={() => handlePageChange(Math.max(currentPage - 1, 1))}
          disabled={currentPage === 1}
        >
          Previous
        </Button>
        <span>
          Page {currentPage} of {totalPages}
        </span>
        <Button
          onClick={() => handlePageChange(Math.min(currentPage + 1, totalPages))}
          disabled={currentPage === totalPages}
        >
          Next
        </Button>
      </div>
      {editingUser && (
        <EditUserModal
          user={editingUser}
          isOpen={!!editingUser}
          onClose={() => setEditingUser(null)}
          onUserUpdated={handleUserUpdated}
        />
      )}
      {viewingTransactions && (
        <EditTransactionModal
          isOpen={!!viewingTransactions}
          onClose={() => setViewingTransactions(null)}
          transactions={viewingTransactions.transactions}
          onUpdateStatus={handleUpdateTransactionStatus}
        />
      )}
    </div>
  );
};

export default AdminUsersPage;
"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { UserRole } from "@prisma/client";
import { EditUserModal } from "../_components/EditUserModal+";
import { UserWithTransactions } from "@/transaction-types";
import { MoreHorizontal, Search } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { EditTransactionModal } from "../_components/EditTransactionalModal";
import { updateTransactionStatus } from "@/actions/updateTransactionStatus";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";


interface AdminUsersPageProps {
  initialUsers: UserWithTransactions[];
  totalPages: number;
}

const AdminUsersPage = ({ initialUsers, totalPages }: AdminUsersPageProps) => {
  const [users, setUsers] = useState<UserWithTransactions[]>(initialUsers);
  const [filteredUsers, setFilteredUsers] = useState<UserWithTransactions[]>(initialUsers);
  const [currentPage, setCurrentPage] = useState(1);
  const [editingUser, setEditingUser] = useState<UserWithTransactions | null>(null);
  const [viewingTransactions, setViewingTransactions] = useState<UserWithTransactions | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");

  useEffect(() => {
    const filtered = users.filter(user => 
      (user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchTerm.toLowerCase())) &&
      (roleFilter === "all" || user.role === roleFilter)
    );
    setFilteredUsers(filtered);
    setCurrentPage(1);
  }, [searchTerm, roleFilter, users]);

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
      const result = await updateTransactionStatus(transactionId, newStatus);
      if (result.success) {
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
    <div className="container mx-auto py-10 px-4 sm:px-6 lg:px-8">
       
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold">User Management</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row justify-between items-center mb-4 space-y-2 sm:space-y-0 sm:space-x-2">
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
              <Input
                placeholder="Search users"
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Select value={roleFilter} onValueChange={setRoleFilter}>
              <SelectTrigger className="w-full sm:w-40">
                <SelectValue placeholder="Filter by role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Roles</SelectItem>
                <SelectItem value={UserRole.ADMIN}>Admin</SelectItem>
                <SelectItem value={UserRole.USER}>User</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[150px]">Name</TableHead>
                  <TableHead className="w-[200px]">Email</TableHead>
                  <TableHead className="w-[100px]">Role</TableHead>
                  <TableHead className="w-[100px]">BTC</TableHead>
                  <TableHead className="w-[100px]">USDT</TableHead>
                  <TableHead className="w-[100px]">ETH</TableHead>
                  <TableHead className="w-[100px]">Transactions</TableHead>
                  <TableHead className="w-[150px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell className="font-medium">{user.name}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>{user.role}</TableCell>
                    <TableCell>{user.btc}</TableCell>
                    <TableCell>{user.usdt}</TableCell>
                    <TableCell>{user.eth}</TableCell>
                    <TableCell>{user.transactions.length}</TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button size="sm" onClick={() => handleEditUser(user)}>Edit</Button>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
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
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          <div className="flex justify-between items-center mt-4">
            <Button
              onClick={() => handlePageChange(Math.max(currentPage - 1, 1))}
              disabled={currentPage === 1}
            >
              Previous
            </Button>
            <span className="text-sm text-gray-600">
              Page {currentPage} of {totalPages}
            </span>
            <Button
              onClick={() => handlePageChange(Math.min(currentPage + 1, totalPages))}
              disabled={currentPage === totalPages}
            >
              Next
            </Button>
          </div>
        </CardContent>
      </Card>
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
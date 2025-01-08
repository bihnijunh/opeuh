"use client";

import React, { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
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
import { Search, MoreHorizontal, UserIcon, DollarSignIcon, ActivityIcon, CreditCardIcon, UsersIcon, PlaneIcon } from "lucide-react";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EditUserForm } from "../_components/EditUserForm";
import { EditTransactionModal } from "../_components/EditTransactionModal";
import type { Transaction } from "@/transaction-types";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import Link from 'next/link';
import { AdminTab } from "../_components/AdminTab";

interface UserWithTransactions {
  id: string;
  name: string | null;
  email: string | null;
  role: UserRole;
  btc: number;
  usdt: number;
  eth: number;
  transactions: Transaction[];
}

interface AdminPageProps {
  users: any[];
  totalUsers: number;
}

interface AdminUsersPageProps {
  initialUsers: UserWithTransactions[];
  totalPages: number;
}

const StatCard = ({ title, value, icon: Icon, trend }: { title: string; value: number | string; icon: any; trend?: { value: number; isPositive: boolean } }) => (
  <motion.div 
    whileHover={{ scale: 1.02 }} 
    transition={{ type: "spring", stiffness: 300 }}
    className="group"
  >
    <Card className="hover:shadow-lg transition-all duration-300 border border-gray-200 dark:border-gray-700">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground group-hover:text-foreground transition-colors">
          {title}
        </CardTitle>
        <div className="rounded-full p-2 bg-primary/10 group-hover:bg-primary/20 transition-colors">
          <Icon className="h-4 w-4 text-primary" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-baseline space-x-2">
          <div className="text-2xl font-bold">{value}</div>
          {trend && (
            <div className={cn(
              "text-sm font-medium",
              trend.isPositive ? "text-green-600" : "text-red-600"
            )}>
              {trend.isPositive ? "+" : "-"}{trend.value}%
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  </motion.div>
);

const AdminUsersPage = ({ initialUsers, totalPages }: AdminUsersPageProps) => {
  const [users, setUsers] = useState<UserWithTransactions[]>(initialUsers);
  const [filteredUsers, setFilteredUsers] = useState<UserWithTransactions[]>(initialUsers);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [selectedUser, setSelectedUser] = useState<UserWithTransactions | null>(null);
  const [viewingTransactions, setViewingTransactions] = useState<UserWithTransactions | null>(null);

  useEffect(() => {
    const filtered = users.filter(user => 
      (user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchTerm.toLowerCase())) &&
      (roleFilter === "all" || user.role === roleFilter)
    );
    setFilteredUsers(filtered);
    setCurrentPage(1);
  }, [searchTerm, roleFilter, users]);

  const handleEditUser = (user: UserWithTransactions) => {
    setSelectedUser(user);
  };

  const handleUserUpdated = (updatedUser: UserWithTransactions) => {
    setUsers(users.map(u => u.id === updatedUser.id ? updatedUser : u));
    setSelectedUser(null);
  };

  const handleUpdateTransactionStatus = async (transactionId: number, newStatus: string) => {
    try {
      const response = await fetch(`/api/transactions/${transactionId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to update transaction status');
      }

      const result = { success: true };
      if (result.success) {
        setUsers(users.map(user => ({
          ...user,
          transactions: user.transactions?.map((t: Transaction) => 
            t.id === transactionId ? { ...t, status: newStatus } : t
          ) || []
        })));
      }
      return result;
    } catch (error) {
      console.error("Error updating transaction status:", error);
      throw error;
    }
  };

  const handleViewTransactions = (user: UserWithTransactions) => {
    setViewingTransactions(user);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
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
                  <React.Fragment key={user.id}>
                    <TableRow>
                      <TableCell className="font-medium">{user.name}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>{user.role}</TableCell>
                      <TableCell>{user.btc}</TableCell>
                      <TableCell>{user.usdt}</TableCell>
                      <TableCell>{user.eth}</TableCell>
                      <TableCell>{user.transactions?.length || 0}</TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button 
                            size="sm" 
                            onClick={() => handleEditUser(user)}
                            variant={selectedUser?.id === user.id ? "secondary" : "default"}
                          >
                            {selectedUser?.id === user.id ? "Cancel Edit" : "Edit"}
                          </Button>
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
                    {selectedUser?.id === user.id && (
                      <TableRow>
                        <TableCell colSpan={8} className="p-0">
                          <Card className="m-2 bg-muted/50">
                            <CardContent className="p-4">
                              <EditUserForm
                                user={selectedUser}
                                onUserUpdated={handleUserUpdated}
                                onCancel={() => setSelectedUser(null)}
                              />
                            </CardContent>
                          </Card>
                        </TableCell>
                      </TableRow>
                    )}
                  </React.Fragment>
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

export default function AdminPageClient({ users, totalUsers }: AdminPageProps) {
  const pathname = usePathname();

  return (
    <motion.div 
      initial="initial"
      animate="animate"
      variants={{
        initial: { opacity: 0 },
        animate: { opacity: 1 }
      }}
      className="p-6 space-y-8"
    >
      <div className="overflow-x-auto">
        <div className="inline-flex min-w-full gap-1 rounded-lg bg-muted/50 p-1 text-muted-foreground">
          <AdminTab href="/admin" isActive={pathname === "/admin"}>
            Users
          </AdminTab>
          <AdminTab href="/admin/flights" isActive={pathname.includes("/admin/flights")}>
            Create Flights
          </AdminTab>
          <AdminTab href="/admin/booked-flights" isActive={pathname.includes("/admin/booked-flights")}>
            Booked Flights
          </AdminTab>
          <AdminTab href="/admin/flight-status" isActive={pathname.includes("/admin/flight-status")}>
            Flight Status
          </AdminTab>
          <AdminTab href="/admin/payment-methods" isActive={pathname.includes("/admin/payment-methods")}>
            Payment Methods
          </AdminTab>
        </div>
      </div>

      <motion.div variants={{
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 }
      }}>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              <UsersIcon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalUsers}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Users</CardTitle>
              <UserIcon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{0}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Bookings</CardTitle>
              <PlaneIcon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{0}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
              <DollarSignIcon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{0}</div>
            </CardContent>
          </Card>
        </div>
      </motion.div>

      <motion.div variants={{
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 }
      }}>
        <div className="grid grid-cols-1 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Recent Users</CardTitle>
            </CardHeader>
            <CardContent>
              <AdminUsersPage initialUsers={users} totalPages={Math.ceil(totalUsers / 10)} />
            </CardContent>
          </Card>
        </div>
      </motion.div>
    </motion.div>
  );
}
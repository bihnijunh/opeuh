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
import { 
  UserIcon, 
  PlaneTakeoffIcon, 
  CalendarCheckIcon, 
  ActivityIcon, 
  CreditCardIcon,
  Search,
  MoreHorizontal
} from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { motion } from "framer-motion";
import { EditUserForm } from "../_components/EditUserForm";
import { AdminTab } from "../_components/AdminTab";

interface AdminPageProps {
  users: User[];
  totalUsers: number;
}

interface AdminUsersPageProps {
  initialUsers: User[];
  totalPages: number;
}

interface User {
  id: string;
  name: string | null;
  email: string | null;
  role: UserRole;
}

interface StatCardProps {
  title: string;
  value: number | string;
  icon: any;
  trend?: { value: number; isPositive: boolean };
}

const StatCard = ({ title, value, icon: Icon, trend }: StatCardProps) => (
  <motion.div 
    className="rounded-xl border bg-card text-card-foreground shadow"
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.3 }}
  >
    <div className="p-6">
      <div className="flex items-center space-x-2">
        <Icon className="h-4 w-4 text-muted-foreground" />
        <h3 className="text-sm font-medium text-muted-foreground">{title}</h3>
      </div>
      <div className="mt-2 flex items-center justify-between">
        <div>
          <p className="text-2xl font-bold">{value}</p>
          {trend && (
            <p className={`text-xs ${trend.isPositive ? 'text-green-500' : 'text-red-500'}`}>
              {trend.isPositive ? '↑' : '↓'} {trend.value}%
            </p>
          )}
        </div>
      </div>
    </div>
  </motion.div>
);

const AdminUsersPage = ({ initialUsers, totalPages }: AdminUsersPageProps) => {
  const [users, setUsers] = useState<User[]>(initialUsers);
  const [filteredUsers, setFilteredUsers] = useState<User[]>(initialUsers);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  useEffect(() => {
    const filtered = users.filter(user => 
      (user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchTerm.toLowerCase())) &&
      (roleFilter === "all" || user.role === roleFilter)
    );
    setFilteredUsers(filtered);
    setCurrentPage(1);
  }, [searchTerm, roleFilter, users]);

  const handleEditUser = (user: User) => {
    setSelectedUser(user);
  };

  const handleUserUpdated = (updatedUser: User) => {
    setUsers(users.map(u => u.id === updatedUser.id ? updatedUser : u));
    setSelectedUser(null);
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
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button 
                            size="sm" 
                            onClick={() => handleEditUser(user)}
                            variant={selectedUser?.id === user.id ? "secondary" : "default"}
                          >
                            {selectedUser?.id === user.id ? "Cancel Edit" : "Edit"}
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                    {selectedUser?.id === user.id && (
                      <TableRow>
                        <TableCell colSpan={4} className="p-0">
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
      transition={{ duration: 0.3 }}
    >
      <div className="overflow-x-auto">
        <div className="inline-flex min-w-full gap-1 rounded-lg bg-muted/50 p-1 text-muted-foreground">
          <AdminTab href="/admin" isActive={pathname === "/admin"} icon={UserIcon}>
            Users
          </AdminTab>
          <AdminTab href="/admin/flights" isActive={pathname === "/admin/flights"} icon={PlaneTakeoffIcon}>
            Create Flights
          </AdminTab>
          <AdminTab href="/admin/booked-flights" isActive={pathname === "/admin/booked-flights"} icon={CalendarCheckIcon}>
            Booked Flights
          </AdminTab>
          <AdminTab href="/admin/flight-status" isActive={pathname === "/admin/flight-status"} icon={ActivityIcon}>
            Flight Status
          </AdminTab>
          <AdminTab href="/admin/payment-methods" isActive={pathname === "/admin/payment-methods"} icon={CreditCardIcon}>
            Payment Methods
          </AdminTab>
        </div>
      </div>
      <div className="mt-8">
        <AdminUsersPage initialUsers={users} totalPages={Math.ceil(totalUsers / 10)} />
      </div>
    </motion.div>
  );
}
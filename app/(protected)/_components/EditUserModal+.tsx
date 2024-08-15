"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { SettingsSchema } from "@/schemas";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { UserRole } from "@prisma/client";
import { UserWithTransactions } from "@/transaction-types";
import { updateUser } from "@/actions/adminUsersPage";
import { Search } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface EditUserModalProps {
  user: UserWithTransactions;
  isOpen: boolean;
  onClose: () => void;
  onUserUpdated: (updatedUser: UserWithTransactions) => void;
}

export const EditUserModal = ({
  user,
  isOpen,
  onClose,
  onUserUpdated,
}: EditUserModalProps) => {
  const [error, setError] = useState<string | undefined>();
  const [success, setSuccess] = useState<string | undefined>();
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredTransactions, setFilteredTransactions] = useState(user.transactions);

  const form = useForm({
    resolver: zodResolver(SettingsSchema),
    defaultValues: {
      name: user.name || "",
      email: user.email || "",
      role: user.role,
      btc: user.btc || 0,
      usdt: user.usdt || 0,
      eth: user.eth || 0,
    },
  });

  useEffect(() => {
    const filtered = user.transactions.filter(
      (transaction) =>
        transaction.walletAddress.toLowerCase().includes(searchTerm.toLowerCase()) ||
        transaction.amount.toString().includes(searchTerm)
    );
    setFilteredTransactions(filtered);
  }, [searchTerm, user.transactions]);

  const onSubmit = async (values: any) => {
    try {
      const result = await updateUser(user.id, values);
      if (result.error) {
        setError(result.error);
      } else if (result.success && result.user) {
        setSuccess(result.success);
        onUserUpdated(result.user);
      }
    } catch (error) {
      setError("An unexpected error occurred");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">Edit User</DialogTitle>
        </DialogHeader>
        <Tabs defaultValue="details" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="details">User Details</TabsTrigger>
            <TabsTrigger value="transactions">Transactions</TabsTrigger>
          </TabsList>
          <TabsContent value="details">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input {...field} className="w-full" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input {...field} type="email" className="w-full" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="role"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Role</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select a role" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value={UserRole.ADMIN}>Admin</SelectItem>
                          <SelectItem value={UserRole.USER}>User</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {["btc", "usdt", "eth"].map((currency) => (
                    <FormField
                      key={currency}
                      control={form.control}
                      name={currency as "btc" | "usdt" | "eth"}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{currency.toUpperCase()} Balance</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              type="number"
                              step={currency === "usdt" ? "0.01" : "0.00000001"}
                              value={field.value || 0}
                              onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                              className="w-full"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  ))}
                </div>
                <DialogFooter>
                  <Button type="submit" className="w-full sm:w-auto">Save changes</Button>
                </DialogFooter>
              </form>
            </Form>
          </TabsContent>
          <TabsContent value="transactions">
            <div className="space-y-4">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
                <Input
                  placeholder="Search transactions"
                  className="pl-8"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr>
                      <th className="text-left">Type</th>
                      <th className="text-left">Amount</th>
                      <th className="text-left hidden sm:table-cell">Address</th>
                      <th className="text-left">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredTransactions.map((transaction) => (
                      <tr key={transaction.id}>
                        <td>{transaction.btc ? 'BTC' : transaction.usdt ? 'USDT' : 'ETH'}</td>
                        <td>{transaction.amount}</td>
                        <td className="hidden sm:table-cell">{transaction.walletAddress}</td>
                        <td>{transaction.status}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </TabsContent>
        </Tabs>
        {error && <p className="text-red-500 mt-4">{error}</p>}
        {success && <p className="text-green-500 mt-4">{success}</p>}
      </DialogContent>
    </Dialog>
  );
};
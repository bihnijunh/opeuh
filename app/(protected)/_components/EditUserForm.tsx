"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { SettingsSchema } from "@/schemas";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
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
import { updateUser } from "@/actions/adminUsersPage";
import { UserWithTransactions } from "@/types";

interface EditUserFormProps {
  user: UserWithTransactions;
  onUserUpdated: (user: UserWithTransactions) => void;
  onCancel: () => void;
}

export const EditUserForm = ({ user, onUserUpdated, onCancel }: EditUserFormProps) => {
  const [error, setError] = useState<string | undefined>();
  const [success, setSuccess] = useState<string | undefined>();

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

  const onSubmit = async (values: any) => {
    try {
      setError(undefined);
      setSuccess(undefined);
      
      const result = await updateUser(user.id, {
        name: values.name,
        email: values.email,
        role: values.role as UserRole,
        btc: parseFloat(values.btc),
        usdt: parseFloat(values.usdt),
        eth: parseFloat(values.eth),
      });

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
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input {...field} />
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
                  <Input {...field} type="email" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="role"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Role</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
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
          <FormField
            control={form.control}
            name="btc"
            render={({ field }) => (
              <FormItem>
                <FormLabel>BTC Balance</FormLabel>
                <FormControl>
                  <Input {...field} type="number" step="0.00000001" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="usdt"
            render={({ field }) => (
              <FormItem>
                <FormLabel>USDT Balance</FormLabel>
                <FormControl>
                  <Input {...field} type="number" step="0.01" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="eth"
            render={({ field }) => (
              <FormItem>
                <FormLabel>ETH Balance</FormLabel>
                <FormControl>
                  <Input {...field} type="number" step="0.00000001" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {error && (
          <div className="bg-destructive/15 p-3 rounded-md flex items-center gap-x-2 text-sm text-destructive">
            <p>{error}</p>
          </div>
        )}
        {success && (
          <div className="bg-emerald-500/15 p-3 rounded-md flex items-center gap-x-2 text-sm text-emerald-500">
            <p>{success}</p>
          </div>
        )}

        <div className="flex justify-end space-x-2">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit">Save Changes</Button>
        </div>
      </form>
    </Form>
  );
};

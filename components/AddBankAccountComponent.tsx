import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from "zod";
import { Button } from '@/components/ui/button';
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { saveBankAccount, getBankAccount, deleteBankAccount } from '@/actions/bankAccount';
import { toast } from 'sonner';
import { AccountSchema } from '@/schemas';

type BankAccountFormData = z.infer<typeof AccountSchema>;

export const AddBankAccountComponent: React.FC = () => {
  const [isEditing, setIsEditing] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<BankAccountFormData>({
    resolver: zodResolver(AccountSchema),
    defaultValues: {},
  });

  useEffect(() => {
    fetchBankAccount();
  }, []);

  const fetchBankAccount = async () => {
    const result = await getBankAccount();
    if (result.success && result.account) {
      form.reset(result.account);
      setIsEditing(false);
    } else if (result.success && !result.account) {
      // Handle case where no account exists yet
      form.reset({});
      setIsEditing(true);
    } else if ('error' in result) {
      toast.error(result.error);
    }
  };

  const handleSubmit = async (data: BankAccountFormData) => {
    setIsSubmitting(true);
    try {
      const result = await saveBankAccount(data);
      if ('error' in result) {
        toast.error(result.error);
      } else if (result.success) {
        toast.success(result.success);
        setIsEditing(false);
        fetchBankAccount();
      }
    } catch (error) {
      console.error("Error saving bank account details:", error);
      toast.error("Failed to save bank account details. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (confirm("Are you sure you want to delete your bank account details?")) {
      const result = await deleteBankAccount();
      if ('success' in result) {
        toast.success(result.success);
        form.reset({});
        setIsEditing(true);
      } else if ('error' in result) {
        toast.error(result.error);
      }
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <p className="text-2xl mt-3 font-semibold text-center">
        Manage your bank account information here.
        </p>
        
      </div>
      {!isEditing && form.getValues().accountNumber ? (
        <div className="space-y-4">
          <div>
            <strong>Account Number:</strong> {form.getValues().accountNumber}
          </div>
          <Button onClick={() => setIsEditing(true)}>Edit</Button>
          <Button onClick={handleDelete} variant="destructive">Delete Account</Button>
        </div>
      ) : (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="accountHolderName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Account Holder Name</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Enter account holder name" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="bankName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Bank Name</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Enter bank name" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="accountNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Account Number</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Enter account number" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="routingNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Routing Number</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Enter routing number" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="iban"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>IBAN (Optional)</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Enter IBAN" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="swiftCode"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>SWIFT Code (Optional)</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Enter SWIFT code" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Saving...' : 'Save Bank Account'}
            </Button>
          </form>
        </Form>
      )}
    </div>
  );
};
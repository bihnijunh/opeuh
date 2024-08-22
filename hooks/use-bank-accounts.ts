import { useState, useEffect } from 'react';
import { BankAccount } from '@prisma/client';
import { addBankAccount, deleteBankAccount, getBankAccounts } from "@/actions/bankAcc";

export const useBankAccounts = () => {
  const [bankAccounts, setBankAccounts] = useState<BankAccount[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBankAccounts = async () => {
      try {
        setLoading(true);
        const accounts = await getBankAccounts();
        setBankAccounts(accounts);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchBankAccounts();
  }, []);

  const handleAddBankAccount = async (formData: FormData) => {
    try {
      const newAccount = await addBankAccount(formData);
      if (newAccount) {
        setBankAccounts(prev => [...prev, newAccount]);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add bank account');
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteBankAccount(id);
      setBankAccounts(prev => prev.filter(account => account.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete bank account');
    }
  };

  return { 
    bankAccounts, 
    loading, 
    error, 
    handleAddBankAccount, 
    handleDelete 
  };
};
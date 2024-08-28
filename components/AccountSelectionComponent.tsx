"use client"
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { AddBankAccountComponent } from './AddBankAccountComponent';
import { getBankAccount } from '@/actions/bankAccount';
import { getUserBalances } from '@/actions/getBalances';

type CryptoCurrency = "ETH" | "USDT" | "BTC";

interface UserBankAccount {
  id: string;
  accountNumber: string;
  iban?: string;
  swiftCode?: string;
  bankName: string;
  routingNumber: string;
  accountHolderName: string;
}

interface UserBalances {
  btc: number;
  usdt: number;
  eth: number;
}

export const AccountSelectionComponent: React.FC<{
  onAccountSelect: (accountId: string) => void;
  onBalanceSelect: (currency: CryptoCurrency, amount: number) => void;
  onAmountChange: (amount: number) => void;
}> = ({ onAccountSelect, onBalanceSelect, onAmountChange }) => {
  const [showAddBankAccountModal, setShowAddBankAccountModal] = useState(false);
  const [userBankAccount, setUserBankAccount] = useState<UserBankAccount | null>(null);
  const [userBalances, setUserBalances] = useState<UserBalances | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedAccountId, setSelectedAccountId] = useState<string | null>(null);
  const [selectedBalance, setSelectedBalance] = useState<string | null>(null);
  const [amount, setAmount] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchUserBankAccount();
    fetchUserBalances();
  }, []);

  const fetchUserBankAccount = async () => {
    setIsLoading(true);
    try {
      const response = await getBankAccount();
      if ('error' in response) {
        throw new Error(response.error);
      }
      if (response.success && response.account) {
        setUserBankAccount(response.account);
        setSelectedAccountId(response.account.id);
        onAccountSelect(response.account.id);
      } else {
        setUserBankAccount(null);
        setSelectedAccountId(null);
      }
    } catch (error) {
      console.error("Error fetching user bank account:", error);
      toast.error("Failed to fetch bank account. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchUserBalances = async () => {
    try {
      const response = await getUserBalances();
      if ('error' in response) {
        throw new Error(response.error);
      }
      if (response.success && response.balances) {
        setUserBalances(response.balances);
      } else {
        setUserBalances(null);
      }
    } catch (error) {
      console.error("Error fetching user balances:", error);
      toast.error("Failed to fetch user balances. Please try again later.");
    }
  };

  const handleAccountChange = (value: string) => {
    if (value === "add_new") {
      setShowAddBankAccountModal(true);
    } else {
      setSelectedAccountId(value);
      onAccountSelect(value);
    }
  };

  const handleBalanceChange = (value: string) => {
    setSelectedBalance(value);
    const [currency, amount] = value.split(':');
    onBalanceSelect(currency.toUpperCase() as CryptoCurrency, parseFloat(amount));
    validateAmount(amount);
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newAmount = e.target.value;
    setAmount(newAmount);
    validateAmount(newAmount);
  };

  const validateAmount = (newAmount: string) => {
    const numAmount = parseFloat(newAmount);
    if (isNaN(numAmount)) {
      setError('Please enter a valid number');
      return;
    }

    if (selectedBalance) {
      const [currency, balance] = selectedBalance.split(':');
      const numBalance = parseFloat(balance);

      if (['btc', 'eth', 'usdt'].includes(currency.toLowerCase())) {
        if (numAmount < 50) {
          setError('Minimum withdrawal for crypto is $50');
          return;
        }
      }

      if (numAmount > numBalance) {
        setError('Amount exceeds available balance');
        return;
      }
    }

    setError(null);
    onAmountChange(numAmount);
  };

  const handleCloseModal = () => {
    setShowAddBankAccountModal(false);
    fetchUserBankAccount(); // Refresh the account data after adding a new account
  };

  if (isLoading) {
    return <div>Loading bank details and balances</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <label htmlFor="bankAccount" className="block text-sm font-medium text-gray-700">
          Select Bank Account for Withdrawal
        </label>
        <Select onValueChange={handleAccountChange} value={selectedAccountId || undefined}>
          <SelectTrigger id="bankAccount">
            <SelectValue placeholder="Select a bank account" />
          </SelectTrigger>
          <SelectContent>
            {userBankAccount && (
              <SelectItem value={userBankAccount.id}>
                {`${userBankAccount.bankName} - ${userBankAccount.accountNumber}`}
              </SelectItem>
            )}
            <SelectItem value="add_new">Add New Bank Account</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <label htmlFor="balance" className="block text-sm font-medium text-gray-700">
          Select Balance for Withdrawal
        </label>
        <Select onValueChange={handleBalanceChange} value={selectedBalance || undefined}>
          <SelectTrigger id="balance">
            <SelectValue placeholder="Select a balance" />
          </SelectTrigger>
          <SelectContent>
            {userBalances && Object.entries(userBalances).map(([currency, amount]) => (
              <SelectItem key={currency} value={`${currency}:${amount}`}>
                {`${currency.toUpperCase()}: ${amount}`}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <label htmlFor="amount" className="block text-sm font-medium text-gray-700">
          Amount to Withdraw
        </label>
        <Input
          id="amount"
          type="number"
          value={amount}
          onChange={handleAmountChange}
          placeholder="Enter amount"
          className="mt-1"
        />
        {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
      </div>
      
      {showAddBankAccountModal && (
        <div className="modal">
          <AddBankAccountComponent />
          <Button onClick={handleCloseModal}>
            Close
          </Button>
        </div>
      )}
    </div>
  );
};
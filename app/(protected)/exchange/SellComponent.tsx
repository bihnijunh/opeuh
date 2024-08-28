import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { AccountSelectionComponent } from '@/components/AccountSelectionComponent';
import { createCryptoSellTransaction } from '@/actions/cryptoSellTransaction';

type CryptoCurrency = "ETH" | "USDT" | "BTC";

export const SellComponent: React.FC = () => {
  const { data: session, status } = useSession();
  const [selectedAccountId, setSelectedAccountId] = useState<string | null>(null);
  const [selectedBalance, setSelectedBalance] = useState<{ currency: CryptoCurrency; amount: number } | null>(null);
  const [amount, setAmount] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    if (status === 'unauthenticated') {
      setError('You must be logged in to perform this action.');
    } else {
      setError(null);
    }
  }, [status]);

  const handleAccountSelect = (accountId: string) => {
    setSelectedAccountId(accountId);
    console.log(`Selected account ID: ${accountId}`);
  };

  const handleBalanceSelect = (currency: CryptoCurrency, amount: number) => {
    setSelectedBalance({ currency, amount });
    console.log(`Selected balance: ${currency}, Amount: ${amount}`);
  };

  const handleAmountChange = (newAmount: number) => {
    setAmount(newAmount);
    console.log(`Amount changed: ${newAmount}`);
  };

  const handleTransactionCreate = async () => {
    if (status !== 'authenticated' || !session?.user?.id) {
      setError('You must be logged in to perform this action.');
      return;
    }

    if (!selectedAccountId || !selectedBalance || amount <= 0) {
      setError('Please select an account, currency, and enter a valid amount.');
      return;
    }

    setIsLoading(true);
    setError(null);
    setSuccessMessage(null);

    try {
      const result = await createCryptoSellTransaction({
        userId: session.user.id,
        bankAccountId: selectedAccountId,
        currency: selectedBalance.currency,
        amount: amount
      });

      if ('error' in result) {
        setError(result.error || 'An unknown error occurred');
      } else {
        setSuccessMessage(result.message || 'Transaction created successfully');
        console.log('Transaction created:', result.transaction);
      }
    } catch (err) {
      console.error('Error creating transaction:', err);
      setError(`Failed to create transaction: ${err instanceof Error ? err.message : String(err)}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Sell Cryptocurrency</h1>
      <AccountSelectionComponent
        onAccountSelect={handleAccountSelect}
        onBalanceSelect={handleBalanceSelect}
        onAmountChange={handleAmountChange}
      />
      {error && <p className="text-red-500 mt-2">{error}</p>}
      {successMessage && <p className="text-green-500 mt-2">{successMessage}</p>}
      <button
        onClick={handleTransactionCreate}
        disabled={isLoading || status !== 'authenticated' || !selectedAccountId || !selectedBalance || amount <= 0}
        className="mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50"
      >
        {isLoading ? 'Processing...' : 'Withdraw'}
      </button>
    </div>
  );
};

export default SellComponent;
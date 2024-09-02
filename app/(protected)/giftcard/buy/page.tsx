'use client'

import React, { useState, useEffect, useCallback } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useRouter } from 'next/navigation';
import { getUserBalances } from '@/actions/getBalances';
import { giftCardWithdrawal } from '@/actions/giftCardWithdrawal';
import { toast } from 'sonner';
import { useCurrentUser } from "@/hooks/use-current-user";
import { Button } from "@/components/ui/button";
import SuccessModal from '../_components/SuccessModal';

interface BuyPageProps {
  searchParams: { itemName: string; price: string };
}

interface UserBalances {
  btc: number;
  usdt: number;
  eth: number;
}

const BuyPage: React.FC<BuyPageProps> = ({ searchParams }) => {
  const { itemName, price } = searchParams;
  const [balances, setBalances] = useState<UserBalances | null>(null);
  const [selectedCrypto, setSelectedCrypto] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const router = useRouter();
  const user = useCurrentUser();

  useEffect(() => {
    fetchUserBalances();
  }, []);

  const fetchUserBalances = async () => {
    try {
      const response = await getUserBalances();
      if ('error' in response) {
        throw new Error(response.error);
      }
      if (response.success && response.balances) {
        setBalances(response.balances);
      } else {
        setBalances(null);
      }
    } catch (error) {
      console.error("Error fetching user balances:", error);
      setError("Failed to fetch user balances. Please try again later.");
      toast.error("Failed to fetch user balances. Please try again later.");
    }
  };

  const handleBuy = useCallback(async () => {
    if (!user) {
      setError("User not authenticated. Please log in to continue.");
      toast.error("User not authenticated. Please log in to continue.");
      return;
    }

    if (balances && selectedCrypto) {
      const balance = balances[selectedCrypto as keyof UserBalances];
      if (balance >= parseFloat(price)) {
        setIsProcessing(true);
        setError(null);
        try {
          const result = await giftCardWithdrawal(itemName, parseFloat(price), selectedCrypto as 'usdt' | 'btc' | 'eth');
          if ('error' in result) {
            throw new Error(`${result.error}${result.details ? `. ${result.details}` : ''}`);
          } else {
            setShowSuccessModal(true);
            toast.success(result.success);
          }
        } catch (error) {
          console.error("Error during gift card withdrawal:", error);
          setError(error instanceof Error ? error.message : "An unexpected error occurred. Please try again later.");
          toast.error(error instanceof Error ? error.message : "An unexpected error occurred. Please try again later.");
        } finally {
          setIsProcessing(false);
        }
      } else {
        setError(`Insufficient ${selectedCrypto.toUpperCase()} balance. You need $${price}, but you only have $${balance.toFixed(2)}.`);
        toast.error(`Insufficient ${selectedCrypto.toUpperCase()} balance. You need $${price}, but you only have $${balance.toFixed(2)}.`);
      }
    }
  }, [user, balances, selectedCrypto, itemName, price]);

  const handleBalanceChange = (value: string) => {
    setSelectedCrypto(value);
    setError(null);
  };

  return (
    <div className="flex items-center justify-center min-h-screen p-4">
      <div className="w-full max-w-md rounded-xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl backdrop-blur-sm bg-opacity-20 bg-white">
        <div className="p-6 sm:p-8">
          <h1 className="text-3xl font-bold mb-6 text-gray-800">Confirm Purchase</h1>
          <p className="mb-6 text-gray-700">Are you sure you want to buy <span className="font-semibold text-blue-600">{itemName}</span> for <span className="font-semibold text-green-600">${price}</span>?</p>
          
          {balances ? (
            <Select onValueChange={handleBalanceChange}>
              <SelectTrigger className="w-full mb-6 bg-white bg-opacity-70 border border-gray-300 text-gray-800 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-3 transition-all duration-200 ease-in-out hover:bg-opacity-80 hover:border-blue-400 appearance-none">
                <SelectValue placeholder="Select cryptocurrency" />
              </SelectTrigger>
              <SelectContent className="bg-white bg-opacity-90 border border-gray-300 rounded-md shadow-lg">
                {Object.entries(balances).map(([currency, amount]) => (
                  <SelectItem key={currency} value={currency} className="p-2 hover:bg-blue-50 transition-colors duration-150 ease-in-out">
                    <span className="font-medium">{currency.toUpperCase()}</span>: ${amount.toFixed(2)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          ) : (
            <p className="mb-6 text-gray-700">Loading balances...</p>
          )}

          {error && <p className="text-red-500 mb-6">{error}</p>}

          <div className="flex justify-between space-x-4">
            <Button onClick={() => router.back()} variant="outline" className="w-1/2 py-2 px-4 border border-gray-300 rounded-md text-gray-700 bg-white bg-opacity-50 hover:bg-opacity-70 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-300">
              Cancel
            </Button>
            <Button onClick={handleBuy} disabled={!selectedCrypto || isProcessing} className="w-1/2 py-2 px-4 border border-transparent rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-300">
              {isProcessing ? 'Processing...' : 'Confirm Purchase'}
            </Button>
          </div>
        </div>
      </div>

      {showSuccessModal && (
        <SuccessModal
          itemName={itemName}
          price={price}
          onClose={() => setShowSuccessModal(false)}
        />
      )}
    </div>
  );
};

export default BuyPage;
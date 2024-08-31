import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useRouter } from 'next/navigation';
import { getUserBalances } from '@/actions/getBalances';
import { toast } from 'sonner';
import SuccessPage from './SuccessPage';

interface BuyModalProps {
  itemName: string;
  price: number;
  onBuy: () => void;
}

interface UserBalances {
  btc: number;
  usdt: number;
  eth: number;
}

const BuyModal: React.FC<BuyModalProps> = ({ itemName, price, onBuy }) => {
  const [balances, setBalances] = useState<UserBalances | null>(null);
  const [selectedCrypto, setSelectedCrypto] = useState<string>('');
  const [showSuccessPage, setShowSuccessPage] = useState(false);
  const router = useRouter();

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
      toast.error("Failed to fetch user balances. Please try again later.");
    }
  };

  const handleBuy = async () => {
    if (balances && selectedCrypto) {
      const balance = balances[selectedCrypto as keyof UserBalances];
      if (balance >= price) {
        await onBuy();
        setShowSuccessPage(true);
      } else {
        toast.error(`Insufficient ${selectedCrypto.toUpperCase()} balance. You need $${price.toFixed(2)}, but you only have $${balance.toFixed(2)}.`);
      }
    }
  };

  const handleBalanceChange = (value: string) => {
    setSelectedCrypto(value);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="default">Buy</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Confirm Purchase</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          {showSuccessPage ? (
            <SuccessPage
              title="Purchase Successful"
              message={`You have successfully purchased ${itemName} for $${price}.`}
              ctaText="Return to Gift card "
              ctaLink="/giftcard"
            />
          ) : (
            <>
              <p>Are you sure you want to buy {itemName} for ${price}?</p>
              {balances ? (
                <Select onValueChange={handleBalanceChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select cryptocurrency" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(balances).map(([currency, amount]) => (
                      <SelectItem key={currency} value={currency}>
                        {`${currency.toUpperCase()}: $${amount.toFixed(2)}`}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              ) : (
                <p>Loading balances...</p>
              )}
              <Button onClick={handleBuy} disabled={!selectedCrypto}>
                Confirm Purchase
              </Button>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default BuyModal;
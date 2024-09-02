import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useRouter } from 'next/navigation';
import { getUserBalances } from '@/actions/getBalances';
import { giftCardWithdrawal } from '@/actions/giftCardWithdrawal';
import { toast } from 'sonner';

interface BuyModalProps {
  itemName: string;
  price: number;
  giftCardName: string;
}

interface UserBalances {
  btc: number;
  usdt: number;
  eth: number;
}

const BuyModal: React.FC<BuyModalProps> = ({ itemName, price, giftCardName }) => {
  const [balances, setBalances] = useState<UserBalances | null>(null);
  const [selectedCrypto, setSelectedCrypto] = useState<string>('');
  const [showSuccessPage, setShowSuccessPage] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (isOpen) {
      fetchUserBalances();
    }
  }, [isOpen]);

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
        setIsLoading(true);
        try {
          const result = await giftCardWithdrawal(giftCardName, price, selectedCrypto as 'usdt' | 'btc' | 'eth');
          if ('error' in result) {
            throw new Error(result.error);
          }
          setBalances(prevBalances => ({
            ...prevBalances!,
            [selectedCrypto]: result.updatedBalance!
          }));
          setShowSuccessPage(true);
        } catch (error) {
          console.error("Error processing gift card withdrawal:", error);
          toast.error("Failed to process the purchase. Please try again later.");
        } finally {
          setIsLoading(false);
        }
      } else {
        toast.error(`Insufficient ${selectedCrypto.toUpperCase()} balance. You need $${price.toFixed(2)}, but you only have $${balance.toFixed(2)}.`);
      }
    }
  };

  const handleBalanceChange = (value: string) => {
    setSelectedCrypto(value);
  };

  const handleClose = () => {
    setIsOpen(false);
    setShowSuccessPage(false);
    setSelectedCrypto('');
  };

  const handleReturnToGiftCard = () => {
    handleClose();
    router.push('/giftcard');
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button onClick={() => setIsOpen(true)}> Buy </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{showSuccessPage ? "Purchase Successful" : "Confirm Purchase"}</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          {showSuccessPage ? (
            <div className="text-center">
              <p className="text-xl text-gray-700 mb-8">
                You have successfully purchased {itemName} for ${price}.
              </p>
              <Button
                onClick={handleReturnToGiftCard}
                className="bg-green-500 hover:bg-green-600 text-white"
              >
                Return to Gift card
              </Button>
            </div>
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
              <Button onClick={handleBuy} disabled={!selectedCrypto || isLoading}>
                {isLoading ? 'Processing...' : 'Confirm Purchase'}
              </Button>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default BuyModal;
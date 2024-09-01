import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useRouter } from 'next/navigation';
import { getUserBalances } from '@/actions/getBalances';
import { giftCardWithdrawal } from '@/actions/giftCardWithdrawal';
import { toast } from 'sonner';
import { useCurrentUser } from "@/hooks/use-current-user";

interface BuyModalProps {
  itemName: string;
  price: number;
}

interface UserBalances {
  btc: number;
  usdt: number;
  eth: number;
}

const BuyModal: React.FC<BuyModalProps> = ({ itemName, price }) => {
  const [balances, setBalances] = useState<UserBalances | null>(null);
  const [selectedCrypto, setSelectedCrypto] = useState<string>('');
  const [isOpen, setIsOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
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

  const handleBuy = async () => {
    if (!user) {
      setError("User not authenticated. Please log in to continue.");
      toast.error("User not authenticated. Please log in to continue.");
      return;
    }

    if (balances && selectedCrypto) {
      const balance = balances[selectedCrypto as keyof UserBalances];
      if (balance >= price) {
        setIsProcessing(true);
        setError(null);
        try {
          const result = await giftCardWithdrawal(itemName, price, selectedCrypto as 'usdt' | 'btc' | 'eth');
          if ('error' in result) {
            throw new Error(`${result.error}${result.details ? `. ${result.details}` : ''}`);
          } else {
            toast.success(result.success);
            setIsOpen(false);
            router.push(`/giftcard/success?itemName=${encodeURIComponent(itemName)}&price=${price}`);
          }
        } catch (error) {
          console.error("Error during gift card withdrawal:", error);
          setError(error instanceof Error ? error.message : "An unexpected error occurred. Please try again later.");
          toast.error(error instanceof Error ? error.message : "An unexpected error occurred. Please try again later.");
        } finally {
          setIsProcessing(false);
        }
      } else {
        setError(`Insufficient ${selectedCrypto.toUpperCase()} balance. You need $${price.toFixed(2)}, but you only have $${balance.toFixed(2)}.`);
        toast.error(`Insufficient ${selectedCrypto.toUpperCase()} balance. You need $${price.toFixed(2)}, but you only have $${balance.toFixed(2)}.`);
      }
    }
  };

  const handleBalanceChange = (value: string) => {
    setSelectedCrypto(value);
    setError(null);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="default" onClick={() => setIsOpen(true)}>Buy</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Confirm Purchase</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
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
          {error && <p className="text-red-500">{error}</p>}
          <Button onClick={handleBuy} disabled={!selectedCrypto || isProcessing}>
            {isProcessing ? 'Processing...' : 'Confirm Purchase'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default BuyModal;
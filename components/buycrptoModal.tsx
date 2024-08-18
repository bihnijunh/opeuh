import React, { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { VerifiedIcon } from './ui/verified-icon';

interface BuyModalProps {
  isOpen: boolean;
  onClose: () => void;
  seller: {
    name: string;
    orders: number;
    completion: number;
    verified: boolean;
  };
  price: number;
  currency: string;
  paymentTimeLimit: string;
  avgReleaseTime: string;
  available: string;
  minAmount: number;
  maxAmount: number;
  paymentMethod: string;
  terms: string;
  onBuy: () => void;
}

async function getExchangeRate(from: string, to: string): Promise<number> {
  const apiKey = 'YOUR_API_KEY';
  const url = `https://v6.exchangerate-api.com/v6/${apiKey}/pair/${from}/${to}`;

  try {
    const response = await fetch(url);
    const data = await response.json();
    if (data.result === 'success') {
      return data.conversion_rate;
    } else {
      throw new Error('Failed to fetch exchange rate');
    }
  } catch (error) {
    console.error('Error fetching exchange rate:', error);
    throw error;
  }
}

export const BuyModal: React.FC<BuyModalProps> = ({
  isOpen,
  onClose,
  seller,
  price,
  currency,
  paymentTimeLimit,
  avgReleaseTime,
  available,
  minAmount,
  maxAmount,
  paymentMethod,
  terms,
  onBuy,
}) => {
  const [payAmount, setPayAmount] = useState("");
  const [receiveAmount, setReceiveAmount] = useState("");
  const [exchangeRate, setExchangeRate] = useState<number | null>(null);

  useEffect(() => {
    async function fetchExchangeRate() {
      try {
        const rate = await getExchangeRate('USD', 'BRL');
        setExchangeRate(rate);
      } catch (error) {
        console.error('Failed to fetch exchange rate:', error);
      }
    }
    fetchExchangeRate();
  }, []);

  const handlePayAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setPayAmount(value);
    if (exchangeRate) {
      setReceiveAmount((parseFloat(value) / exchangeRate).toFixed(2));
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] w-full max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">Buy Cryptocurrency</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4">
          <div className="flex items-center mb-2 sm:mb-0">
            <div className="w-10 h-10 bg-gray-200 rounded-full mr-3 flex items-center justify-center">
              {seller.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <h3 className="font-semibold flex items-center">
                {seller.name}
                {seller.verified && <VerifiedIcon  />}
              </h3>
              <p className="text-xs sm:text-sm text-gray-500">
                {seller.orders} orders • {seller.completion}% completion
              </p>
            </div>
          </div>
          <div className="text-right">
            <p className="font-semibold text-lg">{price} {currency}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4 text-sm">
          <div>
            <p className="text-gray-500">Payment Time Limit</p>
            <p className="font-medium">{paymentTimeLimit}</p>
          </div>
          <div>
            <p className="text-gray-500">Avg. Release Time</p>
            <p className="font-medium">{avgReleaseTime}</p>
          </div>
          <div>
            <p className="text-gray-500">Available</p>
            <p className="font-medium">{available}</p>
          </div>
        </div>

        <div className="mb-4">
          <p className="text-sm text-gray-500 mb-1">You Pay (BRL)</p>
          <div className="flex items-center">
            <Input
              type="number"
              placeholder={`${minAmount} - ${maxAmount}`}
              className="flex-grow mr-2"
              value={payAmount}
              onChange={handlePayAmountChange}
            />
            <span className="font-medium">BRL</span>
          </div>
        </div>

        <div className="mb-4">
          <p className="text-sm text-gray-500 mb-1">You Receive (USDT)</p>
          <div className="flex items-center">
            <Input
              type="number"
              placeholder="0.00"
              className="flex-grow mr-2"
              value={receiveAmount}
              readOnly
            />
            <span className="font-medium">USDT</span>
          </div>
        </div>

        {exchangeRate && (
          <p className="text-sm text-gray-500 mb-4">
            Exchange Rate: 1 USD = {exchangeRate.toFixed(2)} BRL
          </p>
        )}

        <div className="mb-4">
          <p className="text-sm font-medium mb-1">Payment Method</p>
          <div className="bg-gray-100 p-2 rounded text-sm">
            {paymentMethod}
          </div>
        </div>

        <div className="mb-4">
          <p className="text-sm font-medium mb-1">Advertisers Terms</p>
          <div className="bg-gray-100 p-2 rounded text-sm">
            {terms}
          </div>
        </div>

        <DialogFooter>
          <Button onClick={onBuy} className="w-full sm:w-auto">Confirm Purchase</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
import React from 'react';
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
          <p className="text-sm text-gray-500 mb-1">You Pay</p>
          <div className="flex items-center">
            <Input
              type="number"
              placeholder={`${minAmount} - ${maxAmount}`}
              className="flex-grow mr-2"
            />
            <span className="font-medium">{currency}</span>
          </div>
        </div>

        <div className="mb-4">
          <p className="text-sm text-gray-500 mb-1">You Receive</p>
          <div className="flex items-center">
            <Input
              type="number"
              placeholder="0.00"
              className="flex-grow mr-2"
              readOnly
            />
            <span className="font-medium">{currency}</span>
          </div>
        </div>

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
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Info } from 'lucide-react';

interface BuyModalProps {
  isOpen: boolean;
  onClose: () => void;
  amount: number;
  receiveCurrency: string;
  receiveAmount: number;
  paymentMethods: Array<{ method: string; price: number; isBestOffer?: boolean }>;
  onRefreshPrice: () => void;
}

export const BuyModal: React.FC<BuyModalProps> = ({
  isOpen,
  onClose,
  amount,
  receiveCurrency,
  receiveAmount,
  paymentMethods,
  onRefreshPrice,
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <ArrowLeft className="mr-2 h-4 w-4 cursor-pointer" onClick={onClose} />
            Select payment method
          </DialogTitle>
        </DialogHeader>
        <div className="mt-4">
          <h2 className="text-3xl font-bold text-center">$ {amount.toFixed(2)}</h2>
          <p className="text-center text-gray-500 mt-2">
            I will receive {receiveAmount.toFixed(2)} {receiveCurrency}
          </p>
        </div>
        <div className="mt-6">
          <div className="flex justify-between items-center mb-2">
            <span className="font-medium">Pay with</span>
            <span className="text-gray-500 flex items-center">
              Price <Info className="ml-1 h-4 w-4" />
            </span>
          </div>
          {paymentMethods.map((method, index) => (
            <div 
              key={index} 
              className={`border rounded-lg p-4 mb-2 flex justify-between items-center ${method.isBestOffer ? 'border-yellow-400' : ''}`}
            >
              <span>{method.method}</span>
              <div>
                {method.isBestOffer && <span className="text-yellow-400 text-sm mr-2">Best offer</span>}
                <span className="font-medium">${method.price.toFixed(2)}</span>
              </div>
            </div>
          ))}
        </div>
        <Button onClick={onRefreshPrice} className="w-full mt-4 bg-green-500 hover:bg-green-600">
          Refresh Price
        </Button>
      </DialogContent>
    </Dialog>
  );
};
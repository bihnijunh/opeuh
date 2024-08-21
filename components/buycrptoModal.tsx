import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Info, CreditCard, Wallet } from 'lucide-react';
import { PaymentMethodModal } from './PaymentMethodsModal';

interface PaymentMethod {
  method: string;
  price: number;
  isBestOffer?: boolean;
}

interface BuyModalProps {
  isOpen: boolean;
  onClose: () => void;
  amount: number;
  receiveCurrency: string;
  receiveAmount: number;
  paymentMethods: PaymentMethod[];
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
  const [isPaymentMethodModalOpen, setIsPaymentMethodModalOpen] = useState(false);

  const handlePaymentMethodSelect = (method: string) => {
    console.log(`Selected payment method: ${method}`);
    setIsPaymentMethodModalOpen(false);
    // You might want to update some state or trigger an action here
  };

  const getMethodIcon = (method: string) => {
    switch (method.toLowerCase()) {
      case 'credit card':
        return <CreditCard className="h-6 w-6" />;
      default:
        return <Wallet className="h-6 w-6" />;
    }
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-[425px] rounded-2xl p-6">
          <DialogHeader>
            <DialogTitle className="flex items-center text-lg sm:text-xl">
              <ArrowLeft className="mr-2 h-5 w-5 cursor-pointer" onClick={onClose} />
              Select payment method
            </DialogTitle>
          </DialogHeader>
          <div className="mt-6">
            <h2 className="text-2xl sm:text-3xl font-bold text-center">$ {amount.toFixed(2)}</h2>
            <p className="text-center text-gray-500 mt-2 text-sm sm:text-base">
              I will receive {receiveAmount.toFixed(2)} {receiveCurrency}
            </p>
          </div>
          <div className="mt-8">
            <div className="flex justify-between items-center mb-3">
              <span className="font-medium text-sm sm:text-base">Pay with</span>
              <span className="text-gray-500 flex items-center text-sm sm:text-base">
                Price <Info className="ml-1 h-4 w-4" />
              </span>
            </div>
            {paymentMethods.map((method, index) => (
              <div 
                key={index} 
                className={`border rounded-xl p-4 mb-3 flex justify-between items-center cursor-pointer ${method.isBestOffer ? 'border-yellow-400' : ''}`}
                onClick={() => setIsPaymentMethodModalOpen(true)}
              >
                <div className="flex items-center">
                  {getMethodIcon(method.method)}
                  <span className="ml-3 text-sm sm:text-base">{method.method}</span>
                </div>
                <div>
                  {method.isBestOffer && <span className="text-yellow-400 text-xs sm:text-sm mr-2">Best offer</span>}
                  <span className="font-medium text-sm sm:text-base">${method.price.toFixed(2)}</span>
                </div>
              </div>
            ))}
          </div>
         
        </DialogContent>
      </Dialog>

      <PaymentMethodModal
        isOpen={isPaymentMethodModalOpen}
        onClose={() => setIsPaymentMethodModalOpen(false)}
        paymentMethods={paymentMethods}
        onSelectMethod={handlePaymentMethodSelect}
        amount={amount}
        receiveCurrency={receiveCurrency}
        receiveAmount={receiveAmount}
      />
    </>
  );
};
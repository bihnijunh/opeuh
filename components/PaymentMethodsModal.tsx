import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Check, CreditCard, Wallet, Building } from 'lucide-react';
import { useEffect } from 'react';

interface PaymentMethod {
  method: string;
  price: number;
  isBestOffer?: boolean;
  disabled?: boolean;
}

interface BankTransfer {
  id: string;
  bankName: string;
  accountName: string;
  accountNumber: string;
  status: string;
}

interface PaymentMethodModalProps {
  isOpen: boolean;
  onClose: () => void;
  paymentMethods: PaymentMethod[];
  onSelectMethod: (method: string) => void;
  amount: number;
  receiveCurrency: string;
  receiveAmount: number;
  bankAccounts: BankTransfer[];
}

export const PaymentMethodModal: React.FC<PaymentMethodModalProps> = ({
  isOpen,
  onClose,
  paymentMethods,
  onSelectMethod,
  amount,
  receiveCurrency,
  receiveAmount,
  bankAccounts,
}) => {
  const [selectedMethod, setSelectedMethod] = useState<string | null>(null);

  const getMethodIcon = (method: string) => {
    switch (method.toLowerCase()) {
      case 'credit card':
        return <CreditCard className="h-6 w-6" />;
      case 'bank transfer':
        return <Building className="h-6 w-6" />;
      default:
        return <Wallet className="h-6 w-6" />;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] rounded-3xl p-0 overflow-hidden">
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-6 text-white">
          <DialogHeader>
            <DialogTitle className="flex items-center text-xl font-bold">
              <ArrowLeft className="mr-2 h-5 w-5 cursor-pointer" onClick={onClose} />
              Select Payment Method
            </DialogTitle>
          </DialogHeader>
          <div className="mt-4">
            <h2 className="text-4xl font-bold">${Number(amount).toFixed(2)}</h2>
            <p className="text-sm opacity-90">
              You will receive {receiveCurrency === 'BTC' ? Number(receiveAmount).toFixed(8) : Number(receiveAmount).toFixed(2)} {receiveCurrency}
            </p>
          </div>
        </div>
        <div className="p-6">
          <div className="space-y-3">
            {paymentMethods.map((method, index) => (
              <div 
                key={index} 
                className={`bg-white border rounded-xl p-4 flex justify-between items-center transition-all ${
                  method.disabled 
                    ? 'opacity-60 bg-gray-100 cursor-not-allowed' 
                    : 'cursor-pointer hover:border-indigo-300'
                } ${
                  selectedMethod === method.method && !method.disabled ? 'border-indigo-600 shadow-md' : 'border-gray-200'
                }`}
                onClick={() => !method.disabled && setSelectedMethod(method.method)}
              >
                <div className="flex items-center space-x-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    selectedMethod === method.method && !method.disabled ? 'bg-indigo-100' : 'bg-gray-100'
                  }`}>
                    {getMethodIcon(method.method)}
                  </div>
                  <div>
                    <p className={`font-semibold ${method.disabled ? 'text-gray-500' : ''}`}>{method.method}</p>
                    <p className="text-sm text-gray-500">
                      {method.disabled ? 'Coming Soon' : method.method.toLowerCase() === 'btc' ? Number(method.price).toFixed(8) : Number(method.price).toFixed(2)}
                    </p>
                  </div>
                </div>
                {method.isBestOffer && !method.disabled && (
                  <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                    Best Rate
                  </span>
                )}
                {method.disabled && (
                  <span className="bg-yellow-100 text-yellow-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                    Coming Soon
                  </span>
                )}
                {selectedMethod === method.method && !method.disabled && (
                  <Check className="h-5 w-5 text-indigo-600" />
                )}
              </div>
            ))}
          </div>
          {selectedMethod === 'Bank Transfer' && (
            <div className="mt-4">
              <h3 className="text-lg font-semibold mb-2">Accepted Bank Transfers</h3>
              {bankAccounts && bankAccounts.length > 0 ? (
                <ul className="space-y-2">
                  {bankAccounts.filter(bank => bank.status === 'active').map((bank) => (
                    <li key={bank.id} className="bg-gray-50 p-3 rounded-lg">
                      <p className="font-medium">{bank.bankName}</p>
                      <p className="text-sm text-gray-600">Account Name: {bank.accountName}</p>
                      <p className="text-sm text-gray-600">Account Number: {bank.accountNumber}</p>
                    </li>
                  ))}
                </ul>
              ) : (
                <p>No bank accounts available</p>
              )}
            </div>
          )}
          <Button 
            onClick={() => selectedMethod && onSelectMethod(selectedMethod)} 
            disabled={!selectedMethod}
            className="w-full mt-6 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-xl py-3 text-sm font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Confirm Selection
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
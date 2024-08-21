import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Check, CreditCard, Wallet, Building } from 'lucide-react';

interface PaymentMethod {
  method: string;
  price: number;
  isBestOffer?: boolean;
}

interface BankTransfer {
  bankName: string;
  accountName: string;
  accountNumber: string;
}

interface PaymentMethodModalProps {
  isOpen: boolean;
  onClose: () => void;
  paymentMethods: PaymentMethod[];
  onSelectMethod: (method: string) => void;
  amount: number;
  receiveCurrency: string;
  receiveAmount: number;
}

const acceptedBankTransfers: BankTransfer[] = [
  {
    bankName: "Chase Bank",
    accountName: "Piedra P2P Exchange",
    accountNumber: "1234567890",
  },
  {
    bankName: "Bank of America",
    accountName: "Piedra Crypto Services",
    accountNumber: "0987654321",
  },
  {
    bankName: "Wells Fargo",
    accountName: "Piedra Financial",
    accountNumber: "1122334455",
  },
];

export const PaymentMethodModal: React.FC<PaymentMethodModalProps> = ({
  isOpen,
  onClose,
  paymentMethods,
  onSelectMethod,
  amount,
  receiveCurrency,
  receiveAmount,
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
            <h2 className="text-4xl font-bold">${amount.toFixed(2)}</h2>
            <p className="text-sm opacity-90">
              You will receive {receiveAmount.toFixed(2)} {receiveCurrency}
            </p>
          </div>
        </div>
        <div className="p-6">
          <div className="space-y-3">
            {paymentMethods.map((method, index) => (
              <div 
                key={index} 
                className={`bg-white border rounded-xl p-4 flex justify-between items-center cursor-pointer transition-all ${
                  selectedMethod === method.method ? 'border-indigo-600 shadow-md' : 'border-gray-200 hover:border-indigo-300'
                }`}
                onClick={() => setSelectedMethod(method.method)}
              >
                <div className="flex items-center space-x-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    selectedMethod === method.method ? 'bg-indigo-100' : 'bg-gray-100'
                  }`}>
                    {getMethodIcon(method.method)}
                  </div>
                  <div>
                    <p className="font-semibold">{method.method}</p>
                    <p className="text-sm text-gray-500">${method.price.toFixed(2)}</p>
                  </div>
                </div>
                {method.isBestOffer && (
                  <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                    Best Rate
                  </span>
                )}
                {selectedMethod === method.method && (
                  <Check className="h-5 w-5 text-indigo-600" />
                )}
              </div>
            ))}
          </div>
          {selectedMethod === 'Bank Transfer' && (
            <div className="mt-4">
              <h3 className="text-lg font-semibold mb-2">Accepted Bank Transfers</h3>
              <ul className="space-y-2">
                {acceptedBankTransfers.map((bank, index) => (
                  <li key={index} className="bg-gray-50 p-3 rounded-lg">
                    <p className="font-medium">{bank.bankName}</p>
                    <p className="text-sm text-gray-600">Account Name: {bank.accountName}</p>
                    <p className="text-sm text-gray-600">Account Number: {bank.accountNumber}</p>
                  </li>
                ))}
              </ul>
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
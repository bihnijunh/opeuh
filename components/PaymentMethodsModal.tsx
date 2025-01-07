import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Check, CreditCard, Wallet, Building } from 'lucide-react';
import { useEffect } from 'react';
import Image from "next/image";
import { QRCodeSVG } from 'qrcode.react';
import toast from 'react-hot-toast';

enum PaymentMethodType {
  CRYPTO = "CRYPTO",
  FIAT = "FIAT"
}

interface PaymentMethod {
  id: string;
  method: string;
  name: string;
  description?: string;
  instructions?: string;
  accountInfo?: string;
  walletAddress?: string;
  type: PaymentMethodType;
  isActive: boolean;
  disabled?: boolean;
  price?: number;
  isBestOffer?: boolean;
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
  const [showInstructions, setShowInstructions] = useState(false);

  const getMethodIcon = (method: string) => {
    switch (method.toLowerCase()) {
      case 'credit card':
        return <CreditCard className="h-6 w-6" />;
      case 'bank transfer':
        return <Building className="h-6 w-6" />;
      case 'zelle':
        return <div className="h-6 w-6 flex items-center justify-center font-bold text-indigo-600">Z</div>;
      default:
        return <Wallet className="h-6 w-6" />;
    }
  };

  const handleMethodSelect = (method: PaymentMethod) => {
    if (!method.disabled) {
      setSelectedMethod(method.method);
      setShowInstructions(!!method.instructions || method.method === 'Bank Transfer');
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[550px] rounded-[32px] p-0 overflow-hidden bg-white shadow-2xl">
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-8 text-white">
          <DialogHeader>
            <DialogTitle className="flex items-center text-2xl font-bold">
              <ArrowLeft className="mr-3 h-6 w-6 cursor-pointer hover:opacity-80 transition-opacity" onClick={onClose} />
              Checkout
            </DialogTitle>
          </DialogHeader>
          <div className="mt-6">
            <h2 className="text-5xl font-bold">${Number(amount).toFixed(2)}</h2>
            <p className="text-base mt-2 opacity-90">
              You will receive {receiveCurrency === 'BTC' ? Number(receiveAmount).toFixed(8) : Number(receiveAmount).toFixed(2)} {receiveCurrency}
            </p>
          </div>
        </div>
        
        <div className="p-8">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Select Payment Method</h3>
          <div className="space-y-4">
            {paymentMethods.map((method, index) => (
              <div 
                key={index} 
                className={`bg-white border-2 rounded-2xl p-5 flex justify-between items-center transition-all duration-200 ${
                  method.disabled 
                    ? 'opacity-60 bg-gray-50 cursor-not-allowed' 
                    : 'cursor-pointer hover:border-indigo-300 hover:shadow-md'
                } ${
                  selectedMethod === method.method && !method.disabled ? 'border-indigo-600 shadow-lg' : 'border-gray-200'
                }`}
                onClick={() => handleMethodSelect(method)}
              >
                <div className="flex items-center space-x-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                    selectedMethod === method.method && !method.disabled ? 'bg-indigo-100' : 'bg-gray-50'
                  }`}>
                    {getMethodIcon(method.method)}
                  </div>
                  <div>
                    <p className={`font-semibold text-lg ${method.disabled ? 'text-gray-500' : 'text-gray-800'}`}>{method.method}</p>
                    <p className="text-sm text-gray-500">
                      {method.disabled ? 'Coming Soon' : method.type === PaymentMethodType.CRYPTO ? Number(method.price).toFixed(8) : Number(method.price).toFixed(2)}
                    </p>
                  </div>
                </div>
                {method.isBestOffer && !method.disabled && (
                  <span className="bg-green-100 text-green-800 text-xs font-medium px-3 py-1 rounded-full">
                    Best Rate
                  </span>
                )}
                {method.disabled && (
                  <span className="bg-yellow-100 text-yellow-800 text-xs font-medium px-3 py-1 rounded-full">
                    Coming Soon
                  </span>
                )}
                {selectedMethod === method.method && !method.disabled && (
                  <Check className="h-6 w-6 text-indigo-600" />
                )}
              </div>
            ))}
          </div>

          {showInstructions && selectedMethod && (
            <div className="mt-6 bg-gray-50 rounded-2xl p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-3">Payment Instructions</h3>
              {selectedMethod === 'Bank Transfer' ? (
                bankAccounts && bankAccounts.length > 0 ? (
                  <ul className="space-y-3">
                    {bankAccounts.filter(bank => bank.status === 'active').map((bank) => (
                      <li key={bank.id} className="bg-white p-4 rounded-xl border border-gray-200">
                        <p className="font-medium text-gray-800">{bank.bankName}</p>
                        <p className="text-sm text-gray-600 mt-1">Account Name: {bank.accountName}</p>
                        <p className="text-sm text-gray-600">Account Number: {bank.accountNumber}</p>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-gray-600">No bank accounts available</p>
                )
              ) : (
                <div>
                  {/* Show custom instructions if available */}
                  {paymentMethods.find(m => m.method === selectedMethod)?.instructions && (
                    <div className="mb-4">
                      <p className="text-sm font-medium text-gray-700 mb-2">Instructions</p>
                      <p className="text-sm text-gray-600 whitespace-pre-wrap">
                        {paymentMethods.find(m => m.method === selectedMethod)?.instructions}
                      </p>
                    </div>
                  )}
                  
                  {/* Show account info if available */}
                  {paymentMethods.find(m => m.method === selectedMethod)?.accountInfo && (
                    <div className="mb-4">
                      <p className="text-sm font-medium text-gray-700 mb-2">Account Information</p>
                      <p className="text-sm text-gray-600 whitespace-pre-wrap">
                        {paymentMethods.find(m => m.method === selectedMethod)?.accountInfo}
                      </p>
                    </div>
                  )}

                  {paymentMethods.find(m => m.method === selectedMethod)?.type === PaymentMethodType.CRYPTO && (
                    <div className="mt-4">
                      <p className="text-sm font-medium text-gray-700 mb-2">Wallet Address</p>
                      <div className="flex items-center gap-2">
                        <code className="bg-gray-50 px-3 py-2 rounded-lg text-sm font-mono flex-1 break-all">
                          {paymentMethods.find(m => m.method === selectedMethod)?.walletAddress}
                        </code>
                        <Button
                          variant="outline"
                          size="sm"
                          className="shrink-0"
                          onClick={() => {
                            const address = paymentMethods.find(m => m.method === selectedMethod)?.walletAddress;
                            if (address) {
                              navigator.clipboard.writeText(address);
                              toast.success('Wallet address copied to clipboard');
                            }
                          }}
                        >
                          Copy
                        </Button>
                      </div>
                      <div className="mt-4">
                        <p className="text-sm font-medium text-gray-700 mb-2">Scan QR Code</p>
                        <div className="flex flex-col items-center">
                          <div className="bg-white p-4 rounded-lg">
                            {paymentMethods.find(m => m.method === selectedMethod)?.walletAddress && (
                              <QRCodeSVG
                                value={paymentMethods.find(m => m.method === selectedMethod)?.walletAddress || ''}
                                size={120}
                                level="H"
                                includeMargin
                                className="rounded-lg"
                              />
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
          
          <Button 
            onClick={() => selectedMethod && onSelectMethod(selectedMethod)} 
            disabled={!selectedMethod}
            className="w-full mt-6 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-xl py-4 text-base font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-md hover:shadow-lg"
          >
            Continue to Payment
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
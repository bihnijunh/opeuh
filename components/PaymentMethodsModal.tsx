import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Check, CreditCard, Wallet } from 'lucide-react';
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

interface PaymentMethodModalProps {
  isOpen: boolean;
  onClose: () => void;
  paymentMethods: PaymentMethod[];
  onSelectMethod: (method: string) => void;
  amount: number;
  receiveCurrency: string;
  receiveAmount: number;
}

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
  const [showQR, setShowQR] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    toast.success('Copied to clipboard!');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleMethodSelect = (methodId: string) => {
    setSelectedMethod(methodId);
    onSelectMethod(methodId);
  };

  const selectedPaymentMethod = paymentMethods.find(
    (method) => method.id === selectedMethod
  );

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md mx-auto">
        <DialogHeader>
          <DialogTitle className="text-center">
            {selectedMethod ? (
              <div className="flex items-center">
                <Button
                  variant="ghost"
                  className="p-0 mr-2"
                  onClick={() => setSelectedMethod(null)}
                >
                  <ArrowLeft className="h-6 w-6" />
                </Button>
                Select Payment Method
              </div>
            ) : (
              "Select Payment Method"
            )}
          </DialogTitle>
        </DialogHeader>

        <div className="mt-4">
          {!selectedMethod ? (
            <div className="space-y-4">
              {paymentMethods.map((method) => (
                <div
                  key={method.id}
                  className={`p-4 border rounded-lg cursor-pointer transition-all ${
                    method.disabled
                      ? 'opacity-50 cursor-not-allowed'
                      : 'hover:border-blue-500'
                  }`}
                  onClick={() => !method.disabled && handleMethodSelect(method.id)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      {method.type === PaymentMethodType.CRYPTO ? (
                        <Wallet className="h-6 w-6" />
                      ) : (
                        <CreditCard className="h-6 w-6" />
                      )}
                      <div>
                        <h3 className="font-medium">{method.name}</h3>
                        {method.description && (
                          <p className="text-sm text-gray-500">
                            {method.description}
                          </p>
                        )}
                      </div>
                    </div>
                    {method.isBestOffer && (
                      <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">
                        Best Offer
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {selectedPaymentMethod?.instructions && (
                <p className="text-sm text-gray-600">
                  {selectedPaymentMethod.instructions}
                </p>
              )}
              {selectedPaymentMethod?.accountInfo && (
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Account Info:</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() =>
                        handleCopy(selectedPaymentMethod.accountInfo!)
                      }
                    >
                      {copied ? (
                        <Check className="h-4 w-4 text-green-500" />
                      ) : (
                        'Copy'
                      )}
                    </Button>
                  </div>
                  <p className="mt-1 text-sm break-all">
                    {selectedPaymentMethod.accountInfo}
                  </p>
                </div>
              )}
              {selectedPaymentMethod?.walletAddress && (
                <>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Wallet Address:</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() =>
                          handleCopy(selectedPaymentMethod.walletAddress!)
                        }
                      >
                        {copied ? (
                          <Check className="h-4 w-4 text-green-500" />
                        ) : (
                          'Copy'
                        )}
                      </Button>
                    </div>
                    <p className="mt-1 text-sm break-all">
                      {selectedPaymentMethod.walletAddress}
                    </p>
                  </div>
                  <div className="flex justify-center">
                    <QRCodeSVG
                      value={selectedPaymentMethod.walletAddress}
                      size={200}
                    />
                  </div>
                </>
              )}
              <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                <div className="flex justify-between">
                  <span>Amount to Pay:</span>
                  <span className="font-medium">
                    {amount} {selectedPaymentMethod?.name}
                  </span>
                </div>
                <div className="flex justify-between mt-2">
                  <span>You Receive:</span>
                  <span className="font-medium">
                    {receiveAmount} {receiveCurrency}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
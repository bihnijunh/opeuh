import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface ConfirmTransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  amount: string;
  cryptoType: string;
  recipientName: string;
  username: string;
}

export const ConfirmTransactionModal: React.FC<ConfirmTransactionModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  amount,
  cryptoType,
  recipientName,
  username,
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-full max-w-md mx-auto">
        <DialogHeader>
          <DialogTitle className="text-xl sm:text-2xl">Confirm Transaction</DialogTitle>
          <DialogDescription className="text-sm sm:text-base">
            Please review the transaction details below:
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <p className="text-base sm:text-lg font-semibold break-words">
           You are about to send ${amount} {cryptoType.toUpperCase()}
          </p>
          <p className="text-sm sm:text-base text-gray-600 break-words">
            To: {recipientName} ({username})
          </p>
        </div>
        <DialogFooter className="flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
          <Button className="w-full sm:w-auto" variant="outline" onClick={onClose}>Cancel</Button>
          <Button className="w-full sm:w-auto" onClick={onConfirm}>Confirm Send</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
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
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Confirm Transaction</DialogTitle>
          <DialogDescription>
            Please review the transaction details below:
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <p className="text-lg font-semibold">
            Send {amount} {cryptoType.toUpperCase()}
          </p>
          <p className="text-gray-600">
            To: {recipientName} ({username})
          </p>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={onConfirm}>Confirm Send</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
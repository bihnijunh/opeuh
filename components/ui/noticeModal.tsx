import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from 'lucide-react';
import { Checkbox } from "@/components/ui/checkbox";

interface NoticeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export const NoticeModal: React.FC<NoticeModalProps> = ({ isOpen, onClose, onConfirm }) => {
  const [isChecked, setIsChecked] = React.useState(false);

  const handleConfirm = () => {
    if (isChecked) {
      onConfirm();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-center text-xl font-semibold">
            <AlertTriangle className="h-6 w-6 text-yellow-500 mr-2" />
            Notice
          </DialogTitle>
        </DialogHeader>
        <div className="text-center space-y-4">
          <p>
            To avoid becoming a victim of scammers, NEVER transfer cryptocurrency before actually receiving the payment!
          </p>
          <p>
            Don&apos;t believe anyone who claims to be a customer support and convinces you to complete the transaction before you receive the payment - they&apos;re scammers.
          </p>
          <p>
            Once the seller confirms the order and transfers the assets to the buyer, the transaction is considered completed and cannot be disputed. Binance does not take any responsibility for transactions made outside of the platform.
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Checkbox
            id="terms"
            checked={isChecked}
            onCheckedChange={(checked: boolean | 'indeterminate') => setIsChecked(checked as boolean)}
          />
          <label htmlFor="terms" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
            I have read and agree to the above content
          </label>
        </div>
        <DialogFooter>
          <Button 
            onClick={handleConfirm} 
            disabled={!isChecked}
            className="w-full bg-yellow-500 hover:bg-yellow-600 text-white"
          >
            Confirm
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
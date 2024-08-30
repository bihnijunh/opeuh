import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface BuyModalProps {
  itemName: string;
  price: number;
  onBuy: () => void;
}

const BuyModal: React.FC<BuyModalProps> = ({ itemName, price, onBuy }) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="default">Buy</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Confirm Purchase</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <p>Are you sure you want to buy {itemName} for ${price}?</p>
          <Button onClick={onBuy}>Confirm Purchase</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default BuyModal;
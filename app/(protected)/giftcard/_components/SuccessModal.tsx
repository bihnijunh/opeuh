import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { FaCheckCircle, FaGift } from 'react-icons/fa';
import { motion } from 'framer-motion';

interface SuccessModalProps {
  itemName: string;
  price: string;
  onClose: () => void;
}

const SuccessModal: React.FC<SuccessModalProps> = ({ itemName, price, onClose }) => {
  const [isOpen, setIsOpen] = useState(true);
  const router = useRouter();

  useEffect(() => {
    return () => {
      // Cleanup function to ensure any pending state updates are cancelled
      setIsOpen(false);
    };
  }, []);

  const handleClose = () => {
    setIsOpen(false);
    onClose();
  };

  const handleReturn = () => {
    handleClose();
    router.push('/giftcard');
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
            >
              <FaCheckCircle className="text-6xl text-green-500 mx-auto mb-4" />
            </motion.div>
            Purchase Successful!
          </DialogTitle>
        </DialogHeader>
        <div className="text-center">
          <p className="text-lg mb-4">
            You have successfully purchased <span className="font-semibold">{itemName}</span> for <span className="font-semibold">${price}</span>.
          </p>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="flex justify-center mb-6"
          >
            <FaGift className="text-4xl text-purple-500" />
          </motion.div>
          <Button onClick={handleReturn} className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 transition-all duration-300">
            Return to Gift Cards
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SuccessModal;
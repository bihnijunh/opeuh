'use client'

import React from 'react';
import { useSearchParams } from 'next/navigation';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from 'next/link';
import { motion } from 'framer-motion';
import { FaCheckCircle, FaGift, FaArrowLeft } from 'react-icons/fa';

const SuccessPage: React.FC = () => {
  const searchParams = useSearchParams();
  const itemName = searchParams?.get('itemName') ?? 'your item';
  const price = searchParams?.get('price') ?? 'N/A';

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-blue-100 to-purple-100 p-4">
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="w-full max-w-md mx-auto overflow-hidden shadow-lg">
          <CardHeader className="bg-gradient-to-r from-blue-500 to-purple-500 text-white text-center py-6">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
            >
              <FaCheckCircle className="text-6xl mx-auto mb-4" />
            </motion.div>
            <CardTitle className="text-2xl font-bold">Purchase Successful!</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <CardDescription className="text-center text-lg mb-6">
              You have successfully purchased <span className="font-semibold">{itemName}</span> for <span className="font-semibold">${price}</span>.
            </CardDescription>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="flex justify-center mb-6"
            >
              <FaGift className="text-4xl text-purple-500" />
            </motion.div>
            <Link href="/giftcard" className="block">
              <Button className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 transition-all duration-300">
                <FaArrowLeft className="mr-2" /> Return to Gift Cards
              </Button>
            </Link>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default SuccessPage;
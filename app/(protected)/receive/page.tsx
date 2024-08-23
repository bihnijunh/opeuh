"use client";
import React, { useState, useEffect } from "react";
import { toast } from "sonner";
import { FaCopy, FaQrcode } from "react-icons/fa";
import { FiInfo, FiClock } from "react-icons/fi";
import QRCode from "qrcode.react";
import { motion } from "framer-motion";
import Image from 'next/image';
import { getReceivedTransactions } from "@/actions/getReceivedTransactions";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const cryptoIcons = {
  btc: "https://cryptologos.cc/logos/bitcoin-btc-logo.png?v=032",
  usdt: "https://cryptologos.cc/logos/tether-usdt-logo.png?v=032",
  eth: "https://cryptologos.cc/logos/ethereum-eth-logo.png?v=032"
};

const cryptocurrencyOptions = [
  { name: "BTC", address: "16FfUiyaw7xQqbJWEPLc3QxubvawTPWjo7", icon: cryptoIcons.btc, network: "Bitcoin" },
  { name: "USDT", address: "TFvYytGvjMUvQkPQZofKXQ3ZhTUSXD4LQ6", icon: cryptoIcons.usdt, network: "Tron" },
  { name: "ETH", address: "0x742d35Cc6634C0532925a3b844Bc454e4438f44e", icon: cryptoIcons.eth, network: "Ethereum" },
];

interface Transaction {
  id: string;
  date: Date;
  amount: number;
  cryptoType: string;
  senderAddress: string;
  senderUsername: string;
  status: string;
  transactionHash: string;
}

export default function ReceiveComponent() {
  const [selectedCrypto, setSelectedCrypto] = useState(cryptocurrencyOptions[0]);
  const [showQR, setShowQR] = useState(false);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const copyAddressToClipboard = () => {
    navigator.clipboard.writeText(selectedCrypto.address)
      .then(() => toast.success("Address copied to clipboard"))
      .catch(() => toast.error("Failed to copy address"));
  };

  const fetchTransactions = async (page = currentPage) => {
    try {
      const result = await getReceivedTransactions(page, itemsPerPage);
      if (result.success) {
        setTransactions(result.transactions as Transaction[]);
        setTotalPages(result.totalPages);
        setCurrentPage(result.currentPage);
      } else {
        toast.error("Failed to fetch transactions. Please try again later.");
      }
    } catch (error) {
      console.error("Error fetching transactions:", error);
      toast.error("Failed to fetch transactions. Please try again later.");
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, [itemsPerPage]);

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      handlePageChange(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      handlePageChange(currentPage + 1);
    }
  };

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
    fetchTransactions(newPage);
  };

  const handleItemsPerPageChange = (value: string) => {
    const newItemsPerPage = parseInt(value, 10);
    setItemsPerPage(newItemsPerPage);
    setCurrentPage(1);
    fetchTransactions(1);
  };

  const handleCopyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text).then(
      () => {
        toast.success(`${label} copied to clipboard.`);
      },
      () => {
        toast.error(`Failed to copy ${label}. Please try again.`);
      }
    );
  };

  return (
    <div className="max-w-4xl mx-auto p-8 bg-white dark:bg-gray-800 rounded-2xl shadow-lg">
      <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-6">
        Receive Crypto
      </h2>

      <div className="space-y-8">
        <div className="flex flex-wrap justify-start gap-4">
          {cryptocurrencyOptions.map((crypto) => (
            <motion.button
              key={crypto.name}
              onClick={() => setSelectedCrypto(crypto)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`px-6 py-3 rounded-full transition duration-300 ease-in-out flex items-center ${
                selectedCrypto.name === crypto.name
                  ? "bg-blue-500 text-white"
                  : "bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-600"
              }`}
            >
              <Image src={crypto.icon} alt={crypto.name} width={24} height={24} className="mr-2" />
              {crypto.name}
            </motion.button>
          ))}
        </div>

        <div className="bg-gray-50 dark:bg-gray-700 p-4 sm:p-6 rounded-xl">
          <div className="flex justify-between items-center mb-2 sm:mb-4">
            <span className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">Selected Network</span>
            <span className="text-xs sm:text-sm font-medium">{selectedCrypto.network}</span>
          </div>
          <div className="flex items-center space-x-2">
            <input
              type="text"
              readOnly
              value={selectedCrypto.address}
              className="flex-grow bg-white dark:bg-gray-600 text-gray-800 dark:text-white px-2 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm rounded-lg border border-gray-200 dark:border-gray-500 focus:ring-2 focus:ring-blue-500 outline-none"
            />
            <motion.button
              onClick={copyAddressToClipboard}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-blue-500 text-white p-2 sm:p-3 rounded-lg hover:bg-blue-600 transition duration-300 ease-in-out"
              title="Copy to clipboard"
            >
              <FaCopy size={16} className="sm:w-5 sm:h-5" />
            </motion.button>
          </div>
        </div>

        <div className="flex justify-between items-center">
          <motion.button
            onClick={() => setShowQR(!showQR)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex-1 mr-4 bg-blue-500 hover:bg-blue-600 text-white py-3 rounded-lg transition duration-300 ease-in-out flex items-center justify-center"
          >
            <FaQrcode size={20} className="mr-2" />
            {showQR ? "Hide" : "Show"} QR Code
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-gray-200 dark:bg-gray-700 p-3 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600"
            title="Important Information"
          >
            <FiInfo size={24} />
          </motion.button>
        </div>

        {showQR && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="mt-6 bg-white dark:bg-gray-700 p-6 rounded-lg shadow-md flex flex-col items-center"
          >
            <QRCode value={selectedCrypto.address} size={200} />
            <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">Scan this QR code to receive {selectedCrypto.name}</p>
          </motion.div>
        )}

        <Accordion type="single" collapsible>
          <AccordionItem value="item-1">
            <AccordionTrigger>
              <div className="flex items-center">
                <FiClock className="mr-2" />
                Received Transactions History
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[100px]">ID</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead className="min-w-[150px]">Sender</TableHead>
                      <TableHead className="min-w-[200px]">Sender Address</TableHead>
                      <TableHead className="min-w-[150px]">Date</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {transactions.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center">No transactions found</TableCell>
                      </TableRow>
                    ) : (
                      transactions.map((transaction: Transaction) => (
                        <TableRow key={transaction.transactionHash}>
                          <TableCell className="font-medium cursor-pointer hover:text-blue-500" onClick={() => handleCopyToClipboard(transaction.transactionHash, "Transaction ID")}>
                            {transaction.transactionHash.slice(0, 8)}...
                          </TableCell>
                          <TableCell>{transaction.amount}$</TableCell>
                          <TableCell>{transaction.senderUsername}</TableCell>
                          <TableCell>
                            <div className="flex items-center">
                              <div className="truncate max-w-[150px]">{transaction.senderAddress}</div>
                              <Button variant="ghost" size="sm" onClick={() => handleCopyToClipboard(transaction.senderAddress, "Sender address")}>
                                <FaCopy className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                          <TableCell>{new Date(transaction.date).toLocaleString()}</TableCell>
                          <TableCell>{transaction.cryptoType}</TableCell>
                          <TableCell>
                            <Badge variant={transaction.status === "pending" ? "warning" : transaction.status === "approved" ? "secondary" : "success"}>
                              {transaction.status}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
              <div className="flex flex-col sm:flex-row justify-between items-center mt-4 space-y-4 sm:space-y-0">
                <Select
                  value={itemsPerPage.toString()}
                  onValueChange={handleItemsPerPageChange}
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Items per page" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="5">5 per page</SelectItem>
                    <SelectItem value="10">10 per page</SelectItem>
                    <SelectItem value="20">20 per page</SelectItem>
                  </SelectContent>
                </Select>
                <div className="flex items-center space-x-2">
                  <Button onClick={handlePreviousPage} disabled={currentPage === 1}>
                    Previous
                  </Button>
                  <span className="flex items-center">
                    Page {currentPage} of {totalPages}
                  </span>
                  <Button
                    onClick={handleNextPage}
                    disabled={currentPage === totalPages}
                  >
                    Next
                  </Button>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </div>
  );
}
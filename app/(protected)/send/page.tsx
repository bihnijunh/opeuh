"use client"
import React, { useState } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FiCopy } from "react-icons/fi";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface Transaction {
  id: number;
  amount: string;
  walletAddress: string;
  date: string;
  time: string;
}

function Send() {
  const [amount, setAmount] = useState<string>("");
  const [walletAddress, setWalletAddress] = useState<string>("");
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  const handleSend = () => {
    if (amount && walletAddress) {
      const amountNumber = Number(amount);
      if (isNaN(amountNumber) || amountNumber <= 0) {
        toast.error("Please enter a valid amount");
        return;
      }

      const newTransaction: Transaction = {
        id: transactions.length + 1,
        amount,
        walletAddress,
        date: new Date().toLocaleDateString(),
        time: new Date().toLocaleTimeString(),
      };

      setTransactions([...transactions, newTransaction]);
      setAmount("");
      setWalletAddress("");
      toast.success("Transaction successful");
    }
  };

  const handleCopyToClipboard = (address: string) => {
    navigator.clipboard.writeText(address).catch(() => {
      toast.error("Failed to copy wallet address");
    });

    toast.success("Wallet address copied!", {
      position: "top-right",
      autoClose: 2000,
      hideProgressBar: true,
      closeOnClick: true,
    });
  };

  return (
    <div className="bg-gray-100 min-h-screen py-8">
      <div className="max-w-4xl mx-auto px-4">
        <h2 className="text-2xl font-bold mb-4">Send Crypto</h2>
        <div className="bg-white p-6 rounded-md shadow-md mb-4">
          <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
            <input
              type="number"
              placeholder="Amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="border p-2 md:flex-grow"
            />
            <input
              type="text"
              placeholder="Wallet Address"
              value={walletAddress}
              onChange={(e) => setWalletAddress(e.target.value)}
              className="border p-2 md:flex-grow"
            />
            <button
              onClick={handleSend}
              className="bg-blue-500 text-white px-4 py-2 rounded"
            >
              Send
            </button>
          </div>
        </div>
        <div className="mt-8">
        <Card>
          <CardHeader>
            <CardTitle>Transaction History</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Transaction ID</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Wallet Address</TableHead>
                  <TableHead>Trx Time</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {transactions.map((transaction) => (
                  <TableRow key={transaction.id}>
                    <TableCell>{transaction.id}</TableCell>
                    <TableCell>{transaction.amount}</TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <div className="truncate w-28 sm:w-40">
                          {transaction.walletAddress}
                        </div>
                        <button
                          className="ml-2 text-blue-500 hover:underline focus:outline-none"
                          onClick={() =>
                            handleCopyToClipboard(transaction.walletAddress)
                          }
                        >
                          <FiCopy className="h-5 w-5" />
                        </button>
                      </div>
                    </TableCell>
                    <TableCell>{`${transaction.date} ${transaction.time}`}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
      </div>
    </div>
  );
}

export default Send;

"use client"
import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FiCopy } from "react-icons/fi";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useSession } from "next-auth/react"; 
import { useCurrentUser } from "@/hooks/use-current-user";
import { currentBTCBalance, currentETHBalance, currentUSDTBalance } from "@/lib/auth";
import { getUserById } from "@/data/user";
import { createTransaction } from "@/actions/transactions";
import { getUserTransactions } from "@/actions/getTransactions";

interface Transaction {
  id: number;
  date: Date;
  btc: boolean;
  usdt: boolean;
  eth: boolean;
  amount: number;
  walletAddress: string;
  userId: string;
}

function Send() {
  const [amount, setAmount] = useState<string>("");
  const [walletAddress, setWalletAddress] = useState<string>("");
  const [cryptoType, setCryptoType] = useState<string>("btc");
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [balances, setBalances] = useState({ btc: 0, usdt: 0, eth: 0 });
  const { data: session } = useSession();
  const [isLoading, setIsLoading] = useState(true);
  const user = useCurrentUser();

  const fetchBalances = async () => {
    if (session?.user?.id) {
      const updatedUser = await getUserById(session.user.id);
      if (updatedUser) {
        setBalances({
          btc: updatedUser.btc,
          usdt: updatedUser.usdt,
          eth: updatedUser.eth
        });
      }
    }
  };
  
  useEffect(() => {
    const fetchData = async () => {
      if (session?.user?.id) {
        await fetchBalances();
        await fetchTransactions();
      }
    };
    fetchData();
  }, [session]);
  
  const fetchTransactions = async () => {
    setIsLoading(true);
    const transactionResult = await getUserTransactions();
    if (transactionResult.success) {
      setTransactions(transactionResult.transactions);
    } else {
      toast.error(transactionResult.error || "Failed to fetch transactions");
    }
    setIsLoading(false);
  };

  const handleSend = async () => {
    if (!session?.user?.id || !user) {
      toast.error("User not authenticated");
      return;
    }
  
    if (amount && walletAddress) {
      const amountNumber = Number(amount);
      if (isNaN(amountNumber) || amountNumber <= 0) {
        toast.error("Please enter a valid amount");
        return;
      }
  
      if (
        (cryptoType === "btc" && amountNumber > user.btc) ||
        (cryptoType === "usdt" && amountNumber > user.usdt) ||
        (cryptoType === "eth" && amountNumber > user.eth)
      ) {
        toast.error("Amount exceeds available balance");
        return;
      }
  
      const result = await createTransaction({
        amount: amountNumber,
        walletAddress,
        cryptoType: cryptoType as 'btc' | 'usdt' | 'eth',
      });
      if (result.error) {
        toast.error(result.error);
      } else if (result.success) {
        toast.success(result.success);
        await fetchTransactions();
        setAmount("");
        setWalletAddress("");
        await fetchBalances();
      }
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
            <select
              value={cryptoType}
              onChange={(e) => setCryptoType(e.target.value)}
              className="border p-2 md:flex-grow"
            >
              <option value="btc">BTC - {user?.btc} $</option>
              <option value="usdt">USDT - {user?.usdt} $</option>
              <option value="eth">ETH - {user?.eth} $</option>
            </select> 
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
                    <TableHead>Crypto Type</TableHead>
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
                      <TableCell>{new Date(transaction.date).toLocaleString()}</TableCell>                      <TableCell>
                        {transaction.btc ? "BTC" : transaction.usdt ? "USDT" : "ETH"}
                      </TableCell>
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
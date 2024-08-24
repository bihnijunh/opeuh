"use client"
import { ExtendedUser } from "@/next-auth";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { CardTitle, CardHeader, CardContent, Card } from "@/components/ui/card";
import { usePathname } from 'next/navigation';
import { calculateTotal } from "@/lib/utils";
import { useEffect, useState } from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { ArrowUpIcon, ArrowDownIcon, RefreshCcw } from 'lucide-react';
import { getReceivedTransactions } from "@/actions/getReceivedTransactions";
import { getSentTransactions } from "@/actions/getSentTransactions";
import { Transaction } from "@/transaction-types";

interface UserInfoProps {
  user?: ExtendedUser;
}

interface ConversionRates {
  btc: number;
  usdt: number;
  eth: number;
}

interface ChartDataPoint {
  date: string;
  value: number;
}

const convertToCrypto = (usdAmount: number, rate: number) => (usdAmount / rate).toFixed(8);

export const UserInfo = ({ user }: UserInfoProps) => {
  const pathname = usePathname();
  const [conversionRates, setConversionRates] = useState<ConversionRates>({ btc: 0, usdt: 0, eth: 0 });
  const [chartData, setChartData] = useState<ChartDataPoint[]>([]);
  const [recentTransactions, setRecentTransactions] = useState<Transaction[]>([]);

  useEffect(() => {
    const fetchConversionRates = async () => {
      try {
        const response = await fetch("https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,tether&vs_currencies=usd");
        const data = await response.json();
        setConversionRates({
          btc: data.bitcoin.usd,
          eth: data.ethereum.usd,
          usdt: data.tether.usd,
        });
      } catch (error) {
        console.error("Error fetching conversion rates:", error);
      }
    };

    fetchConversionRates();
    generateMockChartData();
    fetchRecentTransactions();
  }, []);

  const generateMockChartData = () => {
    const data: ChartDataPoint[] = [];
    for (let i = 30; i >= 0; i--) {
      data.push({
        date: new Date(Date.now() - i * 24 * 60 * 60 * 1000).toISOString().slice(0, 10),
        value: Math.random() * 10000 + 5000,
      });
    }
    setChartData(data);
  };

  const fetchRecentTransactions = async () => {
    try {
      const receivedResult = await getReceivedTransactions(1, 5);
      const sentResult = await getSentTransactions(1, 5);
      
      if (receivedResult.success && sentResult.success) {
        const allTransactions: Transaction[] = [
          ...receivedResult.transactions.map((t: any) => ({
            ...t,
            type: 'received' as const,
          })),
          ...sentResult.transactions.map((t: any) => ({
            ...t,
            type: 'sent' as const,
          }))
        ];
        allTransactions.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        setRecentTransactions(allTransactions.slice(0, 5));
      }
    } catch (error) {
      console.error("Error fetching recent transactions:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      <header className="bg-white dark:bg-gray-800 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col sm:flex-row justify-between items-center">
          <Link className="flex items-center gap-2 text-gray-900 dark:text-gray-100 mb-4 sm:mb-0" href="#">
            <MountainIcon className="h-8 w-8 text-indigo-600" />
            <span className="text-xl font-bold text-gray-900 dark:text-gray-100">PIEDRA Dashboard</span>
          </Link>
          <div className="flex items-center gap-4">
            <Button asChild variant={pathname === "/receive" ? "default" : "outline"}>
              <Link href="/receive">Receive</Link>
            </Button>
            <Button asChild variant={pathname === "/send" ? "default" : "outline"}>
              <Link href="/send">Send</Link>
            </Button>
          </div>
        </div>
      </header>
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          <Card className="bg-white dark:bg-gray-800">
            <CardHeader>
              <CardTitle className="text-gray-900 dark:text-gray-100">Total Balance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                ${calculateTotal(Number(user?.btc) || 0, Number(user?.eth) || 0, Number(user?.usdt) || 0).toFixed(2)}
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Available balance</p>
            </CardContent>
          </Card>
          <CryptoCard title="BTC" amount={Number(user?.btc) || 0} rate={conversionRates.btc} />
          <CryptoCard title="ETH" amount={Number(user?.eth) || 0} rate={conversionRates.eth} />
          <CryptoCard title="USDT" amount={Number(user?.usdt) || 0} rate={conversionRates.usdt} />
        </div>
        <Card className="mt-8 bg-white dark:bg-gray-800">
          <CardHeader>
            <CardTitle className="text-gray-900 dark:text-gray-100">Balance History</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] sm:h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <XAxis dataKey="date" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `$${value}`} />
                  <Tooltip contentStyle={{ backgroundColor: 'rgba(0, 0, 0, 0.8)', color: '#fff' }} />
                  <Line type="monotone" dataKey="value" stroke="#8884d8" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        <div className="mt-8 grid gap-6 grid-cols-1 md:grid-cols-2">
          <Card className="bg-white dark:bg-gray-800">
            <CardHeader>
              <CardTitle className="text-gray-900 dark:text-gray-100">Recent Transactions</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-4">
                {recentTransactions.map((transaction) => (
                  <TransactionItem
                    key={transaction.id}
                    transaction={transaction}
                    userId={user?.id}
                  />
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

interface CryptoCardProps {
  title: string;
  amount: number;
  rate: number;
}

const CryptoCard = ({ title, amount, rate }: CryptoCardProps) => (
  <Card className="bg-white dark:bg-gray-800">
    <CardHeader>
      <CardTitle className="text-gray-900 dark:text-gray-100">{title}</CardTitle>
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">${amount.toFixed(2)}</div>
      <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
        {convertToCrypto(amount, rate)} {title}
      </p>
    </CardContent>
  </Card>
);

interface TransactionItemProps {
  transaction: Transaction;
  userId?: string;
}

const TransactionItem = ({ transaction, userId }: TransactionItemProps) => {
  const isReceived = transaction.recipientId === userId;
  const type = isReceived ? 'received' : 'sent';
  const address = isReceived ? transaction.senderAddress : transaction.walletAddress;
  const username = isReceived ? transaction.senderUsername : '';

  return (
    <li className="flex items-center justify-between py-2 border-b border-gray-200 dark:border-gray-700">
      <div className="flex items-center">
        {isReceived ? (
          <ArrowDownIcon className="h-5 w-5 text-green-500 dark:text-green-400 mr-2" />
        ) : (
          <ArrowUpIcon className="h-5 w-5 text-red-500 dark:text-red-400 mr-2" />
        )}
        <div>
          <p className="font-medium text-gray-900 dark:text-gray-100">
            {type === 'received' ? 'Received' : 'Sent'} {transaction.amount} {transaction.cryptoType}
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400">{new Date(transaction.date).toLocaleDateString()}</p>
          <p className="text-xs text-gray-400 dark:text-gray-500">{username || address}</p>
        </div>
      </div>
      <RefreshCcw className="h-5 w-5 text-gray-400 dark:text-gray-500" />
    </li>
  );
};

function MountainIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m8 3 4 8 5-5 5 15H2L8 3z" />
    </svg>
  );
}
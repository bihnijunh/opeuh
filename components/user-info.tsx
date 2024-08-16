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

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      <header className="bg-white dark:bg-gray-800 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <Link className="flex items-center gap-2" href="#">
            <MountainIcon className="h-8 w-8 text-indigo-600" />
            <span className="text-xl font-bold text-gray-900 dark:text-white">PIEDRA Dashboard</span>
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
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader>
              <CardTitle>Total Balance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">
                ${calculateTotal(Number(user?.btc) || 0, Number(user?.eth) || 0, Number(user?.usdt) || 0).toFixed(2)}
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Available balance</p>
            </CardContent>
          </Card>
          <CryptoCard title="BTC" amount={Number(user?.btc) || 0} rate={conversionRates.btc} />
          <CryptoCard title="ETH" amount={Number(user?.eth) || 0} rate={conversionRates.eth} />
          <CryptoCard title="USDT" amount={Number(user?.usdt) || 0} rate={conversionRates.usdt} />
        </div>
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Balance History</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="value" stroke="#8884d8" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        <div className="mt-8 grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Recent Transactions</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-4">
                <TransactionItem type="received" amount={0.05} currency="BTC" date="2023-06-15" />
                <TransactionItem type="sent" amount={100} currency="USDT" date="2023-06-14" />
                <TransactionItem type="received" amount={0.5} currency="ETH" date="2023-06-13" />
              </ul>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <Button>Buy Crypto</Button>
                <Button>Sell Crypto</Button>
                <Button>Swap Tokens</Button>
                <Button>View History</Button>
              </div>
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
  <Card>
    <CardHeader>
      <CardTitle>{title}</CardTitle>
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold">${amount.toFixed(2)}</div>
      <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
        {convertToCrypto(amount, rate)} {title}
      </p>
    </CardContent>
  </Card>
);

interface TransactionItemProps {
  type: 'received' | 'sent';
  amount: number;
  currency: string;
  date: string;
}

const TransactionItem = ({ type, amount, currency, date }: TransactionItemProps) => (
  <li className="flex items-center justify-between">
    <div className="flex items-center">
      {type === 'received' ? (
        <ArrowDownIcon className="h-5 w-5 text-green-500 mr-2" />
      ) : (
        <ArrowUpIcon className="h-5 w-5 text-red-500 mr-2" />
      )}
      <div>
        <p className="font-medium">{type === 'received' ? 'Received' : 'Sent'} {amount} {currency}</p>
        <p className="text-sm text-gray-500">{date}</p>
      </div>
    </div>
    <RefreshCcw className="h-5 w-5 text-gray-400" />
  </li>
);

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
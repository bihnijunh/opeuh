"use client"
import { ExtendedUser } from "@/next-auth";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { CardTitle, CardHeader, CardContent, Card } from "@/components/ui/card";
import { usePathname } from 'next/navigation';
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
  const [recentTransactions, setRecentTransactions] = useState<any[]>([]);

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
                ${0.00}
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Available balance</p>
            </CardContent>
          </Card>
          <CryptoCard title="BTC" amount={0} rate={conversionRates.btc} />
          <CryptoCard title="ETH" amount={0} rate={conversionRates.eth} />
          <CryptoCard title="USDT" amount={0} rate={conversionRates.usdt} />
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
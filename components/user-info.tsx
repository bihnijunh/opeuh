import { Badge } from "@/components/ui/badge";
import { User } from "next-auth";
import { ExtendedUser } from "@/next-auth";

import { Libre_Franklin } from 'next/font/google';
import { Chivo } from 'next/font/google';
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { CardTitle, CardHeader, CardContent, Card } from "@/components/ui/card";
import { usePathname } from 'next/navigation';
import { calculateTotal } from "@/lib/utils";
import { useEffect, useState } from "react";

const libreFranklin = Libre_Franklin({
  subsets: ['latin'],
  display: 'swap',
});

const chivo = Chivo({
  subsets: ['latin'],
  display: 'swap',
});

interface UserInfoProps {
  user?: ExtendedUser;
  
}

export const UserInfo = ({ user,  }: UserInfoProps) => {
  const pathname = usePathname();
  const [conversionRates, setConversionRates] = useState({ btc: 0, usdt: 0, eth: 0 });
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
  }, []);

  const convertToCrypto = (usdAmount: number, rate: number) => (usdAmount / rate).toFixed(8);



 
 
  return (
    <div className="flex min-h-screen flex-col">
      <header className="flex h-16 items-center justify-between border-b bg-gray-100 px-6 dark:border-gray-800 dark:bg-gray-950">
        <Link className="flex items-center gap-2" href="#">
          <MountainIcon className="h-6 w-6" />
          <span className="text-lg font-semibold">PIEDRA Dashboard</span>
        </Link>
        
        
        <div className="flex items-center gap-2">
          <Button
            asChild
            variant={pathname === "/recieve" ? "default" : "outline"}
          >
            <Link href="/recieve">Recieve</Link>
          </Button>
        </div>
      </header>
      <main className="flex-1 bg-gray-100 px-4 py-8 dark:bg-gray-950 md:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl space-y-8">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle>Total</CardTitle>
              </CardHeader>
              <CardContent className="flex items-center justify-between">
                <div>
                  <p className="text-4xl font-semibold">  
                  {calculateTotal(Number(user?.btc) || 0, Number(user?.eth) || 0, Number(user?.usdt) || 0)} $                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Available balance</p>
                </div>
                
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>BTC</CardTitle>
              </CardHeader>
              <CardContent className="flex items-center justify-between">
                <div>
                  <p className="text-4xl font-semibold"> {Number(user?.btc) || '0'} $</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{convertToCrypto(Number(user?.btc) || 0, conversionRates.btc)} BTC</p>
                </div>
               
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>USDT</CardTitle>
              </CardHeader>
              <CardContent className="flex items-center justify-between">
                <div>
                  <p className="text-4xl font-semibold"> {Number(user?.usdt) || '0'} $</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{convertToCrypto(Number(user?.usdt) || 0, conversionRates.usdt)} USDT</p>
                </div>
                
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>ETH</CardTitle>
              </CardHeader>
              <CardContent className="flex items-center justify-between">
                <div>
                  <p className="text-4xl font-semibold"> {Number(user?.eth) || '0'} $</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{convertToCrypto(Number(user?.eth) || 0, conversionRates.eth)} ETH</p>
                </div>
               
              </CardContent>
            </Card>
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle>Recent Transactions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-3 items-center gap-2">
                  <div className="flex items-center gap-2">
                    <div className="h-8 w-8 rounded-full bg-gray-200 dark:bg-gray-800" />
                    <span className="text-sm font-medium">Amazon</span>
                  </div>
                  <span className="text-sm text-gray-500 dark:text-gray-400">Jun 23</span>
                  <span className="text-sm font-medium text-red-500">-$45.99</span>
                </div>
                <div className="grid grid-cols-3 items-center gap-2">
                  <div className="flex items-center gap-2">
                    <div className="h-8 w-8 rounded-full bg-gray-200 dark:bg-gray-800" />
                    <span className="text-sm font-medium">Rent</span>
                  </div>
                  <span className="text-sm text-gray-500 dark:text-gray-400">Jun 1</span>
                  <span className="text-sm font-medium text-red-500">-$1,200.00</span>
                </div>
                <div className="grid grid-cols-3 items-center gap-2">
                  <div className="flex items-center gap-2">
                    <div className="h-8 w-8 rounded-full bg-gray-200 dark:bg-gray-800" />
                    <span className="text-sm font-medium">Paycheck</span>
                  </div>
                  <span className="text-sm text-gray-500 dark:text-gray-400">Jun 15</span>
                  <span className="text-sm font-medium text-green-500">+$3,500.00</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};



function MountainIcon(props: any) {
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

function SignalIcon(props: any) {
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
      <path d="M2 20h.01" />
      <path d="M7 20v-4" />
      <path d="M12 20v-8" />
      <path d="M17 20V8" />
      <path d="M22 4v16" />
    </svg>
  );
}
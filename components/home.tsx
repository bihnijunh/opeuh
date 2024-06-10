"use client";

import { Button } from "@/components/ui/button";
import {
  SelectValue,
  SelectTrigger,
  SelectItem,
  SelectContent,
  Select,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { CardTitle, CardHeader, CardContent, Card } from "@/components/ui/card";
import {
  TableHead,
  TableRow,
  TableHeader,
  TableCell,
  TableBody,
  Table,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { currentUser } from "@/lib/auth";
import { getUserById } from "@/data/user";
import { ExtendedUser } from "@/next-auth";
import { BalanceCard } from "@/components/balance-ui";
import { PrismaClient } from "@prisma/client";
import { useSession } from "next-auth/react";

export default function Component() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const [user, setUser] = useState<ExtendedUser | null>(null);

  useEffect(() => {
    if (session?.user) {
      getUserById(session.user.id).then(setUser);
    }
  }, [session]);
 
  return (
    <>
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      <header className="bg-white dark:bg-gray-800 shadow-sm py-4 px-6">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-semibold">Crypto Exchange</h1>
          <div className="flex items-center gap-4">
            <Button
              asChild
              variant={pathname === "/recieve" ? "default" : "outline"}
            >
              <Link href="/recieve">Recieve</Link>
            </Button>{" "}
          </div>
        </div>
      </header>
      <main className="p-6">
      <div>
        <BalanceCard />
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
                    <TableHead>Date</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Cryptocurrency</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell>2024-01-01</TableCell>
                    <TableCell>Buy</TableCell>
                    <TableCell>Bitcoin</TableCell>
                    <TableCell>0.1 BTC</TableCell>
                    <TableCell>Completed</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>2024-01-02</TableCell>
                    <TableCell>Sell</TableCell>
                    <TableCell>Ethereum</TableCell>
                    <TableCell>0.5 ETH</TableCell>
                    <TableCell>Completed</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>2024-01-03</TableCell>
                    <TableCell>Buy</TableCell>
                    <TableCell>Litecoin</TableCell>
                    <TableCell>1 LTC</TableCell>
                    <TableCell>Pending</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
    </>
  );
}
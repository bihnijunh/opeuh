import AdminUsersPage from "./AdminUser";
import { db } from "@/lib/db";
import { UserWithTransactions } from "@/transaction-types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { UserIcon, DollarSignIcon, ActivityIcon } from "lucide-react";
import Link from 'next/link';
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default async function AdminPage() {
  const users = await db.user.findMany({
    take: 10,
    orderBy: { id: 'desc' },
    include: { transactions: true }
  });

  const totalUsers = await db.user.count();
  const totalPages = Math.ceil(totalUsers / 10);

  const totalTransactions = await db.transaction.count();
  const totalBTC = await db.user.aggregate({
    _sum: { btc: true }
  });
  const totalUSDT = await db.user.aggregate({
    _sum: { usdt: true }
  });
  const totalETH = await db.user.aggregate({
    _sum: { eth: true }
  });

  const usersWithTransactions: UserWithTransactions[] = users.map(user => ({
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    btc: user.btc || 0,
    usdt: user.usdt || 0,
    eth: user.eth || 0,
    transactions: user.transactions.map(t => ({
      id: t.id,
      date: t.date,
      btc: t.btc,
      usdt: t.usdt,
      eth: t.eth,
      amount: t.amount,
      walletAddress: t.walletAddress,
      transactionId: t.transactionId,
      status: t.status,
      userId: t.userId,
    })),
  }));

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>
      <Tabs defaultValue="users" className="mb-8">
        <TabsList>
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="bank-accounts" asChild>
            <Link href="/admin/bank-accounts">Bank Accounts</Link>
          </TabsTrigger>
        </TabsList>
      </Tabs>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <UserIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalUsers}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Transactions</CardTitle>
            <ActivityIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalTransactions}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total BTC</CardTitle>
            <DollarSignIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalBTC._sum.btc?.toFixed(8) || '0'}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total USDT</CardTitle>
            <DollarSignIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalUSDT._sum.usdt?.toFixed(2) || '0'}</div>
          </CardContent>
        </Card>
      </div>
      <AdminUsersPage initialUsers={usersWithTransactions} totalPages={totalPages} />
    </div>
  );
}
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CryptoSellTransactionsTable } from "./CryptoSellTransactionsTable";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Link from "next/link";

export default function CryptoSellTransactionsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">User Bank Withdrawal Dashboard</h1>
      <Tabs defaultValue="crypto-sell-transactions" className="mb-8">
        <TabsList>
          <TabsTrigger value="users" asChild>
            <Link href="/admin">Users</Link>
          </TabsTrigger>
          <TabsTrigger value="bank-accounts" asChild>
            <Link href="/admin/bank-accounts">Bank Accounts</Link>
          </TabsTrigger>
          <TabsTrigger value="crypto-sell-transactions">Crypto Sell Transactions</TabsTrigger>
        </TabsList>
      </Tabs>      
      <Card>
        <CardHeader>
          <CardTitle>All Sell Transactions</CardTitle>
        </CardHeader>
        <CardContent>
          <CryptoSellTransactionsTable />
        </CardContent>
      </Card>
    </div>
  );
}
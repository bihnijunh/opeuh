import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getAdminCryptoSellTransactions } from "@/actions/cryptoSellTransaction";
import { columns } from "./columns";
import { DataTable } from "@/components/ui/data-table";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Link from "next/link";

export default async function C() {
  const result = await getAdminCryptoSellTransactions();

  return (
    <div className="container mx-auto px-4 py-8">
 <h1 className="text-3xl font-bold mb-8">User Bank Withdrawal Dashboard</h1>
      <Tabs defaultValue="users" className="mb-8">
        <TabsList>
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="bank-accounts" asChild>
            <Link href="/admin/bank-accounts">Bank Accounts</Link>
          </TabsTrigger>
          <TabsTrigger value="crypto-sell-transactions" asChild>
            <Link href="/admin/crypto-sell-transactions">Crypto Sell Transactions</Link>
          </TabsTrigger>
        </TabsList>
      </Tabs>      
      <Card>
        <CardHeader>
          <CardTitle>All Sell Transactions</CardTitle>
        </CardHeader>
        <CardContent>
          {result.error ? (
            <p className="text-red-500">{result.error}</p>
          ) : (
            <DataTable columns={columns} data={result.transactions ?? []} />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
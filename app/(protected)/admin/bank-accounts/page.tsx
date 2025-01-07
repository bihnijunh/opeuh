'use client';

import { useBankAccounts } from '@/hooks/use-bank-accounts';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from "@/lib/utils";

const AdminTab = ({ href, isActive, children }: { href: string; isActive: boolean; children: React.ReactNode }) => (
  <Link
    href={href}
    className={cn(
      "inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
      isActive
        ? "bg-background text-foreground shadow-sm"
        : "text-muted-foreground hover:text-foreground"
    )}
  >
    {children}
  </Link>
);

export default function BankAccountsPage() {
  const { 
    bankAccounts, 
    loading, 
    error, 
    handleAddBankAccount, 
    handleDelete 
  } = useBankAccounts();

  const pathname = usePathname();

  if (error) return <div>Error: {error}</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl md:text-3xl font-bold mb-6 md:mb-8">Admin Dashboard</h1>
      
      <div className="mb-6 md:mb-8 overflow-x-auto">
        <div className="inline-flex h-10 items-center justify-center rounded-md bg-muted p-1 text-muted-foreground">
          <AdminTab href="/admin" isActive={pathname === '/admin'}>
            Users
          </AdminTab>
          
          <AdminTab href="/admin/flights" isActive={false}>
            Create Flights
          </AdminTab>
          <AdminTab href="/admin/booked-flights" isActive={false}>
            Booked Flights
          </AdminTab>
          <AdminTab href="/admin/flight-status" isActive={false}>
            Flight Status
          </AdminTab>
          <AdminTab href="/admin/payment-methods" isActive={false}>
            Payment Methods
          </AdminTab>
        </div>
      </div>

      <Card className="w-full max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle>Manage Bank Accounts</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={(e) => {
            e.preventDefault();
            handleAddBankAccount(new FormData(e.currentTarget as HTMLFormElement));
          }} className="mb-8 space-y-4">
            <Input type="text" name="bankName" placeholder="Bank Name" required />
            <Input type="text" name="accountName" placeholder="Account Name" required />
            <Input type="text" name="accountNumber" placeholder="Account Number" required />
            <Button type="submit">Add Bank Account</Button>
          </form>

          <div className="space-y-4">
            {bankAccounts.map((account) => (
              <div key={account.id} className="border p-4 rounded">
                <p><strong>Bank:</strong> {account.bankName}</p>
                <p><strong>Account Name:</strong> {account.accountName}</p>
                <p><strong>Account Number:</strong> {account.accountNumber}</p>
                <p><strong>Status:</strong> {account.status}</p>
                <div className="mt-2 space-x-2">
                  <Button
                    onClick={() => handleDelete(account.id)}
                    variant="destructive"
                  >
                    Delete
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
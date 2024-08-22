'use client';

import { useBankAccounts } from '@/hooks/use-bank-accounts';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function BankAccountsPage() {
  const { 
    bankAccounts, 
    loading, 
    error, 
    handleAddBankAccount, 
    handleDelete 
  } = useBankAccounts();

  
  if (error) return <div>Error: {error}</div>;

  return (
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
  );
}
'use server'

import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";

export async function getBankAccounts() {
  const accounts = await db.bankAccount.findMany({
    orderBy: { id: 'desc' },
  });

  return accounts;
}

export async function addBankAccount(formData: FormData) {
  const bankName = formData.get('bankName') as string;
  const accountName = formData.get('accountName') as string;
  const accountNumber = formData.get('accountNumber') as string;

  const newAccount = await db.bankAccount.create({
    data: {
      bankName,
      accountName,
      accountNumber,
    },
  });

  revalidatePath('/admin/bank-accounts');
  return newAccount;
}



export async function deleteBankAccount(id: string) {
  await db.bankAccount.delete({
    where: { id },
  });

  revalidatePath('/admin/bank-accounts');
}
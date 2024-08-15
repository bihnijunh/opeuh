import AdminUsersPage from "./AdminUser";
import { db } from "@/lib/db";
import { UserWithTransactions } from "@/transaction-types";

export default async function AdminPage() {
  const users = await db.user.findMany({
    take: 10,
    orderBy: { id: 'desc' },
    include: { transactions: true }
  });

  const totalUsers = await db.user.count();
  const totalPages = Math.ceil(totalUsers / 10);

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

  return <AdminUsersPage initialUsers={usersWithTransactions} totalPages={totalPages} />;
}
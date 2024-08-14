import AdminUsersPage from "./AdminUser";
import { db } from "@/lib/db";
import { getAccountByUserId } from "@/data/account";
import { ExtendedUser } from "@/next-auth";

export default async function AdminPage() {
  const users = await db.user.findMany({
    take: 10,
    orderBy: { id: 'desc' }
  });

  const extendedUsers: ExtendedUser[] = await Promise.all(users.map(async (user) => {
    const account = await getAccountByUserId(user.id);
    const transactions = await db.transaction.findMany({ where: { userId: user.id } });
    return {
      ...user,
      isOAuth: !!account,
      transactions
    } as ExtendedUser;
  }));

  const totalUsers = await db.user.count();
  const totalPages = Math.ceil(totalUsers / 10);

  return <AdminUsersPage initialUsers={extendedUsers} totalPages={totalPages} />;
}
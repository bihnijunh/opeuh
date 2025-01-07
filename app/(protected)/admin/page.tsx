import { db } from "@/lib/db";
import AdminPageClient from "./client-page";

export default async function AdminPage() {
  const users = await db.user.findMany({
    take: 10,
    orderBy: { id: 'desc' }
  });

  const totalUsers = await db.user.count();

  return <AdminPageClient users={users} totalUsers={totalUsers} />;
}

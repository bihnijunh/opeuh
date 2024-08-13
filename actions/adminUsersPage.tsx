import AdminUsersPage from "@/app/(protected)/admin/AdminUser";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { UserRole } from "@prisma/client";

const AdminUsersPageServer = async () => {
    const session = await auth();
    
    if (!session?.user?.id || session.user.role !== UserRole.ADMIN) {
      console.log("Unauthorized access attempt. User role:", session?.user?.role);
      return <div>Unauthorized</div>;
    }

  const users = await db.user.findMany({
    take: 10,
    orderBy: { id: "desc" },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
    },
  });

  const total = await db.user.count();

  return <AdminUsersPage initialUsers={users} totalPages={Math.ceil(total / 10)} />;
};

export default AdminUsersPageServer;
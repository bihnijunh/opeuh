"use client";

import { Button } from "@/components/ui/button";
import {
  SelectValue,
  SelectTrigger,
  SelectItem,
  SelectContent,
  Select,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { CardTitle, CardHeader, CardContent, Card } from "@/components/ui/card";
import {
  TableHead,
  TableRow,
  TableHeader,
  TableCell,
  TableBody,
  Table,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { currentUser } from "@/lib/auth";

import { ExtendedUser, UserWithBalance } from "@/next-auth";
import { PrismaClient } from "@prisma/client";
import { useSession } from "next-auth/react";
import { getUserById } from "@/data/user";
import BalanceFace from "@/components/ui/balnFace";
import { UserInfo } from "@/components/user-info";
import { useCurrentUser } from "@/hooks/use-current-user";

export default function Component() {
  const pathname = usePathname();
  const { data: session } = useSession();
 const user = useCurrentUser();

 const [loading, setLoading] = useState(true);
 const [currentUser, setCurrentUser] = useState<ExtendedUser | null>(null);


 useEffect(() => {
  if (session?.user) {
    getUserById(session.user.id)
      .then((data) => {
        setCurrentUser(data);
        setLoading(false); // Move it here
      })
      .catch((error) => {
        console.error("Error fetching user data:", error);
        setLoading(false);
      });
  } else {
    setLoading(false);
  }
}, [session]);

if (loading) {
  return <div>Loading...</div>;
}
  return (
    <>
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      <header className="bg-white dark:bg-gray-800 shadow-sm py-4 px-6">
       
      </header>
      <main className="p-6">
      <div className="flex items-center gap-4">
    <UserInfo 
    user={user} />
   
      </div>
      <div>
    
      </div>

      
      </main>
    </div>
    </>
  );
}
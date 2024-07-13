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
import { Skeleton } from "@/components/ui/skeleton";
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
          setLoading(false);
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
    return <div className="flex min-h-[100dvh] flex-col items-center justify-center bg-background">
    <div className="space-y-4 text-center">
      <Skeleton className="h-12 w-12 rounded-full" />
      <div className="space-y-2">
        <Skeleton className="h-4 w-[200px]" />
        <Skeleton className="h-4 w-[150px]" />
      </div>
    </div>
  </div>;
  }

  return (
    <>
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
        <main className="p-6 flex flex-col items-center">
          <div className="flex flex-col items-center gap-4 w-full max-w-4xl">
            <UserInfo user={user} />
          </div>
        </main>
      </div>
    </>
  );
}
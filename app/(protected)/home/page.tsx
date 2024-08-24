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
import { useLoading } from "@/components/contexts/LoadingContext";
import { Playfair_Display } from 'next/font/google';
import AdvertisingSection from "@/components/advertising-section";

const playfair = Playfair_Display({ subsets: ['latin'] });

export default function Component() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const user = useCurrentUser();
  const { isLoading, setIsLoading } = useLoading();

  useEffect(() => {
    if (session?.user) {
      getUserById(session.user.id)
        .then((data) => {
          setIsLoading(false);
        })
        .catch((error) => {
          console.error("Error fetching user data:", error);
          setIsLoading(false);
        });
    } else {
      setIsLoading(false);
    }
  }, [session, setIsLoading]);

  if (isLoading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-gray-100 dark:bg-gray-900">
        <div className="space-y-4 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 dark:border-blue-400"></div>
          <div className="text-blue-500 dark:text-blue-400">Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 transition-colors duration-200">
      <main className="px-4 sm:px-6 py-8 flex flex-col items-center">
        <h1 className={`${playfair.className} text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-center mb-6 sm:mb-8 text-gray-800 dark:text-gray-100`}>
          Welcome back, {user?.name || 'User'}
        </h1>
        <div className="flex flex-col items-center gap-6 w-full max-w-4xl">
          <Card className="w-full bg-white dark:bg-gray-800 shadow-lg transition-all duration-200">
            <CardContent className="p-4 sm:p-6">
              <UserInfo user={user} />
            </CardContent>
          </Card>
          <Card className="w-full bg-white dark:bg-gray-800 shadow-lg transition-all duration-200">
            <CardContent className="p-4 sm:p-6">
              <AdvertisingSection />
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
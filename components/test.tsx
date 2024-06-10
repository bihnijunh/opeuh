import React, { useEffect, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";

export const BalanceCard = () => {
  

  return (
    <Tabs defaultValue="overview" className="space-y-4">
      <TabsList>
        <TabsTrigger value="overview">Overview</TabsTrigger>
      </TabsList>
      <TabsContent value="overview" className="space-y-4">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Balance
              </CardTitle>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                className="h-4 w-4 text-muted-foreground"
              >
                <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
              </svg>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                $ 0
                
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">USDT</CardTitle>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                className="h-4 w-4 text-muted-foreground"
              >
                <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
              </svg>
            </CardHeader>
            <CardContent>
            <div className="text-2xl font-bold">
                $ 0
               
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">BTC</CardTitle>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                className="h-4 w-4 text-muted-foreground"
              >
                <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
              </svg>
            </CardHeader>
            <CardContent>
            <div className="text-2xl font-bold">
                $ 0
               
              </div>
            </CardContent>
          </Card>
        </div>
      </TabsContent>
    </Tabs>
  );
};



// pages/api/balance.ts

import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    const { userId } = req.query;

    if (!userId) {
      return res.status(400).json({ error: 'Missing user ID' });
    }

    try {
      const balance = await prisma.balance.findUnique({
        where: { userId: userId as string },
      });

      if (!balance) {
        return res.status(404).json({ error: 'Balance not found' });
      }

      return res.status(200).json(balance);
    } catch (error) {
      return res.status(500).json({ error: 'Something went wrong' });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}



import { db } from "@/lib/db";
import { Balance, UserRole } from "@prisma/client";
import { User } from "next-auth";

interface UserWithBalance extends User {
  id: string;
  name: string | null;
  email: string | null;
  emailVerified: Date | null;
  image: string | null;
  password: string | null;
  role: UserRole;
  isTwoFactorEnabled: boolean;
  isOAuth: boolean;
  balance: Balance | null;
}



export const getUserByEmail = async (email: string) => {
  try {
    const user = await db.user.findUnique({
      where: { email },
      include: { balance: true },
    });

    return user;
  } catch {
    return null;
  }
};
export const getUserById = async (id: string): Promise<UserWithBalance | null> => {
  try {
    const userWithBalance = await db.user.findUnique({
      where: { id },
      include: { balance: true },
    });

    return userWithBalance as UserWithBalance; // Add type assertion
  } catch (error) {
    console.error("Error fetching user with balance:", error);
    return null;
  }
};

interface UserWithBalance extends User {
  id: string;
  name: string | null;
  email: string | null;
  emailVerified: Date | null;
  image: string | null;
  password: string | null;
  role: UserRole;
  isTwoFactorEnabled: boolean;
  isOAuth: boolean; // Add the missing property
  balance: Balance | null;
}




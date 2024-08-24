import React from 'react';
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FiUser, FiGift, FiCalendar } from 'react-icons/fi';

async function getReferrals() {
  const session = await auth();
  if (!session?.user?.email) return [];

  const user = await db.user.findUnique({
    where: { email: session.user.email },
    include: {
      referralRewards: {
        include: {
          referrer: true,
        },
        orderBy: {
          createdAt: 'desc',
        },
      },
    },
  });

  return user?.referralRewards || [];
}

export default async function ReferralsPage() {
  const referrals = await getReferrals();

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Your Referrals</CardTitle>
        </CardHeader>
        <CardContent>
          {referrals.length === 0 ? (
            <p className="text-center text-gray-500 dark:text-gray-400 py-8">You haven&apos;t referred anyone yet.</p>
          ) : (
            <ul className="space-y-4">
              {referrals.map((referral) => (
                <li key={referral.id} className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 transition-all hover:shadow-md">
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <div className="flex items-center space-x-2">
                      <FiUser className="text-blue-500" />
                      <p className="font-semibold">{referral.referrer.name}</p>
                    </div>
                    <Badge variant="secondary" className="text-sm">
                      <FiGift className="mr-1" />
                      Reward: {referral.rewardAmount}
                    </Badge>
                  </div>
                  <div className="mt-2 text-sm text-gray-500 dark:text-gray-400 flex items-center">
                    <FiCalendar className="mr-1" />
                    {new Date(referral.createdAt).toLocaleDateString()}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
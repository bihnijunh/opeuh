import React from 'react';
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FiUser, FiGift, FiCalendar } from 'react-icons/fi';
import { ReferralCode } from "@/components/ReferralCode";
import { UseReferralCode } from "@/components/UseReferralCode";

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
      <Card className="mb-8 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-lg transition-colors duration-200">
        <CardHeader className="border-b border-gray-200 dark:border-gray-700">
          <CardTitle className="text-2xl font-bold text-gray-900 dark:text-gray-100">Referral System</CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="space-y-6">
            <ReferralCode />
            <UseReferralCode />
          </div>
        </CardContent>
      </Card>

      <Card className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-lg transition-colors duration-200">
        <CardHeader className="border-b border-gray-200 dark:border-gray-700">
          <CardTitle className="text-2xl font-bold text-gray-900 dark:text-gray-100">Your Referrals</CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          {referrals.length === 0 ? (
            <p className="text-center text-gray-500 dark:text-gray-400 py-8">You haven&apos;t referred anyone yet.</p>
          ) : (
            <ul className="space-y-4">
              {referrals.map((referral) => (
                <li key={referral.id} className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-600 transition-all duration-200 hover:shadow-md hover:bg-gray-100 dark:hover:bg-gray-600">
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <div className="flex items-center space-x-2">
                      <FiUser className="text-blue-600 dark:text-blue-400" />
                      <p className="font-semibold text-gray-900 dark:text-gray-100">{referral.referrer.name}</p>
                    </div>
                    <Badge variant="secondary" className="text-sm bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200">
                      <FiGift className="mr-1" />
                      Reward: {referral.rewardAmount}
                    </Badge>
                  </div>
                  <div className="mt-2 text-sm text-gray-600 dark:text-gray-300 flex items-center">
                    <FiCalendar className="mr-1 text-gray-500 dark:text-gray-400" />
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
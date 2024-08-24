import React from 'react';
import { auth } from "@/auth";
import { db } from "@/lib/db";

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
      },
    },
  });

  return user?.referralRewards || [];
}

export default async function ReferralsPage() {
  const referrals = await getReferrals();

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-4">Your Referrals</h1>
      {referrals.length === 0 ? (
        <p>You haven&apos;t referred anyone yet.</p>
      ) : (
        <ul className="space-y-4">
          {referrals.map((referral) => (
            <li key={referral.id} className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
              <p className="font-semibold">{referral.referrer.name} activated your referral code</p>
              <p className="text-sm text-gray-500">Reward Amount: {referral.rewardAmount}</p>
              <p className="text-sm text-gray-500">Registered on : {new Date(referral.createdAt).toLocaleDateString()}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
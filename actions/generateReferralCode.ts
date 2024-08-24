'use server'

import { auth } from "@/auth";
import { db } from "@/lib/db";

export async function generateReferralCode() {
  try {
    const session = await auth();

    if (!session?.user?.email) {
      return { error: "Unauthorized" };
    }

    const user = await db.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return { error: "User not found" };
    }

    if (user.referralCode) {
      return { referralCode: user.referralCode };
    }

    let referralCode;
    let isUnique = false;

    while (!isUnique) {
      referralCode = generateUniqueCode();
      const existingUser = await db.user.findFirst({
        where: { referralCode },
      });
      if (!existingUser) {
        isUnique = true;
      }
    }

    const updatedUser = await db.user.update({
      where: { id: user.id },
      data: { referralCode },
    });

    return { referralCode: updatedUser.referralCode };
  } catch (error) {
    console.error("Error generating referral code:", error);
    return { error: "Failed to generate referral code" };
  }
}

function generateUniqueCode(): string {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  const codeLength = 8;
  let code = '';
  for (let i = 0; i < codeLength; i++) {
    code += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return code;
}
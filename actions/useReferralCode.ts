import { auth } from "@/auth";
import {db} from "@/lib/db";

export const applyReferralCode = async (referralCode: string) => {
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

    if (user.referredBy) {
      return { error: "You have already used a referral code" };
    }

    const referrer = await db.user.findUnique({
      where: { referralCode },
    });

    if (!referrer) {
      return { error: "Invalid referral code" };
    }

    if (referrer.id === user.id) {
      return { error: "You cannot use your own referral code" };
    }

    // Update the user with the referral information
    await db.user.update({
      where: { id: user.id },
      data: { referredBy: referrer.id },
    });

    // Create a new referral record
    await db.referral.create({
      data: {
        referrerId: referrer.id,
        referredUserId: user.id,
        rewardAmount: 10, // You can adjust this value as needed
      },
    });

    return { success: true, message: "Referral code applied successfully" };
  } catch (error) {
    console.error("Error using referral code:", error);
    return { error: "Failed to apply referral code" };
  }
}
'use server'

import { db } from "@/lib/db"
import { currentUser } from "@/lib/auth"

export async function getUserBalanceAndLimit() {
  try {
    const user = await currentUser()

    if (!user || !user.id) {
      console.error("Unauthorized: User not found or missing ID")
      return { error: "Unauthorized" }
    }

    const [dashboardData, accountDetails] = await Promise.all([
      db.dashboardData.findUnique({
        where: { userId: user.id },
        select: { totalBalance: true }
      }),
      db.accountDetails.findUnique({
        where: { userId: user.id },
        select: { accountLimit: true }
      })
    ])

    if (!dashboardData || !accountDetails) {
      console.error(`Data not found for user ${user.id}`)
      return { error: "User data not found" }
    }

    return {
      balance: dashboardData.totalBalance,
      limit: accountDetails.accountLimit
    }
  } catch (error) {
    console.error("Error in getUserBalanceAndLimit:", error)
    return { error: "Failed to fetch user balance and limit" }
  }
}
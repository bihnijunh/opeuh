'use server'

import { db } from "@/lib/db"
import { auth } from "@/auth"

type DashboardData = {
  totalBalance: number;
  loanBalance: number;
  wireTransfer: number;
  domesticTransfer: number;
}

type DashboardDataResult = DashboardData | { error: string };

export async function getDashboardData(): Promise<DashboardDataResult> {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      return { error: "Not authenticated" };
    }

    const userId = session.user.id;

    if (!db || !db.dashboardData) {
      console.error("Database or dashboardData model not properly initialized")
      return { error: "Database error" };
    }

    const dashboardData = await db.dashboardData.findUnique({
      where: { userId },
    })

    if (!dashboardData) {
      // Return default data if no entry exists
      return getDefaultDashboardData();
    }

    return dashboardData as DashboardData
  } catch (error) {
    console.error("Error fetching dashboard data:", error)
    return { error: "An unexpected error occurred" };
  }
}

function getDefaultDashboardData(): DashboardData {
  return {
    totalBalance: 0,
    loanBalance: 0,
    wireTransfer: 0,
    domesticTransfer: 0,
  }
}
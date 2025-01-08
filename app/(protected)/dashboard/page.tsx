'use client'

import { useCurrentUser } from "@/hooks/use-current-user"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Navbar } from "@/app/(protected)/_components/navbar"
import { Toaster } from 'sonner'

export default function DashboardComponent() {
  const user = useCurrentUser()

  return (
    <>
      <Navbar />
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">Welcome, {user?.name}!</h1>
        <div className="grid gap-4">
          <Card>
            <CardHeader>
              <CardTitle>Flight Booking Dashboard</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Start booking your flights and manage your travel plans here.</p>
            </CardContent>
          </Card>
        </div>
      </div>
      <Toaster />
    </>
  )
}

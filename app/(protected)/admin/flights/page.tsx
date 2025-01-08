"use client";

import React from "react";
import { usePathname } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AdminTab } from "../../_components/AdminTab";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { FlightsTable } from "./FlightsTable";

export default function FlightsPage() {
  const pathname = usePathname();
  const router = useRouter();

  return (
    <div className="p-6 space-y-8">
      <div className="overflow-x-auto">
        <div className="inline-flex min-w-full gap-1 rounded-lg bg-muted/50 p-1 text-muted-foreground">
          <AdminTab href="/admin" isActive={pathname === '/admin'}>
            Users
          </AdminTab>
          <AdminTab href="/admin/flights" isActive={pathname.includes('/admin/flights')}>
            Create Flights
          </AdminTab>
          <AdminTab href="/admin/booked-flights" isActive={false}>
            Booked Flights
          </AdminTab>
          <AdminTab href="/admin/flight-status" isActive={false}>
            Flight Status
          </AdminTab>
          <AdminTab href="/admin/payment-methods" isActive={false}>
            Payment Methods
          </AdminTab>
        </div>
      </div>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>All Flights</CardTitle>
          <Button onClick={() => router.push('/admin/flights/create')} size="sm">
            <Plus className="mr-2 h-4 w-4" />
            Add Flight
          </Button>
        </CardHeader>
        <CardContent className="p-0">
          <FlightsTable />
        </CardContent>
      </Card>
    </div>
  );
}

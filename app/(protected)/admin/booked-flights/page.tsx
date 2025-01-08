"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AdminTab } from "../../_components/AdminTab";
import Link from "next/link";
import { BookedFlightTable } from "./table";

interface BookedFlightsClientProps {
  formattedBookings: any[];
}

export default function BookedFlightsClient({ formattedBookings }: BookedFlightsClientProps) {
  return (
    <div className="p-6 space-y-8">
      <div className="overflow-x-auto">
        <div className="inline-flex min-w-full gap-1 rounded-lg bg-muted/50 p-1 text-muted-foreground">
          <AdminTab href="/admin" isActive={false}>
            Users
          </AdminTab>
          <AdminTab href="/admin/flights" isActive={false}>
            Create Flights
          </AdminTab>
          <AdminTab href="/admin/booked-flights" isActive={true}>
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
        <CardHeader>
          <CardTitle>All Booked Flights</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <BookedFlightTable data={formattedBookings} />
        </CardContent>
      </Card>
    </div>
  );
}

"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AdminTab } from "../../_components/AdminTab";
import { BookedFlightTable } from "./table";
import { 
  UserIcon, 
  PlaneTakeoffIcon, 
  CalendarCheckIcon, 
  ActivityIcon, 
  CreditCardIcon 
} from "lucide-react";

interface BookedFlight {
  id: string;
  ticketNumber: string;
  passengerName: string;
  passengerEmail: string;
  flightNumber: string;
  departure: string;
  arrival: string;
  departureTime: string;
  arrivalTime: string;
  status: string;
  amount: number;
  paymentMethod: string;
  createdAt: string;
}

interface BookedFlightsClientProps {
  formattedBookings: BookedFlight[];
}

export function BookedFlightsClient({ formattedBookings }: BookedFlightsClientProps) {
  return (
    <div className="p-6 space-y-8">
      <div className="overflow-x-auto">
        <div className="inline-flex min-w-full gap-1 rounded-lg bg-muted/50 p-1 text-muted-foreground">
          <AdminTab href="/admin" isActive={false} icon={UserIcon}>
            Users
          </AdminTab>
          <AdminTab href="/admin/flights" isActive={false} icon={PlaneTakeoffIcon}>
            Create Flights
          </AdminTab>
          <AdminTab href="/admin/booked-flights" isActive={true} icon={CalendarCheckIcon}>
            Booked Flights
          </AdminTab>
          <AdminTab href="/admin/flight-status" isActive={false} icon={ActivityIcon}>
            Flight Status
          </AdminTab>
          <AdminTab href="/admin/payment-methods" isActive={false} icon={CreditCardIcon}>
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

'use client';

import { useState } from 'react';
import { Flight } from '@prisma/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { getFlightStatusByParams } from '@/actions/flight';
import { FlightStatusForm } from '@/components/admin/flight-status-form';
import Link from 'next/link';
import { cn } from "@/lib/utils";
import { AdminTab } from "../../_components/AdminTab";
import { 
  UserIcon, 
  PlaneTakeoffIcon, 
  CalendarCheckIcon, 
  ActivityIcon, 
  CreditCardIcon 
} from "lucide-react";

// Extended Flight type with status fields
interface FlightWithStatus extends Flight {
  departureTerminal: string | null;
  arrivalTerminal: string | null;
  departureGate: string | null;
  arrivalGate: string | null;
  baggageClaim: string | null;
  aircraftModel: string | null;
  aircraftType: string | null;
  actualDepartureTime: Date | null;
  estimatedArrivalTime: Date | null;
  scheduledDepartureTime: Date | null;
  scheduledArrivalTime: Date | null;
}

export default function FlightStatusPage() {
  const [searchParams, setSearchParams] = useState({
    ticketNumber: '',
    departureAirport: '',
    arrivalAirport: '',
    departureTime: '',
  });
  const [flight, setFlight] = useState<FlightWithStatus | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async () => {
    try {
      // Filter out empty values and create params object
      const params = {
        ...(searchParams.ticketNumber && { ticketNumber: searchParams.ticketNumber }),
        ...(searchParams.departureAirport && { departureAirport: searchParams.departureAirport }),
        ...(searchParams.arrivalAirport && { arrivalAirport: searchParams.arrivalAirport }),
        ...(searchParams.departureTime && { departureTime: searchParams.departureTime }),
      };

      // Validate that we have either a ticket number or complete flight details
      if (Object.keys(params).length === 0) {
        setError("Please provide either a ticket number or flight details");
        setFlight(null);
        return;
      }

      if (!params.ticketNumber && (!params.departureAirport || !params.arrivalAirport || !params.departureTime)) {
        setError("Please provide either a ticket number or complete flight details (departure airport, arrival airport, and departure time)");
        setFlight(null);
        return;
      }
      
      const result = await getFlightStatusByParams(params);
      if (result.error) {
        setError(result.error);
        setFlight(null);
      } else if (result.data) {
        setFlight(result.data as FlightWithStatus);
        setError(null);
      }
    } catch (err) {
      setError('Failed to fetch flight status');
      setFlight(null);
    }
  };

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
          <AdminTab href="/admin/booked-flights" isActive={false} icon={CalendarCheckIcon}>
            Booked Flights
          </AdminTab>
          <AdminTab href="/admin/flight-status" isActive={true} icon={ActivityIcon}>
            Flight Status
          </AdminTab>
          <AdminTab href="/admin/payment-methods" isActive={false} icon={CreditCardIcon}>
            Payment Methods
          </AdminTab>
        </div>
      </div>
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Search Flight</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid gap-4">
              <div>
                <label htmlFor="ticketNumber" className="text-sm font-medium">
                  Ticket Number
                </label>
                <Input
                  id="ticketNumber"
                  value={searchParams.ticketNumber}
                  onChange={(e) => setSearchParams({ ...searchParams, ticketNumber: e.target.value })}
                  placeholder="Enter ticket number"
                />
              </div>
              <div>
                <label htmlFor="departureAirport" className="text-sm font-medium">
                  Departure Airport
                </label>
                <Input
                  id="departureAirport"
                  value={searchParams.departureAirport}
                  onChange={(e) => setSearchParams({ ...searchParams, departureAirport: e.target.value })}
                  placeholder="Enter departure airport"
                />
              </div>
              <div>
                <label htmlFor="arrivalAirport" className="text-sm font-medium">
                  Arrival Airport
                </label>
                <Input
                  id="arrivalAirport"
                  value={searchParams.arrivalAirport}
                  onChange={(e) => setSearchParams({ ...searchParams, arrivalAirport: e.target.value })}
                  placeholder="Enter arrival airport"
                />
              </div>
              <div>
                <label htmlFor="departureTime" className="text-sm font-medium">
                  Departure Time
                </label>
                <Input
                  id="departureTime"
                  type="datetime-local"
                  value={searchParams.departureTime}
                  onChange={(e) => setSearchParams({ ...searchParams, departureTime: e.target.value })}
                />
              </div>
            </div>
          </div>
          <div className="mt-4">
            <Button onClick={handleSearch} disabled={!searchParams.ticketNumber && (!searchParams.departureAirport || !searchParams.arrivalAirport || !searchParams.departureTime)}>
              Search
            </Button>
          </div>
        </CardContent>
      </Card>

      {error && (
        <div className="text-red-500 mb-4">{error}</div>
      )}

      {flight && (
        <Card>
          <CardHeader>
            <CardTitle>Flight Status</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <FlightStatusForm
              flightId={flight.id}
              initialData={{
                status: flight.status || undefined,
                departureTerminal: flight.departureTerminal || undefined,
                arrivalTerminal: flight.arrivalTerminal || undefined,
                departureGate: flight.departureGate || undefined,
                arrivalGate: flight.arrivalGate || undefined,
                baggageClaim: flight.baggageClaim || undefined,
                aircraftModel: flight.aircraftModel || undefined,
                aircraftType: flight.aircraftType || undefined,
                actualDepartureTime: flight.actualDepartureTime || undefined,
                estimatedArrivalTime: flight.estimatedArrivalTime || undefined,
                scheduledDepartureTime: flight.scheduledDepartureTime || undefined,
                scheduledArrivalTime: flight.scheduledArrivalTime || undefined,
              }}
            />
          </CardContent>
        </Card>
      )}
    </div>
  );
}

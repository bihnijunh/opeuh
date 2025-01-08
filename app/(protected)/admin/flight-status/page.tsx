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

const AdminTab = ({ href, isActive, children }: { href: string; isActive: boolean; children: React.ReactNode }) => (
  <Link
    href={href}
    className={cn(
      "inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
      isActive
        ? "bg-background text-foreground shadow-sm"
        : "text-muted-foreground hover:text-foreground"
    )}
  >
    {children}
  </Link>
);

export default function FlightStatusPage() {
  const [searchParams, setSearchParams] = useState({
    ticketNumber: '',
    from: '',
    to: '',
    date: '',
  });
  const [flight, setFlight] = useState<FlightWithStatus | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async () => {
    try {
      const result = await getFlightStatusByParams(searchParams);
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
          <AdminTab href="/admin" isActive={false}>
            Users
          </AdminTab>
          <AdminTab href="/admin/flights" isActive={false}>
            Create Flights
          </AdminTab>
          <AdminTab href="/admin/booked-flights" isActive={false}>
            Booked Flights
          </AdminTab>
          <AdminTab href="/admin/flight-status" isActive={true}>
            Flight Status
          </AdminTab>
          <AdminTab href="/admin/payment-methods" isActive={false}>
            Payment Methods
          </AdminTab>
        </div>
      </div>
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Search Flight</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <Input
                placeholder="Ticket Number"
                value={searchParams.ticketNumber}
                onChange={(e) => setSearchParams({ ...searchParams, ticketNumber: e.target.value })}
              />
            </div>
            <div>
              <Input
                placeholder="From"
                value={searchParams.from}
                onChange={(e) => setSearchParams({ ...searchParams, from: e.target.value })}
              />
            </div>
            <div>
              <Input
                placeholder="To"
                value={searchParams.to}
                onChange={(e) => setSearchParams({ ...searchParams, to: e.target.value })}
              />
            </div>
            <div>
              <Input
                type="date"
                value={searchParams.date}
                onChange={(e) => setSearchParams({ ...searchParams, date: e.target.value })}
              />
            </div>
          </div>
          <div className="mt-4">
            <Button onClick={handleSearch} disabled={!searchParams.ticketNumber && (!searchParams.from || !searchParams.to || !searchParams.date)}>
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

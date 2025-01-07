import { db } from "@/lib/db";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { BookedFlightTable } from "./table";

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

export default async function BookedFlightsPage() {
  const bookings = await db.flightBooking.findMany({
    include: {
      flight: true,
      paymentMethod: true
    },
    orderBy: {
      createdAt: 'desc'
    }
  });

  const formattedBookings = bookings.map(booking => ({
    id: booking.id,
    ticketNumber: booking.ticketNumber,
    passengerName: booking.passengerName,
    passengerEmail: booking.email,
    flightNumber: booking.flight.flightNumber,
    departure: booking.flight.fromCity,
    arrival: booking.flight.toCity,
    departureTime: booking.flight.departureDate.toISOString(),
    arrivalTime: booking.flight.returnDate?.toISOString() || 'N/A',
    status: booking.status,
    amount: booking.amount,
    paymentMethod: booking.paymentMethod.name,
    createdAt: booking.createdAt.toISOString()
  }));

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Booked Flights</h1>
      
      <div className="mb-6">
        <div className="inline-flex h-10 items-center justify-center rounded-md bg-muted p-1 text-muted-foreground">
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

      <div className="grid gap-4">
        <Card>
          <CardHeader>
            <CardTitle>All Booked Flights</CardTitle>
          </CardHeader>
          <CardContent>
            <BookedFlightTable data={formattedBookings} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

import { db } from "@/lib/db";
import { notFound } from "next/navigation";
import { format } from "date-fns";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";

async function getBookingByTicketNumber(ticketNumber: string) {
  try {
    const booking = await db.flightBooking.findUnique({
      where: { ticketNumber },
      include: {
        flight: true
      },
    });
    return booking;
  } catch (error) {
    console.error("Error fetching booking:", error);
    return null;
  }
}

export default async function BookingConfirmationPage({
  params,
}: {
  params: { ticketNumber: string };
}) {
  const booking = await getBookingByTicketNumber(params.ticketNumber);

  if (!booking) {
    notFound();
  }

  const departureDate = new Date(booking.flight.departureDate);
  const arrivalDate = booking.flight.returnDate ? new Date(booking.flight.returnDate) : null;

  return (
    <div className="container mx-auto py-10 px-4">
      <Card className="max-w-2xl mx-auto p-6 space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-bold text-primary">Booking Confirmation</h1>
          <p className="text-muted-foreground">
            Thank you for choosing Milano Air
          </p>
        </div>

        <div className="space-y-6 mt-6">
          <div className="bg-muted p-4 rounded-lg">
            <h2 className="font-semibold text-lg mb-4">Passenger Information</h2>
            <div className="grid gap-2">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Name:</span>
                <span className="font-medium">{booking.passengerName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Email:</span>
                <span>{booking.email}</span>
              </div>
            </div>
          </div>

          <div className="bg-muted p-4 rounded-lg">
            <h2 className="font-semibold text-lg mb-2">Ticket Information</h2>
            <div className="grid gap-2">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Ticket Number:</span>
                <span className="font-mono">{booking.ticketNumber}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Booking Date:</span>
                <span>{format(booking.createdAt, "PPP")}</span>
              </div>
            </div>
          </div>

          <div className="bg-muted p-4 rounded-lg">
            <h2 className="font-semibold text-lg mb-2">Flight Details</h2>
            <div className="grid gap-2">
              <div className="flex justify-between">
                <span className="text-muted-foreground">From:</span>
                <span>{booking.flight.fromCity}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">To:</span>
                <span>{booking.flight.toCity}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Departure:</span>
                <span>{format(departureDate, "PPP p")}</span>
              </div>
              {arrivalDate && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Return:</span>
                  <span>{format(arrivalDate, "PPP p")}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-muted-foreground">Flight Number:</span>
                <span>{booking.flight.flightNumber}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Airline:</span>
                <span>{booking.flight.airline}</span>
              </div>
            </div>
          </div>

          <div className="bg-muted p-4 rounded-lg">
            <h2 className="font-semibold text-lg mb-2">Payment Information</h2>
            <div className="grid gap-2">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Amount Paid:</span>
                <span>${booking.amount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Status:</span>
                <span className="capitalize">{booking.status.toLowerCase()}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-center pt-4">
          <Link href="/flights">
            <Button>Book Another Flight</Button>
          </Link>
        </div>
      </Card>
    </div>
  );
}

import { db } from "@/lib/db";
import { BookedFlightsClient } from "./client";

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

  return <BookedFlightsClient formattedBookings={formattedBookings} />;
}

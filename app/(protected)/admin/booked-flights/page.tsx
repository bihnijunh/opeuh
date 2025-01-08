import { db } from "@/lib/db";
import { BookedFlightsClient } from "./client";
import { Prisma, Flight, PaymentMethod, FlightBooking } from "@prisma/client";

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

type BookingWithRelations = Prisma.FlightBookingGetPayload<{
  include: {
    flight: true;
    paymentMethod: true;
  }
}>;

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

  const formattedBookings: BookedFlight[] = bookings.map(booking => ({
    id: booking.id,
    ticketNumber: booking.ticketNumber,
    passengerName: booking.passengerName || '',
    passengerEmail: booking.email || '',
    flightNumber: booking.flight.flightNumber,
    departure: booking.flight.departureAirport,
    arrival: booking.flight.arrivalAirport,
    departureTime: booking.flight.departureTime.toISOString(),
    arrivalTime: booking.flight.arrivalTime.toISOString(),
    status: booking.status,
    amount: booking.amount,
    paymentMethod: booking.paymentMethod.name,
    createdAt: booking.createdAt.toISOString()
  }));

  return <BookedFlightsClient formattedBookings={formattedBookings} />;
}

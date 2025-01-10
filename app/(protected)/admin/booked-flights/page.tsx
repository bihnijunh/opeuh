import { db } from "@/lib/db";
import { BookedFlightsClient } from "./client";
import { Prisma, Flight, PaymentMethod, FlightBooking } from "@prisma/client";

interface BookedFlight {
  id: string;
  ticketNumber: string;
  passengerName: string;
  passengerEmail: string;
  flightNumber: string;
  fromCity: string;
  toCity: string;
  departureDate: string;
  returnDate: string | null;
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
    fromCity: booking.flight.fromCity,
    toCity: booking.flight.toCity,
    departureDate: booking.flight.departureDate.toISOString(),
    returnDate: booking.flight.returnDate?.toISOString() || null,
    status: booking.status,
    amount: booking.amount,
    paymentMethod: booking.paymentMethod.name,
    createdAt: booking.createdAt.toISOString()
  }));

  return <BookedFlightsClient formattedBookings={formattedBookings} />;
}

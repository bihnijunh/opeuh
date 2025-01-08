"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { sendFlightBookingConfirmationEmail } from "@/lib/mail";
import { FlightBooking } from "@prisma/client";

export async function bookFlight(data: {
  flightId: string;
  paymentMethodId: string;
  amount: number;
  email: string;
  passengerName: string;
}): Promise<{ data?: FlightBooking; error?: string }> {
  try {
    if (!data.email?.trim()) {
      return { error: "Email address is required for booking confirmation" };
    }

    if (!data.passengerName?.trim()) {
      return { error: "Passenger name is required" };
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email.trim())) {
      return { error: "Please enter a valid email address" };
    }

    // Verify flight exists and has available seats
    const flight = await db.flight.findUnique({
      where: { id: data.flightId },
    });

    if (!flight) {
      return { error: "Flight not found" };
    }

    if (flight.availableSeats < 1) {
      return { error: "No seats available" };
    }

    // Verify payment method exists
    const paymentMethod = await db.paymentMethod.findUnique({
      where: { id: data.paymentMethodId },
    });

    if (!paymentMethod) {
      return { error: "Invalid payment method" };
    }

    // Create booking and update flight in a transaction
    const result = await db.$transaction(async (tx) => {
      // Get the flight first
      const flightRecord = await tx.flight.findUnique({
        where: { id: data.flightId },
      });

      if (!flightRecord) {
        throw new Error("Flight not found");
      }

      // Update available seats
      await tx.flight.update({
        where: { id: data.flightId },
        data: {
          availableSeats: {
            decrement: 1
          }
        }
      });

      // Create the booking
      const booking = await tx.flightBooking.create({
        data: {
          flightId: data.flightId,
          email: data.email.trim(),
          passengerName: data.passengerName.trim(),
          status: "CONFIRMED",
          amount: data.amount,
          paymentMethodId: data.paymentMethodId,
        }
      });

      return booking;
    });

    // Send confirmation email
    await sendFlightBookingConfirmationEmail(
      data.email,
      {
        ticketNumber: result.ticketNumber,
        passengerName: data.passengerName,
        flightNumber: flight.flightNumber,
        departureAirport: flight.departureAirport,
        arrivalAirport: flight.arrivalAirport,
        departureTime: flight.departureTime,
        arrivalTime: flight.arrivalTime
      }
    );

    revalidatePath("/flights");
    return { data: result };
  } catch (error) {
    console.error("Error booking flight:", error);
    return { error: "Failed to book flight. Please try again." };
  }
}

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

    // Verify payment method exists and is active
    const paymentMethod = await db.paymentMethod.findUnique({
      where: { id: data.paymentMethodId },
    });

    if (!paymentMethod || !paymentMethod.isActive) {
      return { error: "Invalid payment method" };
    }

    // Create booking and update flight in a transaction
    const result = await db.$transaction(async (tx) => {
      // Get the flight first
      const flightRecord = await tx.flight.findUnique({
        where: { id: data.flightId },
        select: {
          id: true,
          fromCity: true,
          toCity: true,
          departureDate: true,
          availableSeats: true,
        },
      });

      if (!flightRecord) {
        throw new Error("Flight not found");
      }

      const booking = await tx.flightBooking.create({
        data: {
          flightId: data.flightId,
          paymentMethodId: data.paymentMethodId,
          amount: data.amount,
          email: data.email.trim(),
          passengerName: data.passengerName.trim(),
          status: "CONFIRMED", // Change status to CONFIRMED since we're sending email
        },
        select: {
          id: true,
          ticketNumber: true,
          email: true,
          passengerName: true,
          status: true,
          flightId: true,
          paymentMethodId: true,
          amount: true,
          paymentConfirmedAt: true,
          approvedAt: true,
          createdAt: true,
          updatedAt: true,
        },
      });

      const updatedFlight = await tx.flight.update({
        where: { id: data.flightId },
        data: {
          availableSeats: flightRecord.availableSeats - 1,
        },
      });

      // Send confirmation email within the transaction
      try {
        const departureDate = new Date(flightRecord.departureDate);
        await sendFlightBookingConfirmationEmail(
          booking.email,
          booking.ticketNumber as string,
          {
            departure: flightRecord.fromCity,
            arrival: flightRecord.toCity,
            date: departureDate.toLocaleDateString(),
            time: departureDate.toLocaleTimeString(),
          },
          booking.passengerName
        );
        console.log("[EMAIL_CONFIRMATION] Sent successfully to:", booking.email);
      } catch (emailError) {
        console.error("[SEND_CONFIRMATION_EMAIL]", emailError);
        // Update booking status to indicate email failed
        await tx.flightBooking.update({
          where: { id: booking.id },
          data: { status: "EMAIL_FAILED" },
        });
      }

      return { booking, flight: updatedFlight };
    });

    revalidatePath("/flights");
    return { data: result.booking };
  } catch (error) {
    console.error("[BOOK_FLIGHT]", error);
    return { error: "Failed to book flight" };
  }
}

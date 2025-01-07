"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function updateBooking(
  bookingId: string,
  data: {
    passengerName: string;
    passengerEmail: string;
    status: string;
  }
) {
  try {
    await db.flightBooking.update({
      where: {
        id: bookingId,
      },
      data: {
        passengerName: data.passengerName,
        email: data.passengerEmail,
        status: data.status,
      },
    });

    revalidatePath("/admin/booked-flights");
  } catch (error) {
    throw new Error("Failed to update booking");
  }
}

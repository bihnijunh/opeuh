"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { Flight, Prisma } from "@prisma/client";

interface FlightVariationParams {
  numberOfFlights?: number;
  minPrice?: number;
  maxPrice?: number;
  minSeats?: number;
  maxSeats?: number;
  hoursBetween?: number;
}

interface FlightWithVariations extends Flight {
  variations?: Flight[];
}

interface FlightStatus {
  actualDepartureTime: Date | null;
  estimatedArrivalTime: Date | null;
  scheduledDepartureTime: Date;
  scheduledArrivalTime: Date;
  departureTerminal: string;
  arrivalTerminal: string;
  departureGate: string;
  arrivalGate: string;
  baggageClaim: string;
  status: 'On Time' | 'Delayed' | 'Cancelled' | 'In Flight' | 'Landed';
  aircraft: {
    model: string;
    type: string;
  };
}

export async function getFlights(params?: {
  fromCity?: string;
  toCity?: string;
  departureDate?: string;
  includeVariations?: boolean;
}): Promise<{ data?: FlightWithVariations[]; error?: string }> {
  try {
    const where: Prisma.FlightWhereInput = {};
    
    if (params?.fromCity) {
      where.fromCity = params.fromCity;
    }
    
    if (params?.toCity) {
      where.toCity = params.toCity;
    }
    
    if (params?.departureDate) {
      const date = new Date(params.departureDate);
      const nextDay = new Date(date);
      nextDay.setDate(nextDay.getDate() + 1);
      
      where.departureDate = {
        gte: date,
        lt: nextDay,
      };
    }

    const flights = await db.flight.findMany({
      where,
      orderBy: {
        departureDate: "asc",
      },
    });

    if (params?.includeVariations) {
      const flightsWithVariations: FlightWithVariations[] = await Promise.all(
        flights.map(async (flight) => {
          const variations = await db.flight.findMany({
            where: {
              fromCity: flight.fromCity,
              toCity: flight.toCity,
              departureDate: {
                gte: new Date(),
              },
              NOT: {
                id: flight.id,
              },
            },
            take: 3,
            orderBy: {
              departureDate: "asc",
            },
          });
          return { ...flight, variations };
        })
      );
      return { data: flightsWithVariations };
    }

    return { data: flights };
  } catch (error) {
    console.error("Error getting flights:", error);
    return { error: "Failed to get flights" };
  }
}

export async function getFlight(
  id: string,
  includeVariations: boolean = false
): Promise<{ data?: FlightWithVariations; error?: string }> {
  try {
    const flight = await db.flight.findUnique({
      where: { id },
    });

    if (!flight) {
      return { error: "Flight not found" };
    }

    if (includeVariations) {
      const variations = await db.flight.findMany({
        where: {
          fromCity: flight.fromCity,
          toCity: flight.toCity,
          departureDate: {
            gte: new Date(),
          },
          NOT: {
            id: flight.id,
          },
        },
        take: 3,
        orderBy: {
          departureDate: "asc",
        },
      });

      return { data: { ...flight, variations } };
    }

    return { data: flight };
  } catch (error) {
    console.error("Error getting flight:", error);
    return { error: "Failed to get flight" };
  }
}

function generateRandomInRange(min: number, max: number, isInteger: boolean = false): number {
  const random = Math.random() * (max - min) + min;
  return isInteger ? Math.floor(random) : random;
}

export async function createFlightVariations(
  baseFlight: Flight,
  params: FlightVariationParams
): Promise<Flight[]> {
  const variations: Flight[] = [];
  const {
    numberOfFlights = 3,
    minPrice = baseFlight.price * 0.8,
    maxPrice = baseFlight.price * 1.2,
    minSeats = 50,
    maxSeats = 200,
    hoursBetween = 2
  } = params;

  for (let i = 0; i < numberOfFlights; i++) {
    const departureDate = new Date(baseFlight.departureDate);
    departureDate.setHours(departureDate.getHours() + (i * hoursBetween));
    
    const variation = await db.flight.create({
      data: {
        flightNumber: `${baseFlight.flightNumber}-${i + 1}`,
        fromCity: baseFlight.fromCity,
        toCity: baseFlight.toCity,
        departureDate,
        returnDate: null,
        price: generateRandomInRange(minPrice, maxPrice),
        availableSeats: generateRandomInRange(minSeats, maxSeats, true),
        userId: baseFlight.userId,
        airline: baseFlight.airline,
        departureTerminal: baseFlight.departureTerminal,
        arrivalTerminal: baseFlight.arrivalTerminal,
        departureGate: baseFlight.departureGate,
        arrivalGate: baseFlight.arrivalGate,
        baggageClaim: baseFlight.baggageClaim,
        aircraftModel: baseFlight.aircraftModel,
        aircraftType: baseFlight.aircraftType,
      },
    });

    variations.push(variation);
  }

  return variations;
}

export async function createFlight(data: {
  fromCity: string;
  toCity: string;
  departureDate: string;
  returnDate?: string;
  price: number;
  availableSeats: number;
  flightNumber: string;
  airline: string;
  variations?: FlightVariationParams;
}): Promise<{ data?: Flight; variations?: Flight[]; error?: string }> {
  try {
    // Create or find the default admin user
    const DEFAULT_ADMIN_ID = "default-admin";
    const adminUser = await db.user.upsert({
      where: { id: DEFAULT_ADMIN_ID },
      update: {},
      create: {
        id: DEFAULT_ADMIN_ID,
        role: "ADMIN",
        email: "admin@example.com",
      }
    });

    const departureDate = new Date(data.departureDate);
    
    const flight = await db.flight.create({
      data: {
        fromCity: data.fromCity,
        toCity: data.toCity,
        departureDate: departureDate,
        returnDate: data.returnDate ? new Date(data.returnDate) : null,
        price: data.price,
        availableSeats: data.availableSeats,
        flightNumber: data.flightNumber,
        airline: data.airline,
        userId: adminUser.id,
        status: "scheduled",
      },
    });

    let variations: Flight[] | undefined;
    if (data.variations) {
      variations = await createFlightVariations(flight, data.variations);
    }

    revalidatePath("/flights");
    return { data: flight, variations };
  } catch (error) {
    console.error("[CREATE_FLIGHT]", error);
    return { error: "Failed to create flight" };
  }
}

export async function updateFlight(
  id: string,
  data: {
    fromCity: string;
    toCity: string;
    departureDate: string;
    returnDate?: string;
    price: number;
    availableSeats: number;
    flightNumber: string;
    airline: string;
  }
): Promise<{ data?: Flight; error?: string }> {
  try {
    const departureDate = new Date(data.departureDate);
    
    await db.flight.update({
      where: { id },
      data: {
        fromCity: data.fromCity,
        toCity: data.toCity,
        departureDate: departureDate,
        returnDate: data.returnDate ? new Date(data.returnDate) : null,
        price: data.price,
        availableSeats: data.availableSeats,
        flightNumber: data.flightNumber,
        airline: data.airline,
        departureTerminal: data.fromCity,
        arrivalTerminal: data.toCity,
      },
    });

    const updatedFlight = await db.flight.findUnique({ where: { id } });
    return { data: updatedFlight || undefined };
  } catch (error) {
    console.error("[UPDATE_FLIGHT]", error);
    return { error: "Failed to update flight" };
  }
}

export async function deleteFlight(id: string): Promise<{ success?: boolean; error?: string }> {
  try {
    await db.flight.delete({
      where: { id },
    });

    revalidatePath("/flights");
    return { success: true };
  } catch (error) {
    console.error("Error deleting flight:", error);
    return { error: "Failed to delete flight" };
  }
}

export async function searchFlights(params: {
  fromCity: string;
  toCity: string;
  departureDate: string;
  arrivalDate?: string;
}): Promise<{ data?: { outbound: Flight[]; return: Flight[] }; error?: string }> {
  try {
    const outboundFlights = await db.flight.findMany({
      where: {
        fromCity: params.fromCity,
        toCity: params.toCity,
        departureDate: {
          gte: new Date(params.departureDate),
        },
      },
      orderBy: {
        departureDate: "asc",
      },
    });

    let returnFlights: Flight[] = [];

    if (params.arrivalDate) {
      returnFlights = await db.flight.findMany({
        where: {
          fromCity: params.toCity,
          toCity: params.fromCity,
          departureDate: {
            gte: new Date(params.arrivalDate),
          },
        },
        orderBy: {
          departureDate: "asc",
        },
      });
    }

    return {
      data: {
        outbound: outboundFlights,
        return: returnFlights,
      },
    };
  } catch (error) {
    console.error("Error searching flights:", error);
    return { error: "Failed to search flights" };
  }
}

export async function getFlightStatus(
  id: string
): Promise<{ data?: Flight & FlightStatus; error?: string }> {
  try {
    const flight = await db.flight.findUnique({
      where: { id },
    });

    if (!flight) {
      return { error: "Flight not found" };
    }

    // Calculate estimated times based on current status
    const now = new Date();
    const departureDate = new Date(flight.departureDate);
    const scheduledArrivalTime = new Date(departureDate.getTime() + 2 * 60 * 60 * 1000); // 2 hours after departure
    
    let status: FlightStatus["status"];
    let actualDepartureTime: Date | null = null;
    let estimatedArrivalTime: Date | null = null;

    if (now < departureDate) {
      status = "On Time";
    } else if (now >= departureDate && now < scheduledArrivalTime) {
      status = "In Flight";
      actualDepartureTime = departureDate;
      estimatedArrivalTime = scheduledArrivalTime;
    } else {
      status = "Landed";
      actualDepartureTime = departureDate;
      estimatedArrivalTime = scheduledArrivalTime;
    }

    const flightStatus: FlightStatus = {
      actualDepartureTime,
      estimatedArrivalTime,
      scheduledDepartureTime: departureDate,
      scheduledArrivalTime,
      departureTerminal: flight.departureTerminal || "TBD",
      arrivalTerminal: flight.arrivalTerminal || "TBD",
      departureGate: flight.departureGate || "TBD",
      arrivalGate: flight.arrivalGate || "TBD",
      baggageClaim: flight.baggageClaim || "TBD",
      status,
      aircraft: {
        model: flight.aircraftModel || "Unknown",
        type: flight.aircraftType || "Unknown",
      },
    };

    return { data: { ...flight, ...flightStatus } };
  } catch (error) {
    console.error("Error getting flight status:", error);
    return { error: "Failed to get flight status" };
  }
}

export async function getFlightStatusByParams(params: {
  ticketNumber?: string;
  fromCity?: string;
  toCity?: string;
  departureDate?: string;
}): Promise<{
  data?: Flight & {
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
  };
  error?: string;
}> {
  try {
    let flight: Flight | null = null;

    // If ticket number is provided, look up the booking first
    if (params.ticketNumber) {
      const booking = await db.flightBooking.findUnique({
        where: { ticketNumber: params.ticketNumber },
        include: { flight: true }
      });

      if (!booking) {
        return { error: "No booking found with this ticket number" };
      }

      flight = booking.flight;
    } else {
      // Otherwise use the other search parameters
      const where: Prisma.FlightWhereInput = {};

      if (params.fromCity) {
        where.fromCity = {
          equals: params.fromCity,
          mode: 'insensitive'
        };
      }

      if (params.toCity) {
        where.toCity = {
          equals: params.toCity,
          mode: 'insensitive'
        };
      }

      if (params.departureDate) {
        const date = new Date(params.departureDate);
        where.departureDate = {
          gte: date,
        };
      } else {
        where.departureDate = {
          gte: new Date()
        };
      }

      flight = await db.flight.findFirst({
        where,
        orderBy: {
          departureDate: 'asc'
        }
      });
    }

    if (!flight) {
      return { error: "Flight not found. Please check your search criteria and try again." };
    }

    return { data: flight };
  } catch (error) {
    console.error("Error getting flight status:", error);
    return { error: "Failed to get flight status. Please try again later." };
  }
}

export async function updateFlightStatus(
  id: string,
  data: Partial<{
    status: string;
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
  }>
): Promise<{ success?: boolean; error?: string }> {
  try {
    await db.flight.update({
      where: { id },
      data,
    });

    revalidatePath("/flights");
    return { success: true };
  } catch (error) {
    console.error("Error updating flight status:", error);
    return { error: "Failed to update flight status" };
  }
}

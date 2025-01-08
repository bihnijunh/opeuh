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
  departureAirport?: string;
  arrivalAirport?: string;
  departureTime?: string;
  arrivalTime?: string;
  includeVariations?: boolean;
}): Promise<{ data?: FlightWithVariations[]; error?: string }> {
  try {
    const where: Prisma.FlightWhereInput = {};
    
    if (params?.departureAirport) {
      where.departureAirport = params.departureAirport;
    }
    
    if (params?.arrivalAirport) {
      where.arrivalAirport = params.arrivalAirport;
    }
    
    if (params?.departureTime) {
      const date = new Date(params.departureTime);
      const nextDay = new Date(date);
      nextDay.setDate(nextDay.getDate() + 1);
      
      where.departureTime = {
        gte: date,
        lt: nextDay,
      };
    }

    const flights = await db.flight.findMany({
      where,
      orderBy: {
        departureTime: "asc",
      },
    });

    if (params?.includeVariations) {
      const flightsWithVariations: FlightWithVariations[] = await Promise.all(
        flights.map(async (flight) => {
          const variations = await db.flight.findMany({
            where: {
              departureAirport: flight.departureAirport,
              arrivalAirport: flight.arrivalAirport,
              departureTime: {
                gte: new Date(),
              },
              NOT: {
                id: flight.id,
              },
            },
            take: 3,
            orderBy: {
              departureTime: "asc",
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
          departureAirport: flight.departureAirport,
          arrivalAirport: flight.arrivalAirport,
          departureTime: {
            gte: new Date(),
          },
          NOT: {
            id: flight.id,
          },
        },
        take: 3,
        orderBy: {
          departureTime: "asc",
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
    const departureTime = new Date(baseFlight.departureTime);
    departureTime.setHours(departureTime.getHours() + (i * hoursBetween));
    
    const arrivalTime = new Date(departureTime);
    arrivalTime.setHours(arrivalTime.getHours() + 2); // Assuming 2-hour flights

    const variation = await db.flight.create({
      data: {
        flightNumber: `${baseFlight.flightNumber}-${i + 1}`,
        departureAirport: baseFlight.departureAirport,
        arrivalAirport: baseFlight.arrivalAirport,
        departureTime,
        arrivalTime,
        departureDate: departureTime,
        price: generateRandomInRange(minPrice, maxPrice),
        availableSeats: generateRandomInRange(minSeats, maxSeats, true),
        userId: baseFlight.userId,
        airline: baseFlight.airline,
        fromCity: baseFlight.fromCity,
        toCity: baseFlight.toCity,
      },
    });

    variations.push(variation);
  }

  return variations;
}

export async function createFlight(data: {
  departureAirport: string;
  arrivalAirport: string;
  departureTime: string;
  arrivalTime: string;
  price: number;
  availableSeats: number;
  flightNumber: string;
  userId: string;
  airline: string;
  fromCity: string;
  toCity: string;
  variations?: FlightVariationParams;
}): Promise<{ data?: Flight; variations?: Flight[]; error?: string }> {
  try {
    const departureTime = new Date(data.departureTime);
    const flight = await db.flight.create({
      data: {
        flightNumber: data.flightNumber,
        departureAirport: data.departureAirport,
        arrivalAirport: data.arrivalAirport,
        departureTime: departureTime,
        arrivalTime: new Date(data.arrivalTime),
        departureDate: departureTime,
        price: data.price,
        availableSeats: data.availableSeats,
        userId: data.userId,
        airline: data.airline,
        fromCity: data.fromCity,
        toCity: data.toCity,
      },
    });

    let variations: Flight[] | undefined;

    if (data.variations) {
      variations = await createFlightVariations(flight, data.variations);
    }

    revalidatePath("/flights");
    return { data: flight, variations };
  } catch (error) {
    console.error("Error creating flight:", error);
    return { error: "Failed to create flight" };
  }
}

export async function updateFlight(
  id: string,
  data: {
    departureAirport: string;
    arrivalAirport: string;
    departureTime: string;
    arrivalTime: string;
    price: number;
    availableSeats: number;
    flightNumber: string;
    userId: string;
    airline: string;
    fromCity: string;
    toCity: string;
  }
): Promise<{ data?: Flight; error?: string }> {
  try {
    const flight = await db.flight.update({
      where: { id },
      data: {
        flightNumber: data.flightNumber,
        departureAirport: data.departureAirport,
        arrivalAirport: data.arrivalAirport,
        departureTime: new Date(data.departureTime),
        arrivalTime: new Date(data.arrivalTime),
        price: data.price,
        availableSeats: data.availableSeats,
        userId: data.userId,
        airline: data.airline,
        fromCity: data.fromCity,
        toCity: data.toCity,
      },
    });

    revalidatePath("/flights");
    return { data: flight };
  } catch (error) {
    console.error("Error updating flight:", error);
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
  departureAirport: string;
  arrivalAirport: string;
  departureTime: string;
  arrivalTime?: string;
}): Promise<{ data?: { outbound: Flight[]; return: Flight[] }; error?: string }> {
  try {
    const outboundFlights = await db.flight.findMany({
      where: {
        departureAirport: params.departureAirport,
        arrivalAirport: params.arrivalAirport,
        departureTime: {
          gte: new Date(params.departureTime),
        },
      },
      orderBy: {
        departureTime: "asc",
      },
    });

    let returnFlights: Flight[] = [];

    if (params.arrivalTime) {
      returnFlights = await db.flight.findMany({
        where: {
          departureAirport: params.arrivalAirport,
          arrivalAirport: params.departureAirport,
          departureTime: {
            gte: new Date(params.arrivalTime),
          },
        },
        orderBy: {
          departureTime: "asc",
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
    const departureTime = new Date(flight.departureTime);
    const arrivalTime = new Date(flight.arrivalTime);
    
    let status: FlightStatus["status"];
    let actualDepartureTime: Date | null = null;
    let estimatedArrivalTime: Date | null = null;

    if (now < departureTime) {
      status = "On Time";
    } else if (now >= departureTime && now < arrivalTime) {
      status = "In Flight";
      actualDepartureTime = departureTime;
      estimatedArrivalTime = arrivalTime;
    } else {
      status = "Landed";
      actualDepartureTime = departureTime;
      estimatedArrivalTime = arrivalTime;
    }

    const flightStatus: FlightStatus = {
      actualDepartureTime,
      estimatedArrivalTime,
      scheduledDepartureTime: departureTime,
      scheduledArrivalTime: arrivalTime,
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
  flightNumber?: string;
  departureAirport?: string;
  arrivalAirport?: string;
  departureTime?: string;
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
    const where: Prisma.FlightWhereInput = {};

    if (params.flightNumber) {
      where.flightNumber = params.flightNumber;
    }

    if (params.departureAirport) {
      where.departureAirport = params.departureAirport;
    }

    if (params.arrivalAirport) {
      where.arrivalAirport = params.arrivalAirport;
    }

    if (params.departureTime) {
      const date = new Date(params.departureTime);
      const nextDay = new Date(date);
      nextDay.setDate(nextDay.getDate() + 1);

      where.departureTime = {
        gte: date,
        lt: nextDay,
      };
    }

    const flight = await db.flight.findFirst({
      where,
    });

    if (!flight) {
      return { error: "Flight not found" };
    }

    return { data: flight };
  } catch (error) {
    console.error("Error getting flight status:", error);
    return { error: "Failed to get flight status" };
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

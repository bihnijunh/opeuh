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
  returnDate?: string;
  airline?: string;
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
    
    if (params?.airline) {
      where.airline = params.airline;
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
    console.error("[GET_FLIGHTS]", error);
    return { error: "Failed to fetch flights" };
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
    console.error("[GET_FLIGHT]", error);
    return { error: "Failed to fetch flight" };
  }
}

function generateRandomInRange(min: number, max: number, isInteger: boolean = false): number {
  const random = Math.random() * (max - min) + min;
  return isInteger ? Math.floor(random) : Number(random.toFixed(2));
}

async function createFlightVariations(
  baseFlight: Flight,
  params: FlightVariationParams
): Promise<Flight[]> {
  const variations: Flight[] = [];
  const numberOfFlights = params.numberOfFlights || 3;
  const minPrice = params.minPrice || baseFlight.price * 0.8;
  const maxPrice = params.maxPrice || baseFlight.price * 1.2;
  const minSeats = params.minSeats || 10;
  const maxSeats = params.maxSeats || 200;
  const hoursBetween = params.hoursBetween || 2;

  for (let i = 0; i < numberOfFlights; i++) {
    const departureDate = new Date(baseFlight.departureDate);
    departureDate.setHours(departureDate.getHours() + i * hoursBetween);

    const variation = await db.flight.create({
      data: {
        airline: baseFlight.airline,
        fromCity: baseFlight.fromCity,
        toCity: baseFlight.toCity,
        departureDate,
        price: generateRandomInRange(minPrice, maxPrice),
        availableSeats: generateRandomInRange(minSeats, maxSeats, true),
        flightNumber: `${baseFlight.flightNumber}-${i + 1}`,
        userId: baseFlight.userId,
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

    const flight = await db.flight.create({
      data: {
        fromCity: data.fromCity,
        toCity: data.toCity,
        departureDate: new Date(data.departureDate),
        returnDate: data.returnDate ? new Date(data.returnDate) : null,
        price: data.price,
        availableSeats: data.availableSeats,
        flightNumber: data.flightNumber,
        airline: data.airline,
        userId: adminUser.id,
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
    variations?: FlightVariationParams;
  }
): Promise<{ data?: Flight; error?: string }> {
  try {
    const flight = await db.flight.update({
      where: { id },
      data: {
        fromCity: data.fromCity,
        toCity: data.toCity,
        departureDate: new Date(data.departureDate),
        returnDate: data.returnDate ? new Date(data.returnDate) : null,
        price: data.price,
        availableSeats: data.availableSeats,
        flightNumber: data.flightNumber,
        airline: data.airline,
      },
    });

    revalidatePath("/flights");
    return { data: flight };
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
    console.error("[DELETE_FLIGHT]", error);
    return { error: "Failed to delete flight" };
  }
}

export async function searchFlights(params: {
  fromCity: string;
  toCity: string;
  departureDate: string;
  returnDate?: string;
}): Promise<{ data?: { outbound: Flight[]; return: Flight[] }; error?: string }> {
  try {
    const departureDate = new Date(params.departureDate);
    const nextDay = new Date(departureDate);
    nextDay.setDate(nextDay.getDate() + 1);

    const outboundFlights = await db.flight.findMany({
      where: {
        fromCity: params.fromCity,
        toCity: params.toCity,
        departureDate: {
          gte: departureDate,
          lt: nextDay,
        },
      },
      orderBy: {
        departureDate: "asc",
      },
    });

    let returnFlights: Flight[] = [];

    if (params.returnDate) {
      const returnDate = new Date(params.returnDate);
      const nextReturnDay = new Date(returnDate);
      nextReturnDay.setDate(nextReturnDay.getDate() + 1);

      returnFlights = await db.flight.findMany({
        where: {
          fromCity: params.toCity,
          toCity: params.fromCity,
          departureDate: {
            gte: returnDate,
            lt: nextReturnDay,
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
    console.error("[SEARCH_FLIGHTS]", error);
    return { error: "Failed to search flights" };
  }
}

export async function getFlightStatus(
  id: string
): Promise<{ data?: Flight & FlightStatus; error?: string }> {
  try {
    const flight = await db.flight.findUnique({
      where: { id }
    });

    if (!flight) {
      return { error: "Flight not found" };
    }

    // Calculate estimated times and status based on current time
    const now = new Date("2025-01-07T03:17:23-08:00");
    const departureTime = new Date(flight.departureDate);
    const estimatedDuration = 6 * 60 * 60 * 1000; // 6 hours in milliseconds
    const scheduledArrivalTime = new Date(departureTime.getTime() + estimatedDuration);
    
    let status: FlightStatus['status'] = 'On Time';
    let actualDepartureTime = null;
    let estimatedArrivalTime = scheduledArrivalTime;

    if (now > scheduledArrivalTime) {
      status = 'Landed';
      actualDepartureTime = departureTime;
    } else if (now > departureTime) {
      status = 'In Flight';
      actualDepartureTime = departureTime;
      // Recalculate estimated arrival if there was a delay
      if (actualDepartureTime > departureTime) {
        estimatedArrivalTime = new Date(actualDepartureTime.getTime() + estimatedDuration);
      }
    } else if (now.getTime() + 15 * 60 * 1000 >= departureTime.getTime()) {
      status = 'Delayed';
      actualDepartureTime = new Date(departureTime.getTime() + 30 * 60 * 1000); // 30 min delay
      estimatedArrivalTime = new Date(actualDepartureTime.getTime() + estimatedDuration);
    }

    // Generate flight status information
    const flightStatus: FlightStatus = {
      actualDepartureTime,
      estimatedArrivalTime,
      scheduledDepartureTime: departureTime,
      scheduledArrivalTime,
      departureTerminal: '8',
      arrivalTerminal: '4',
      departureGate: '7',
      arrivalGate: '41',
      baggageClaim: 'T4B',
      status,
      aircraft: {
        model: 'Airbus A321',
        type: 'Transcon',
      },
    };

    return { data: { ...flight, ...flightStatus } };
  } catch (error) {
    console.error("[GET_FLIGHT_STATUS]", error);
    return { error: "Failed to fetch flight status" };
  }
}

export async function getFlightStatusByParams(params: {
  ticketNumber?: string;
  from?: string;
  to?: string;
  date?: string;
}): Promise<{ data?: Flight & {
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
}; error?: string }> {
  try {
    let flight: any;
    
    if (params.ticketNumber) {
      // First find the booking by ticket number
      const booking = await db.flightBooking.findFirst({
        where: {
          ticketNumber: params.ticketNumber
        },
        include: {
          flight: true
        }
      });

      if (!booking) {
        return { error: "Booking not found" };
      }

      flight = booking.flight;
    } else {
      if (!params.from || !params.to || !params.date) {
        return { error: "Missing required parameters" };
      }
      
      flight = await db.flight.findFirst({
        where: {
          fromCity: params.from,
          toCity: params.to,
          departureDate: {
            gte: new Date(params.date),
            lt: new Date(new Date(params.date).getTime() + 24 * 60 * 60 * 1000), // Next day
          },
        },
        orderBy: {
          departureDate: 'asc',
        },
      });
    }

    if (!flight) {
      return { error: "Flight not found" };
    }

    // Calculate flight status based on current time
    const now = new Date("2025-01-07T05:00:00-08:00");
    const departureTime = new Date(flight.departureDate);
    const estimatedDuration = 6 * 60 * 60 * 1000; // 6 hours in milliseconds
    const scheduledArrivalTime = new Date(departureTime.getTime() + estimatedDuration);
    
    let status: string = 'On Time';
    let actualDepartureTime: Date | null = null;
    let estimatedArrivalTime: Date = scheduledArrivalTime;

    if (now > scheduledArrivalTime) {
      status = 'Landed';
      actualDepartureTime = departureTime;
    } else if (now > departureTime) {
      status = 'In Flight';
      actualDepartureTime = departureTime;
      // Recalculate estimated arrival if there was a delay
      if (actualDepartureTime > departureTime) {
        estimatedArrivalTime = new Date(actualDepartureTime.getTime() + estimatedDuration);
      }
    } else if (now.getTime() + 15 * 60 * 1000 >= departureTime.getTime()) {
      status = 'Delayed';
      actualDepartureTime = new Date(departureTime.getTime() + 30 * 60 * 1000); // 30 min delay
      estimatedArrivalTime = new Date(actualDepartureTime.getTime() + estimatedDuration);
    }

    return {
      data: {
        ...flight,
        status: flight.status || status,
        departureTerminal: flight.departureTerminal || "8",
        arrivalTerminal: flight.arrivalTerminal || "4",
        departureGate: flight.departureGate || "7",
        arrivalGate: flight.arrivalGate || "41",
        baggageClaim: flight.baggageClaim || "T4B",
        aircraftModel: flight.aircraftModel || "Airbus A321",
        aircraftType: flight.aircraftType || "Transcon",
        actualDepartureTime: flight.actualDepartureTime || actualDepartureTime,
        estimatedArrivalTime: flight.estimatedArrivalTime || estimatedArrivalTime,
        scheduledDepartureTime: flight.scheduledDepartureTime || departureTime,
        scheduledArrivalTime: flight.scheduledArrivalTime || scheduledArrivalTime,
      },
    };
  } catch (error) {
    console.error("[GET_FLIGHT_STATUS_ERROR]", error);
    return { error: "Failed to fetch flight status" };
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
    const updateData = {
      status: data.status,
      departureTerminal: data.departureTerminal,
      arrivalTerminal: data.arrivalTerminal,
      departureGate: data.departureGate,
      arrivalGate: data.arrivalGate,
      baggageClaim: data.baggageClaim,
      aircraftModel: data.aircraftModel,
      aircraftType: data.aircraftType,
      actualDepartureTime: data.actualDepartureTime,
      estimatedArrivalTime: data.estimatedArrivalTime,
      scheduledDepartureTime: data.scheduledDepartureTime,
      scheduledArrivalTime: data.scheduledArrivalTime,
    };

    await db.flight.update({
      where: { id },
      data: updateData,
    });

    revalidatePath("/admin/flight-status");
    return { success: true };
  } catch (error) {
    console.error("[UPDATE_FLIGHT_STATUS_ERROR]", error);
    return { error: "Failed to update flight status" };
  }
}

import { UserRole } from "@prisma/client";

export type User = {
  id: string;
  name: string | null;
  email: string | null;
  role: UserRole;
};

export type Flight = {
  id: string;
  flightNumber: string;
  departure: string;
  arrival: string;
  date: Date;
  time: string;
  status: string;
  price: number;
};

export type BookedFlight = {
  id: string;
  flightId: string;
  userId: string;
  ticketNumber: string;
  passengerName: string;
  status: string;
  flight: Flight;
  user: User;
};

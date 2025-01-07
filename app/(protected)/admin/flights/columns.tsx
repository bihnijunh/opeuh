"use client";

import { ColumnDef } from "@tanstack/react-table";
import { CellAction } from "./cell-action";
import { airports } from "@/lib/airports";
import { airlines } from "@/lib/airlines";
import { format } from "date-fns";

export type FlightColumn = {
  id: string;
  fromCity: string;
  toCity: string;
  departureDate: string;
  returnDate: string | null;
  price: number;
  availableSeats: number;
  flightNumber: string;
  airline: string;
  createdAt: string;
};

const getAirportInfo = (code: string) => {
  const airport = airports.find(a => a.code === code);
  return airport ? `${airport.code} - ${airport.city}` : code;
};

const getAirlineInfo = (code: string) => {
  const airline = airlines.find(a => a.code === code);
  return airline ? `${airline.name} (${airline.code})` : code;
};

export const columns: ColumnDef<FlightColumn>[] = [
  {
    accessorKey: "flightNumber",
    header: "Flight Number",
  },
  {
    accessorKey: "airline",
    header: "Airline",
    cell: ({ row }) => getAirlineInfo(row.getValue("airline")),
  },
  {
    accessorKey: "fromCity",
    header: "From",
    cell: ({ row }) => getAirportInfo(row.getValue("fromCity")),
  },
  {
    accessorKey: "toCity",
    header: "To",
    cell: ({ row }) => getAirportInfo(row.getValue("toCity")),
  },
  {
    accessorKey: "departureDate",
    header: "Departure",
    cell: ({ row }) => {
      const date = new Date(row.getValue("departureDate"));
      return date.toLocaleString();
    },
  },
  {
    accessorKey: "returnDate",
    header: "Return",
    cell: ({ row }) => {
      const date = row.getValue("returnDate");
      if (!date) return "One-way";
      return typeof date === 'string' ? new Date(date).toLocaleString() : date.toLocaleString();
    },
  },
  {
    accessorKey: "price",
    header: "Price",
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("price"));
      const formatted = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(amount);
      return formatted;
    },
  },
  {
    accessorKey: "availableSeats",
    header: "Available Seats",
  },
  {
    id: "actions",
    cell: ({ row }) => <CellAction data={row.original} />,
  },
];

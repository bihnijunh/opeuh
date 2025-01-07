"use client";

import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { EditBookingDialog } from "./edit-dialog";
import { updateBooking } from "./actions";

export type BookedFlight = {
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

const getStatusColor = (status: string) => {
  switch (status) {
    case "CONFIRMED":
      return "success";
    case "IN_FLIGHT":
      return "secondary";
    case "DELAYED":
      return "warning";
    case "CANCELLED":
      return "destructive";
    case "COMPLETED":
      return "success";
    case "PENDING":
      return "warning";
    default:
      return "default";
  }
};

const formatStatus = (status: string) => {
  return status.split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
};

export const columns: ColumnDef<BookedFlight>[] = [
  {
    accessorKey: "ticketNumber",
    header: "Ticket Number"
  },
  {
    accessorKey: "flightNumber",
    header: "Flight Number"
  },
  {
    accessorKey: "passengerName",
    header: "Passenger Name"
  },
  {
    accessorKey: "passengerEmail",
    header: "Email"
  },
  {
    accessorKey: "departure",
    header: "From"
  },
  {
    accessorKey: "arrival",
    header: "To"
  },
  {
    accessorKey: "departureTime",
    header: "Departure Time",
    cell: ({ row }) => {
      const value = row.getValue("departureTime") as string;
      if (value === 'N/A') return value;
      return format(new Date(value), "PPp");
    }
  },
  {
    accessorKey: "arrivalTime",
    header: "Arrival Time",
    cell: ({ row }) => {
      const value = row.getValue("arrivalTime") as string;
      if (value === 'N/A') return value;
      return format(new Date(value), "PPp");
    }
  },
  {
    accessorKey: "amount",
    header: "Amount",
    cell: ({ row }) => {
      const amount = row.getValue("amount") as number;
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
      }).format(amount);
    }
  },
  {
    accessorKey: "paymentMethod",
    header: "Payment Method"
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status") as string;
      return (
        <Badge variant={getStatusColor(status)}>
          {formatStatus(status)}
        </Badge>
      );
    }
  },
  {
    accessorKey: "createdAt",
    header: "Booking Date",
    cell: ({ row }) => {
      const value = row.getValue("createdAt") as string;
      return format(new Date(value), "PPp");
    }
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const booking = row.original;
      return <EditBookingDialog booking={booking} onUpdate={updateBooking} />;
    }
  }
];

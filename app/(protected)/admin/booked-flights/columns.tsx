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
  fromCity: string;
  toCity: string;
  departureDate: string;
  returnDate: string | null;
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
    header: "Ticket Number",
  },
  {
    accessorKey: "passengerName",
    header: "Passenger Name",
  },
  {
    accessorKey: "flightNumber",
    header: "Flight Number",
  },
  {
    accessorKey: "fromCity",
    header: "From",
  },
  {
    accessorKey: "toCity",
    header: "To",
  },
  {
    accessorKey: "departureDate",
    header: "Departure Date",
    cell: ({ row }) => format(new Date(row.getValue("departureDate")), "PPp"),
  },
  {
    accessorKey: "returnDate",
    header: "Return Date",
    cell: ({ row }) => {
      const returnDate = row.getValue("returnDate") as string | null;
      if (!returnDate) return "N/A";
      try {
        return format(new Date(returnDate), "PPp");
      } catch (error) {
        console.error("[FORMAT_RETURN_DATE]", error);
        return "Invalid Date";
      }
    },
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
    },
  },
  {
    accessorKey: "amount",
    header: "Amount",
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("amount"));
      const formatted = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(amount);
      return formatted;
    },
  },
  {
    accessorKey: "paymentMethod",
    header: "Payment Method"
  },
  {
    accessorKey: "createdAt",
    header: "Booking Date",
    cell: ({ row }) => format(new Date(row.getValue("createdAt")), "PPp"),
  },
  {
    id: "actions",
    cell: ({ row }) => <EditBookingDialog booking={row.original} onSave={updateBooking} />,
  }
];

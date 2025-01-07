"use client";

import { DataTable } from "@/components/ui/data-table";
import { columns } from "./columns";
import { BookedFlight } from "./columns";

interface BookedFlightTableProps {
  data: BookedFlight[];
}

export function BookedFlightTable({ data }: BookedFlightTableProps) {
  return <DataTable 
    columns={columns} 
    data={data} 
    searchKey="ticketNumber"
  />;
}

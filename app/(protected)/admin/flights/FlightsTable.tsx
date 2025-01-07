"use client";

import { useState, useEffect } from 'react';
import { getFlights } from "@/actions/flight";
import { DataTable } from "@/components/ui/data-table";
import { columns } from "./columns";
import { toast } from "react-hot-toast";

interface Flight {
  id: string;
  fromCity: string;
  toCity: string;
  departureDate: string;
  returnDate: string | null;
  price: number;
  availableSeats: number;
  airline: string;
  flightNumber: string;
  createdAt: string;
}

export function FlightsTable() {
  const [flights, setFlights] = useState<Flight[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchFlights() {
      try {
        const result = await getFlights();
        if (result.error) {
          toast.error(result.error);
        } else {
          // Format dates for display
          const formattedFlights = result.data.map((flight: any) => ({
            ...flight,
            departureDate: new Date(flight.departureDate).toLocaleString(),
            returnDate: flight.returnDate ? new Date(flight.returnDate).toLocaleString() : null,
            createdAt: new Date(flight.createdAt).toLocaleString(),
          }));
          setFlights(formattedFlights);
        }
      } catch (error) {
        toast.error("Failed to fetch flights");
      } finally {
        setIsLoading(false);
      }
    }

    fetchFlights();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-24">
        Loading...
      </div>
    );
  }

  return (
    <DataTable 
      searchKey="fromCity" 
      columns={columns} 
      data={flights} 
    />
  );
}

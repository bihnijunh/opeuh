"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { getFlightStatusByParams } from "@/actions/flight";
import { format } from "date-fns";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { FlightStatusDisplay } from "@/components/flight-status-display";

export default function FlightStatusPage() {
  const searchParams = useSearchParams();
  const [flightData, setFlightData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFlightStatus = async () => {
      setLoading(true);
      try {
        const ticketNumber = searchParams.get("ticketNumber") || undefined;
        const from = searchParams.get("from") || undefined;
        const to = searchParams.get("to") || undefined;
        const date = searchParams.get("date") || undefined;

        if (!ticketNumber && (!from || !to || !date)) {
          setError("Invalid search parameters");
          return;
        }

        const result = await getFlightStatusByParams({
          ticketNumber,
          from,
          to,
          date,
        });

        if (result.error) {
          setError(result.error);
          return;
        }

        setFlightData(result.data);
        setError(null);
      } catch (err) {
        setError("Failed to fetch flight status");
      } finally {
        setLoading(false);
      }
    };

    fetchFlightStatus();
  }, [searchParams]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center space-x-4 mb-6">
          <Link href="/">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Search
            </Button>
          </Link>
        </div>
        <div className="w-full max-w-4xl mx-auto bg-white rounded-xl shadow-lg p-8 text-center">
          Loading flight status...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center space-x-4 mb-6">
          <Link href="/">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Search
            </Button>
          </Link>
        </div>
        <div className="w-full max-w-4xl mx-auto bg-white rounded-xl shadow-lg p-8">
          <div className="text-red-500 text-center">{error}</div>
        </div>
      </div>
    );
  }

  if (!flightData) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center space-x-4 mb-6">
          <Link href="/">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Search
            </Button>
          </Link>
        </div>
        <div className="w-full max-w-4xl mx-auto bg-white rounded-xl shadow-lg p-8 text-center">
          Flight not found
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center space-x-4 mb-6">
        <Link href="/">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Search
          </Button>
        </Link>
      </div>
      <FlightStatusDisplay
        flightNumber={flightData.flightNumber}
        airline={flightData.airline}
        departureTime={flightData.actualDepartureTime || flightData.scheduledDepartureTime}
        arrivalTime={flightData.estimatedArrivalTime || flightData.scheduledArrivalTime}
        scheduledDeparture={flightData.scheduledDepartureTime}
        scheduledArrival={flightData.scheduledArrivalTime}
        fromAirport={flightData.fromCity}
        toAirport={flightData.toCity}
        departureTerminal={flightData.departureTerminal || "TBD"}
        departureGate={flightData.departureGate || "TBD"}
        arrivalTerminal={flightData.arrivalTerminal || "TBD"}
        arrivalGate={flightData.arrivalGate || "TBD"}
        baggageClaim={flightData.baggageClaim || "TBD"}
        aircraft={`${flightData.aircraftModel || "TBD"} (${flightData.aircraftType || "TBD"})`}
        status={flightData.status || "On Time"}
      />
    </div>
  );
}

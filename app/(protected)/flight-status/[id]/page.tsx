"use client";

import { useEffect, useState } from "react";
import { getFlightStatus } from "@/actions/flight";
import { format } from "date-fns";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

interface FlightStatusPageProps {
  params: {
    id: string;
  };
}

export default function FlightStatusPage({ params }: FlightStatusPageProps) {
  const [flightData, setFlightData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFlightStatus = async () => {
      const result = await getFlightStatus(params.id);
      if (result.error) {
        setError(result.error);
      } else {
        setFlightData(result.data);
      }
    };

    fetchFlightStatus();
    // Refresh every minute
    const interval = setInterval(fetchFlightStatus, 60000);
    return () => clearInterval(interval);
  }, [params.id]);

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-red-500">{error}</div>
      </div>
    );
  }

  if (!flightData) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div>Loading...</div>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "On Time":
        return "text-green-500";
      case "Delayed":
        return "text-orange-500";
      case "Cancelled":
        return "text-red-500";
      case "In Flight":
        return "text-blue-500";
      case "Landed":
        return "text-green-500";
      default:
        return "text-gray-500";
    }
  };

  const formatTime = (date: string | Date) => {
    return format(new Date(date), "h:mm a");
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <Link
          href="/search"
          className="flex items-center text-blue-500 hover:text-blue-600"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to results
        </Link>
      </div>

      <h1 className="text-4xl font-bold mb-2">Flight status</h1>
      <h2 className="text-2xl text-gray-600 mb-8">
        {flightData.fromCity} to {flightData.toCity}
      </h2>
      <div className="text-lg text-gray-600 mb-8">
        {format(new Date(flightData.departureDate), "EEEE, MMMM d, yyyy")}
      </div>

      <div className="bg-gray-50 rounded-lg p-6 mb-8">
        <div className="grid grid-cols-4 gap-6">
          <div>
            <h3 className="text-lg font-semibold mb-2">Flight</h3>
            <div className="flex items-center space-x-4">
              <div className="text-xl">{flightData.flightNumber}</div>
              <div className="text-gray-600">{flightData.airline}</div>
            </div>
            <div className="flex items-center mt-2">
              <div className={`text-lg font-semibold ${getStatusColor(flightData.status)}`}>
                {flightData.status}
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-2">Depart</h3>
            <div className="text-xl">
              {flightData.actualDepartureTime
                ? formatTime(flightData.actualDepartureTime)
                : formatTime(flightData.scheduledDepartureTime)}
            </div>
            <div className="text-gray-600">
              Scheduled: {formatTime(flightData.scheduledDepartureTime)}
            </div>
            <div className="text-gray-600">Terminal: {flightData.departureTerminal}</div>
            <div className="text-gray-600">Gate: {flightData.departureGate}</div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-2">Arrive</h3>
            <div className="text-xl">
              {formatTime(flightData.estimatedArrivalTime)}
            </div>
            <div className="text-gray-600">
              Scheduled: {formatTime(flightData.scheduledArrivalTime)}
            </div>
            <div className="text-gray-600">Terminal: {flightData.arrivalTerminal}</div>
            <div className="text-gray-600">Gate: {flightData.arrivalGate}</div>
            <div className="text-gray-600">Baggage: {flightData.baggageClaim}</div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-2">Aircraft</h3>
            <div className="text-xl">{flightData.aircraft.model}</div>
            <div className="text-gray-600">{flightData.aircraft.type}</div>
          </div>
        </div>
      </div>

      <div className="flex justify-end space-x-4">
        <Link
          href={`/track/${params.id}`}
          className="text-blue-500 hover:text-blue-600"
        >
          Track flight
        </Link>
        <Link
          href={`/alerts/${params.id}`}
          className="text-blue-500 hover:text-blue-600"
        >
          Get alerts for this flight
        </Link>
      </div>
    </div>
  );
}

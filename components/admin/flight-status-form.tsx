"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DateTimePicker } from "@/components/ui/date-time-picker";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { updateFlightStatus } from "@/actions/flight";
import { toast } from "sonner";

interface FlightStatusFormProps {
  flightId: string;
  initialData: {
    status?: string;
    departureTerminal?: string;
    arrivalTerminal?: string;
    departureGate?: string;
    arrivalGate?: string;
    baggageClaim?: string;
    aircraftModel?: string;
    aircraftType?: string;
    actualDepartureTime?: Date;
    estimatedArrivalTime?: Date;
    scheduledDepartureTime?: Date;
    scheduledArrivalTime?: Date;
  };
}

const flightStatuses = [
  "On Time",
  "Delayed",
  "Cancelled",
  "In Flight",
  "Landed",
];

const aircraftModels = [
  "Boeing 737",
  "Boeing 747",
  "Boeing 777",
  "Boeing 787",
  "Airbus A320",
  "Airbus A330",
  "Airbus A350",
  "Airbus A380",
  "Embraer E190",
  "Bombardier CRJ900",
];

const aircraftTypes = [
  "Narrow-body",
  "Wide-body",
  "Regional Jet",
  "Turboprop",
];

export function FlightStatusForm({ flightId, initialData }: FlightStatusFormProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState(initialData);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const result = await updateFlightStatus(flightId, formData);
      if (result.error) {
        toast.error(result.error);
      } else {
        toast.success("Flight status updated successfully");
      }
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium mb-1">Status</label>
          <Select
            value={formData.status || ""}
            onValueChange={(value) => setFormData({ ...formData, status: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              {flightStatuses.map((status) => (
                <SelectItem key={status} value={status}>
                  {status}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Departure Terminal</label>
          <Input
            value={formData.departureTerminal || ""}
            onChange={(e) => setFormData({ ...formData, departureTerminal: e.target.value })}
            placeholder="Enter departure terminal"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Arrival Terminal</label>
          <Input
            value={formData.arrivalTerminal || ""}
            onChange={(e) => setFormData({ ...formData, arrivalTerminal: e.target.value })}
            placeholder="Enter arrival terminal"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Departure Gate</label>
          <Input
            value={formData.departureGate || ""}
            onChange={(e) => setFormData({ ...formData, departureGate: e.target.value })}
            placeholder="Enter departure gate"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Arrival Gate</label>
          <Input
            value={formData.arrivalGate || ""}
            onChange={(e) => setFormData({ ...formData, arrivalGate: e.target.value })}
            placeholder="Enter arrival gate"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Baggage Claim</label>
          <Input
            value={formData.baggageClaim || ""}
            onChange={(e) => setFormData({ ...formData, baggageClaim: e.target.value })}
            placeholder="Enter baggage claim"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Aircraft Model</label>
          <Select
            value={formData.aircraftModel || ""}
            onValueChange={(value) => setFormData({ ...formData, aircraftModel: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select aircraft model" />
            </SelectTrigger>
            <SelectContent>
              {aircraftModels.map((model) => (
                <SelectItem key={model} value={model}>
                  {model}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Aircraft Type</label>
          <Select
            value={formData.aircraftType || ""}
            onValueChange={(value) => setFormData({ ...formData, aircraftType: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select aircraft type" />
            </SelectTrigger>
            <SelectContent>
              {aircraftTypes.map((type) => (
                <SelectItem key={type} value={type}>
                  {type}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Actual Departure Time</label>
          <DateTimePicker
            date={formData.actualDepartureTime}
            setDate={(date) => setFormData({ ...formData, actualDepartureTime: date })}
            disablePastDates={false}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Estimated Arrival Time</label>
          <DateTimePicker
            date={formData.estimatedArrivalTime}
            setDate={(date) => setFormData({ ...formData, estimatedArrivalTime: date })}
            disablePastDates={false}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Scheduled Departure Time</label>
          <DateTimePicker
            date={formData.scheduledDepartureTime}
            setDate={(date) => setFormData({ ...formData, scheduledDepartureTime: date })}
            disablePastDates={false}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Scheduled Arrival Time</label>
          <DateTimePicker
            date={formData.scheduledArrivalTime}
            setDate={(date) => setFormData({ ...formData, scheduledArrivalTime: date })}
            disablePastDates={false}
          />
        </div>
      </div>

      <div className="flex justify-end">
        <Button type="submit" disabled={loading}>
          {loading ? "Saving..." : "Save Changes"}
        </Button>
      </div>
    </form>
  );
}

"use client";

import * as React from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { airports } from "@/lib/airports";

interface AirportSelectProps {
  value?: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  excludeAirport?: string;
}

export function AirportSelect({
  value,
  onChange,
  disabled,
  excludeAirport,
}: AirportSelectProps) {
  const filteredAirports = excludeAirport
    ? airports.filter((airport) => airport.code !== excludeAirport)
    : airports;

  return (
    <Select
      disabled={disabled}
      value={value}
      onValueChange={onChange}
    >
      <SelectTrigger>
        <SelectValue placeholder="Select airport" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>United States</SelectLabel>
          {filteredAirports
            .filter((airport) => airport.country === "United States")
            .map((airport) => (
              <SelectItem key={airport.code} value={airport.code}>
                {airport.code} - {airport.city} ({airport.name})
              </SelectItem>
            ))}
        </SelectGroup>
        <SelectGroup>
          <SelectLabel>International</SelectLabel>
          {filteredAirports
            .filter((airport) => airport.country !== "United States")
            .map((airport) => (
              <SelectItem key={airport.code} value={airport.code}>
                {airport.code} - {airport.city} ({airport.name})
              </SelectItem>
            ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}

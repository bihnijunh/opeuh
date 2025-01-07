"use client";

import * as React from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { airlines } from "@/lib/airlines";

interface AirlineSelectProps {
  value?: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}

export function AirlineSelect({
  value,
  onChange,
  disabled,
}: AirlineSelectProps) {
  return (
    <Select
      disabled={disabled}
      value={value}
      onValueChange={onChange}
    >
      <SelectTrigger>
        <SelectValue placeholder="Select airline" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          {airlines.map((airline) => (
            <SelectItem key={airline.code} value={airline.code}>
              {airline.name} ({airline.code})
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}

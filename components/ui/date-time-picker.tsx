"use client"

import * as React from "react"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { format } from "date-fns"
import { CalendarIcon, Clock } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface DateTimePickerProps {
  date: Date | undefined
  setDate: (date: Date | undefined) => void
  disabled?: boolean
  label?: string
  disablePastDates?: boolean
}

export function DateTimePicker({ date, setDate, disabled, label, disablePastDates = false }: DateTimePickerProps) {
  const minutesList = Array.from({ length: 4 }, (_, i) => i * 15)
  const hoursList = Array.from({ length: 24 }, (_, i) => i)

  const handleTimeChange = (type: 'hours' | 'minutes', value: string) => {
    if (!date) return

    const newDate = new Date(date)
    if (type === 'hours') {
      newDate.setHours(parseInt(value))
    } else {
      newDate.setMinutes(parseInt(value))
    }
    setDate(newDate)
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          disabled={disabled}
          className={cn(
            "w-full justify-start text-left font-normal",
            !date && "text-muted-foreground"
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {date ? format(date, "PPP p") : label || "Pick a date and time"}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <div className="p-3">
          <Calendar
            mode="single"
            selected={date}
            onSelect={(newDate) => {
              if (newDate) {
                const newDateTime = new Date(newDate)
                if (date) {
                  newDateTime.setHours(date.getHours())
                  newDateTime.setMinutes(date.getMinutes())
                } else {
                  newDateTime.setHours(12)
                  newDateTime.setMinutes(0)
                }
                setDate(newDateTime)
              } else {
                setDate(undefined)
              }
            }}
            disabled={disablePastDates ? (date) => date < new Date() : undefined}
            initialFocus
          />
          <div className="flex items-center gap-2 px-3 py-2 border-t">
            <Clock className="h-4 w-4" />
            <div className="flex gap-2">
              <Select
                value={date ? date.getHours().toString() : undefined}
                onValueChange={(value) => handleTimeChange('hours', value)}
              >
                <SelectTrigger className="w-[70px]">
                  <SelectValue placeholder="HH" />
                </SelectTrigger>
                <SelectContent className="h-[200px]">
                  {hoursList.map((hour) => (
                    <SelectItem key={hour} value={hour.toString()}>
                      {hour.toString().padStart(2, '0')}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <span className="text-lg">:</span>
              <Select
                value={date ? (Math.floor(date.getMinutes() / 15) * 15).toString() : undefined}
                onValueChange={(value) => handleTimeChange('minutes', value)}
              >
                <SelectTrigger className="w-[70px]">
                  <SelectValue placeholder="MM" />
                </SelectTrigger>
                <SelectContent>
                  {minutesList.map((minute) => (
                    <SelectItem key={minute} value={minute.toString()}>
                      {minute.toString().padStart(2, '0')}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}

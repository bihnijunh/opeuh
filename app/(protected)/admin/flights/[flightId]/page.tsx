"use client";

import * as z from "zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useParams, useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import { Trash } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { AlertModal } from "@/components/modals/alert-modal";
import { createFlight, deleteFlight, getFlight, updateFlight } from "@/actions/flight";
import { AirportSelect } from "@/components/ui/airport-select";
import { airports } from "@/lib/airports";
import { AirlineSelect } from "@/components/ui/airline-select";
import { airlines } from "@/lib/airlines";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { FlightStatusForm } from "@/components/admin/flight-status-form";

export default function FlightForm() {
  const params = useParams();
  const flightId = params?.flightId as string;
  const router = useRouter();

  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedAirline, setSelectedAirline] = useState("");
  const [flightData, setFlightData] = useState<any>(null);

  const formSchema = z.object({
    fromCity: z.string().min(1).refine((val: string): val is string => airports.some(a => a.code === val), {
      message: "Please select a valid departure airport"
    }),
    toCity: z.string().min(1).refine((val: string): val is string => airports.some(a => a.code === val), {
      message: "Please select a valid arrival airport"
    }),
    departureDate: z.string().min(1),
    returnDate: z.string().optional(),
    price: z.coerce.number().min(0),
    availableSeats: z.coerce.number().min(0),
    airline: z.string().min(1).refine((val: string): val is string => airlines.some(a => a.code === val), {
      message: "Please select a valid airline"
    }),
    flightNumber: z.string().min(1).refine((val: string): val is string => {
      const airline = airlines.find(a => a.code === selectedAirline);
      if (!airline) return false;
      const pattern = new RegExp(`^${airline.flightNumberPrefix}\\d{1,4}$`);
      return pattern.test(val);
    }, {
      message: "Invalid flight number format"
    }).superRefine((val, ctx) => {
      const airline = airlines.find(a => a.code === selectedAirline);
      if (!airline) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Please select an airline first",
        });
        return z.NEVER;
      }
      
      const pattern = new RegExp(`^${airline.flightNumberPrefix}\\d{1,4}$`);
      if (!pattern.test(val)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: `Flight number must start with ${airline.flightNumberPrefix} followed by 1-4 digits`,
        });
        return z.NEVER;
      }
    }),
    generateVariations: z.boolean().default(false),
    numberOfFlights: z.coerce.number().min(1).max(10).optional(),
    priceMin: z.coerce.number().min(0).optional(),
    priceMax: z.coerce.number().min(0).optional(),
    seatsMin: z.coerce.number().min(1).optional(),
    seatsMax: z.coerce.number().min(1).optional(),
    hoursBetweenFlights: z.coerce.number().min(1).max(24).optional(),
  });

  type FlightFormValues = z.infer<typeof formSchema>;

  const form = useForm<FlightFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fromCity: "",
      toCity: "",
      departureDate: "",
      returnDate: "",
      price: 0,
      availableSeats: 0,
      airline: "",
      flightNumber: "",
      generateVariations: false,
    },
  });

  useEffect(() => {
    if (flightId !== "new") {
      getFlight(flightId).then((result) => {
        if (result.data) {
          setFlightData(result.data);
          setSelectedAirline(result.data.airline);
          form.reset({
            fromCity: result.data.fromCity,
            toCity: result.data.toCity,
            departureDate: result.data.departureDate.toISOString().split('T')[0],
            returnDate: result.data.returnDate ? result.data.returnDate.toISOString().split('T')[0] : undefined,
            price: result.data.price,
            availableSeats: result.data.availableSeats,
            airline: result.data.airline,
            flightNumber: result.data.flightNumber,
            generateVariations: false,
          });
        }
      });
    }
  }, [flightId, form]);

  const title = flightId === "new" ? "Create Flight" : "Edit Flight";

  const onSubmit = async (data: FlightFormValues) => {
    try {
      setLoading(true);

      if (flightId === "new") {
        const result = await createFlight({
          departureAirport: data.fromCity,
          arrivalAirport: data.toCity,
          departureTime: data.departureDate,
          arrivalTime: data.returnDate || data.departureDate,
          price: data.price,
          availableSeats: data.availableSeats,
          flightNumber: data.flightNumber,
          userId: "system", // Using a default system user ID
          airline: data.airline,
          fromCity: data.fromCity,
          toCity: data.toCity,
          variations: data.generateVariations ? {
            numberOfFlights: data.numberOfFlights,
            minPrice: data.priceMin,
            maxPrice: data.priceMax,
            minSeats: data.seatsMin,
            maxSeats: data.seatsMax,
            hoursBetween: data.hoursBetweenFlights,
          } : undefined,
        });

        if (result.error) {
          toast.error(result.error);
        } else {
          router.refresh();
          router.push("/admin/flights");
          toast.success("Flight created successfully");
        }
      } else {
        const result = await updateFlight(flightId, {
          departureAirport: data.fromCity,
          arrivalAirport: data.toCity,
          departureTime: data.departureDate,
          arrivalTime: data.returnDate || data.departureDate,
          price: data.price,
          availableSeats: data.availableSeats,
          flightNumber: data.flightNumber,
          userId: "system",
          airline: data.airline,
          fromCity: data.fromCity,
          toCity: data.toCity,
        });

        if (result.error) {
          toast.error(result.error);
        } else {
          router.refresh();
          router.push("/admin/flights");
          toast.success("Flight updated successfully");
        }
      }
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const onDelete = async () => {
    try {
      setLoading(true);
      const result = await deleteFlight(flightId);
      
      if (result.error) {
        toast.error(result.error);
        return;
      }

      router.refresh();
      router.push("/admin/flights");
      toast.success("Flight deleted successfully");
    } catch (error) {
      toast.error("Make sure you removed all bookings using this flight first.");
    } finally {
      setLoading(false);
      setOpen(false);
    }
  };

  return (
    <>
      <AlertModal 
        isOpen={open} 
        onClose={() => setOpen(false)}
        onConfirm={onDelete}
        loading={loading}
      />
      <div className="flex items-center justify-between">
        <Card className="w-full">
          <CardHeader>
            <CardTitle>{title}</CardTitle>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 w-full">
                <div className="grid grid-cols-1 gap-8">
                  <FormField
                    control={form.control}
                    name="fromCity"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>From</FormLabel>
                        <FormControl>
                          <AirportSelect
                            value={field.value}
                            onChange={field.onChange}
                            excludeAirport={form.watch("toCity")}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="toCity"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>To</FormLabel>
                        <FormControl>
                          <AirportSelect
                            value={field.value}
                            onChange={field.onChange}
                            excludeAirport={form.watch("fromCity")}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="departureDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Departure Date</FormLabel>
                        <FormControl>
                          <Input type="datetime-local" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="returnDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Return Date (Optional)</FormLabel>
                        <FormControl>
                          <Input type="datetime-local" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="price"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Price</FormLabel>
                        <FormControl>
                          <Input type="number" min="0" step="0.01" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="availableSeats"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Available Seats</FormLabel>
                        <FormControl>
                          <Input type="number" min="0" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="airline"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Airline</FormLabel>
                        <FormControl>
                          <AirlineSelect
                            value={field.value}
                            onChange={(value) => {
                              setSelectedAirline(value);
                              field.onChange(value);
                              form.setValue("flightNumber", "");
                            }}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="flightNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Flight Number</FormLabel>
                        <FormControl>
                          <Input {...field} disabled={!selectedAirline} />
                        </FormControl>
                        <FormMessage />
                        {selectedAirline && (
                          <FormDescription>
                            Must start with {airlines.find(a => a.code === selectedAirline)?.flightNumberPrefix} followed by 1-4 digits
                          </FormDescription>
                        )}
                      </FormItem>
                    )}
                  />

                  <Accordion type="single" collapsible>
                    <AccordionItem value="variations">
                      <AccordionTrigger>Flight Variations</AccordionTrigger>
                      <AccordionContent>
                        <div className="space-y-4">
                          <FormField
                            control={form.control}
                            name="generateVariations"
                            render={({ field }) => (
                              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                                <FormControl>
                                  <Checkbox
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                  />
                                </FormControl>
                                <div className="space-y-1 leading-none">
                                  <FormLabel>Generate flight variations</FormLabel>
                                  <FormDescription>
                                    This will create additional flights with varying prices and seats
                                  </FormDescription>
                                </div>
                              </FormItem>
                            )}
                          />

                          {form.watch("generateVariations") && (
                            <div className="space-y-4">
                              <FormField
                                control={form.control}
                                name="numberOfFlights"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Number of Variations</FormLabel>
                                    <FormControl>
                                      <Input type="number" min="1" max="10" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />

                              <div className="grid grid-cols-2 gap-4">
                                <FormField
                                  control={form.control}
                                  name="priceMin"
                                  render={({ field }) => (
                                    <FormItem>
                                      <FormLabel>Min Price</FormLabel>
                                      <FormControl>
                                        <Input type="number" min="0" {...field} />
                                      </FormControl>
                                      <FormMessage />
                                    </FormItem>
                                  )}
                                />

                                <FormField
                                  control={form.control}
                                  name="priceMax"
                                  render={({ field }) => (
                                    <FormItem>
                                      <FormLabel>Max Price</FormLabel>
                                      <FormControl>
                                        <Input type="number" min="0" {...field} />
                                      </FormControl>
                                      <FormMessage />
                                    </FormItem>
                                  )}
                                />

                                <FormField
                                  control={form.control}
                                  name="seatsMin"
                                  render={({ field }) => (
                                    <FormItem>
                                      <FormLabel>Min Seats</FormLabel>
                                      <FormControl>
                                        <Input type="number" min="1" {...field} />
                                      </FormControl>
                                      <FormMessage />
                                    </FormItem>
                                  )}
                                />

                                <FormField
                                  control={form.control}
                                  name="seatsMax"
                                  render={({ field }) => (
                                    <FormItem>
                                      <FormLabel>Max Seats</FormLabel>
                                      <FormControl>
                                        <Input type="number" min="1" {...field} />
                                      </FormControl>
                                      <FormMessage />
                                    </FormItem>
                                  )}
                                />
                              </div>

                              <FormField
                                control={form.control}
                                name="hoursBetweenFlights"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Hours Between Flights</FormLabel>
                                    <FormControl>
                                      <Input type="number" min="1" max="24" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                            </div>
                          )}
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </div>
                <div className="flex items-center justify-between">
                  <Button disabled={loading} type="submit">
                    {loading ? "Saving..." : "Save Changes"}
                  </Button>
                  {flightId !== "new" && (
                    <Button
                      disabled={loading}
                      type="button"
                      variant="destructive"
                      onClick={() => setOpen(true)}
                    >
                      <Trash className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </form>
            </Form>

            {flightId !== "new" && (
              <div className="mt-8">
                <Card>
                  <CardHeader>
                    <CardTitle>Flight Status</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <FlightStatusForm
                      flightId={flightId}
                      initialData={{
                        status: flightData?.status,
                        departureTerminal: flightData?.departureTerminal,
                        arrivalTerminal: flightData?.arrivalTerminal,
                        departureGate: flightData?.departureGate,
                        arrivalGate: flightData?.arrivalGate,
                        baggageClaim: flightData?.baggageClaim,
                        aircraftModel: flightData?.aircraftModel,
                        aircraftType: flightData?.aircraftType,
                        actualDepartureTime: flightData?.actualDepartureTime,
                        estimatedArrivalTime: flightData?.estimatedArrivalTime,
                        scheduledDepartureTime: flightData?.scheduledDepartureTime,
                        scheduledArrivalTime: flightData?.scheduledArrivalTime,
                      }}
                    />
                  </CardContent>
                </Card>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </>
  );
}

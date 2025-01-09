"use client";

import * as z from "zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";
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
import { Trash } from "lucide-react";

const flightFormSchema = z.object({
  fromCity: z.string({
    required_error: "From city is required",
  }),
  toCity: z.string({
    required_error: "To city is required",
  }).refine(val => val !== "", {
    message: "To city is required"
  }),
  departureDate: z.string({
    required_error: "Departure date is required",
  }),
  returnDate: z.string().optional(),
  price: z.coerce.number().min(0, {
    message: "Price must be greater than 0",
  }),
  availableSeats: z.coerce.number().min(1, {
    message: "Available seats must be at least 1",
  }),
  airline: z.string({
    required_error: "Airline is required",
  }),
  flightNumber: z.string({
    required_error: "Flight number is required",
  }).refine((val) => {
    if (!val) return false;
    // Flight number format: 2 uppercase letters followed by 1-4 digits
    return /^[A-Z]{2}\d{1,4}$/.test(val);
  }, {
    message: "Invalid flight number format. Must be 2 uppercase letters followed by 1-4 digits",
  }),
  generateVariations: z.boolean().default(false),
  numberOfFlights: z.coerce.number().min(1).max(10).optional(),
  priceMin: z.coerce.number().min(0).optional(),
  priceMax: z.coerce.number().min(0).optional(),
  seatsMin: z.coerce.number().min(1).optional(),
  seatsMax: z.coerce.number().min(1).optional(),
  hoursBetweenFlights: z.coerce.number().min(1).max(24).optional(),
});

type FlightFormValues = z.infer<typeof flightFormSchema>;

export default function FlightForm() {
  const params = useParams();
  const router = useRouter();
  const flightId = params?.flightId as string;
  const isNew = flightId === "create";
  const [loading, setLoading] = useState(false);
  const [flightData, setFlightData] = useState<any>(null);
  const [open, setOpen] = useState(false);

  const form = useForm<FlightFormValues>({
    resolver: zodResolver(flightFormSchema),
    defaultValues: {
      fromCity: "",
      toCity: "",
      departureDate: "",
      returnDate: "",
      price: 0,
      availableSeats: 100,
      airline: "",
      flightNumber: "",
      generateVariations: false,
    },
  });

  // Watch form values for cross-field validation
  const fromCity = form.watch("fromCity");
  const toCity = form.watch("toCity");
  const departureDate = form.watch("departureDate");
  const returnDate = form.watch("returnDate");

  useEffect(() => {
    if (fromCity && toCity && fromCity === toCity) {
      form.setError("toCity", {
        message: "Departure and arrival cities must be different"
      });
    }
  }, [fromCity, toCity, form]);

  useEffect(() => {
    if (departureDate && returnDate) {
      const dDate = new Date(departureDate);
      const rDate = new Date(returnDate);
      if (rDate <= dDate) {
        form.setError("returnDate", {
          message: "Return date must be after departure date"
        });
      }
    }
  }, [departureDate, returnDate, form]);

  useEffect(() => {
    if (!isNew) {
      getFlight(flightId).then((result) => {
        if (result.data) {
          setFlightData(result.data);
          form.reset({
            fromCity: result.data.fromCity,
            toCity: result.data.toCity,
            departureDate: result.data.departureDate.toString().split('T')[0],
            returnDate: result.data.returnDate?.toString().split('T')[0],
            price: result.data.price,
            availableSeats: result.data.availableSeats,
            airline: result.data.airline,
            flightNumber: result.data.flightNumber,
            generateVariations: false,
          });
        }
      });
    }
  }, [form, flightId, isNew]);

  const title = isNew ? "Create Flight" : "Edit Flight";
  const description = isNew 
    ? "Add a new flight to the system" 
    : "Edit an existing flight's details";

  const onSubmit = async (data: FlightFormValues) => {
    try {
      setLoading(true);

      if (isNew) {
        const result = await createFlight({
          fromCity: data.fromCity,
          toCity: data.toCity,
          departureDate: data.departureDate,
          returnDate: data.returnDate,
          price: data.price,
          availableSeats: data.availableSeats,
          flightNumber: data.flightNumber,
          airline: data.airline,
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
          fromCity: data.fromCity,
          toCity: data.toCity,
          departureDate: data.departureDate,
          returnDate: data.returnDate,
          price: data.price,
          availableSeats: data.availableSeats,
          flightNumber: data.flightNumber,
          airline: data.airline,
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
      } else {
        router.push('/admin/flights');
        toast.success('Flight deleted successfully');
      }
      router.refresh();
    } catch (error) {
      toast.error('Something went wrong');
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
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
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
                          <Input type="date" {...field} />
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
                          <Input type="date" {...field} />
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
                        <div className="flex space-x-2">
                          <FormControl>
                            <Input {...field} disabled={!form.watch("airline")} />
                          </FormControl>
                          {form.watch("airline") && (
                            <Button
                              type="button"
                              variant="outline"
                              onClick={() => {
                                const airline = airlines.find((a: { code: string }) => a.code === form.watch("airline"));
                                if (airline) {
                                  const randomNum = Math.floor(Math.random() * 9000) + 1000;
                                  form.setValue("flightNumber", `${airline.flightNumberPrefix}${randomNum}`);
                                }
                              }}
                            >
                              Generate
                            </Button>
                          )}
                        </div>
                        <FormMessage />
                        {form.watch("airline") && (
                          <FormDescription>
                            Must start with {airlines.find((a: { code: string }) => a.code === form.watch("airline"))?.flightNumberPrefix} followed by 1-4 digits
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
                <div className="flex items-center gap-x-2">
                  <Button disabled={loading} type="submit">
                    {loading ? "Saving..." : isNew ? "Create Flight" : "Save Changes"}
                  </Button>
                  {!isNew && (
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
          </CardContent>
        </Card>
      </div>
    </>
  );
}

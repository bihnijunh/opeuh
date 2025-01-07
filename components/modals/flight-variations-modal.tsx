"use client";

import { useState } from "react";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Loader2 } from "lucide-react";

const formSchema = z.object({
  numberOfFlights: z.coerce.number().min(1).max(10),
  priceMin: z.coerce.number().min(0),
  priceMax: z.coerce.number().min(0),
  seatsMin: z.coerce.number().min(1),
  seatsMax: z.coerce.number().min(1),
  hoursBetweenFlights: z.coerce.number().min(1).max(24),
});

type FlightVariationsFormValues = z.infer<typeof formSchema>;

interface FlightVariationsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (data: FlightVariationsFormValues) => void;
  loading?: boolean;
}

export const FlightVariationsModal: React.FC<FlightVariationsModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  loading
}) => {
  const form = useForm<FlightVariationsFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      numberOfFlights: 3,
      priceMin: 100,
      priceMax: 500,
      seatsMin: 50,
      seatsMax: 200,
      hoursBetweenFlights: 2,
    }
  });

  const onSubmit = async (data: FlightVariationsFormValues) => {
    onConfirm(data);
  };

  return (
    <Modal
      title="Generate Flight Variations"
      description="Create multiple flights with different times, prices, and seats"
      isOpen={isOpen}
      onClose={onClose}
    >
      <div>
        <div className="space-y-4 py-2 pb-4">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="numberOfFlights"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Number of Flights</FormLabel>
                    <FormControl>
                      <Input
                        disabled={loading}
                        type="number"
                        min={1}
                        max={10}
                        {...field}
                      />
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
                      <FormLabel>Minimum Price ($)</FormLabel>
                      <FormControl>
                        <Input
                          disabled={loading}
                          type="number"
                          min={0}
                          {...field}
                        />
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
                      <FormLabel>Maximum Price ($)</FormLabel>
                      <FormControl>
                        <Input
                          disabled={loading}
                          type="number"
                          min={0}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="seatsMin"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Minimum Seats</FormLabel>
                      <FormControl>
                        <Input
                          disabled={loading}
                          type="number"
                          min={1}
                          {...field}
                        />
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
                      <FormLabel>Maximum Seats</FormLabel>
                      <FormControl>
                        <Input
                          disabled={loading}
                          type="number"
                          min={1}
                          {...field}
                        />
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
                      <Input
                        disabled={loading}
                        type="number"
                        min={1}
                        max={24}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="pt-6 space-x-2 flex items-center justify-end w-full">
                <Button
                  disabled={loading}
                  variant="outline"
                  onClick={onClose}
                >
                  Cancel
                </Button>
                <Button disabled={loading} type="submit">
                  {loading && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  Generate
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </div>
    </Modal>
  );
};

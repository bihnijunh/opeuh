"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { getFlights } from "@/actions/flight";
import { format, parseISO, isSameDay, isAfter, addDays } from "date-fns";
import { QRCodeSVG } from "qrcode.react";
import { toast } from "sonner";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import Navbar from "../components/navigation/navbar";
import Image from "next/image";
import { ArrowLongRightIcon } from "@heroicons/react/24/outline";
import { Flight as PrismaFlight } from "@prisma/client";
import { getPaymentMethods } from "@/actions/payment-method";
import { bookFlight } from "@/actions/booking";

interface FlightWithVariations extends PrismaFlight {
  variations?: PrismaFlight[];
}

interface DisplayFlight {
  id: string;
  fromCity: string;
  toCity: string;
  departureDate: string;
  returnDate: string | null;
  price: number;
  availableSeats: number;
  airline: string;
  flightNumber: string;
}

interface GroupedFlights {
  date: Date;
  flights: DisplayFlight[];
}

interface PaymentMethodType {
  // Add payment method types here
}

interface PaymentMethod {
  id: string;
  name: string;
  type: PaymentMethodType;
  description?: string;
  instructions: string;
  accountInfo: string | null;
  walletAddress: string | null;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export default function FlightsPage() {
  const searchParams = useSearchParams();
  const [flights, setFlights] = useState<DisplayFlight[]>([]);
  const [groupedFlights, setGroupedFlights] = useState<GroupedFlights[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const isOneWay = !searchParams.get("returnDate");
  const [selectedFlight, setSelectedFlight] = useState<DisplayFlight | null>(null);
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string>("");
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [passengerName, setPassengerName] = useState("");

  useEffect(() => {
    const searchFlights = async () => {
      try {
        const result = await getFlights({
          fromCity: searchParams.get("from") || "",
          toCity: searchParams.get("to") || "",
          ...(isOneWay ? {} : { departureDate: searchParams.get("departureDate") || "" }),
        });

        if (result.error) {
          setError(result.error);
        } else if (result.data) {
          // Convert PrismaFlight to DisplayFlight
          const displayFlights: DisplayFlight[] = result.data.map(flight => ({
            id: flight.id,
            fromCity: flight.fromCity,
            toCity: flight.toCity,
            departureDate: flight.departureDate.toISOString(),
            returnDate: flight.returnDate?.toISOString() || null,
            price: flight.price,
            availableSeats: flight.availableSeats,
            airline: flight.airline,
            flightNumber: flight.flightNumber,
          }));

          // Group flights by date
          const grouped = displayFlights.reduce((acc: GroupedFlights[], flight) => {
            const date = parseISO(flight.departureDate);
            const existingGroup = acc.find((group) =>
              isSameDay(group.date, date)
            );

            if (existingGroup) {
              existingGroup.flights.push(flight);
            } else {
              acc.push({ date, flights: [flight] });
            }

            return acc;
          }, []);

          // Sort groups by date
          grouped.sort((a, b) => a.date.getTime() - b.date.getTime());
          
          // Sort flights within each group by price
          grouped.forEach((group) => {
            group.flights.sort((a, b) => a.price - b.price);
          });

          setGroupedFlights(grouped);
          setFlights(displayFlights);
        }
      } catch (error) {
        setError("Failed to fetch flights");
      } finally {
        setLoading(false);
      }
    };

    searchFlights();
  }, [searchParams, isOneWay]);

  useEffect(() => {
    const fetchPaymentMethods = async () => {
      try {
        const result = await getPaymentMethods();
        if (result.data) {
          setPaymentMethods(result.data.map(method => ({
            ...method,
            isActive: true,
            instructions: method.instructions || '',
            walletAddress: method.walletAddress || null,
            accountInfo: method.accountInfo || null
          })).filter(method => method.isActive));
        } else if (result.error) {
          toast.error("Failed to load payment methods");
        }
      } catch (error) {
        console.error("Failed to fetch payment methods:", error);
        toast.error("Failed to load payment methods");
      }
    };

    if (isBookingModalOpen) {
      fetchPaymentMethods();
    }
  }, [isBookingModalOpen]);

  const handleBookFlight = async (flight: DisplayFlight) => {
    setSelectedFlight(flight);
    setIsBookingModalOpen(true);
  };

  const handleConfirmBooking = async () => {
    if (!selectedFlight || !selectedPaymentMethod) {
      toast.error("Please select a payment method");
      return;
    }

    if (!email || !email.trim()) {
      toast.error("Please enter your email address");
      return;
    }

    if (!passengerName || !passengerName.trim()) {
      toast.error("Please enter passenger name");
      return;
    }

    // Basic email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      toast.error("Please enter a valid email address");
      return;
    }

    try {
      const result = await bookFlight({
        flightId: selectedFlight.id,
        paymentMethodId: selectedPaymentMethod,
        amount: selectedFlight.price,
        email: email.trim(),
        passengerName: passengerName.trim(),
      });
      
      if (result.error) {
        toast.error(result.error);
      } else {
        toast.success("Flight booked successfully!");
        setIsBookingModalOpen(false);
        setSelectedFlight(null);
        setSelectedPaymentMethod("");
        
        // Refresh flights list
        const searchParams = new URLSearchParams(window.location.search);
        const flightsResult = await getFlights({
          fromCity: searchParams.get("from") || "",
          toCity: searchParams.get("to") || "",
          ...(isOneWay ? {} : { departureDate: searchParams.get("departureDate") || "" }),
        });

        if (flightsResult.error) {
          setError(flightsResult.error);
        } else if (flightsResult.data) {
          const displayFlights: DisplayFlight[] = flightsResult.data.map(flight => ({
            id: flight.id,
            fromCity: flight.fromCity,
            toCity: flight.toCity,
            departureDate: flight.departureDate.toISOString(),
            returnDate: flight.returnDate?.toISOString() || null,
            price: flight.price,
            availableSeats: flight.availableSeats,
            airline: flight.airline,
            flightNumber: flight.flightNumber,
          }));
          setFlights(displayFlights);
        }
      }
    } catch (error) {
      toast.error("Failed to book flight");
    }
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="flex flex-col justify-center items-center min-h-screen bg-gray-50 dark:bg-gray-900">
          <div className="relative">
            {/* Airplane */}
            <div className="animate-pulse">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="w-16 h-16 text-blue-600 dark:text-blue-400 transform rotate-90 animate-bounce"
              >
                <path d="M3.478 2.404a.75.75 0 0 0-.926.941l2.432 7.905H13.5a.75.75 0 0 1 0 1.5H4.984l-2.432 7.905a.75.75 0 0 0 .926.94 60.519 60.519 0 0 0 18.445-8.986.75.75 0 0 0 0-1.218A60.517 60.517 0 0 0 3.478 2.404Z" />
              </svg>
            </div>
            {/* Flight trail */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 -z-10">
              <div className="w-24 h-1 bg-gradient-to-r from-transparent via-blue-400 to-transparent rounded-full animate-pulse"></div>
            </div>
          </div>
          <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">Finding the best flights for you...</p>
        </div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <Navbar />
        <div className="flex justify-center items-center min-h-screen bg-gray-50 dark:bg-gray-900">
          <div className="text-red-500">{error}</div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-[72px]">
        <div className="container mx-auto px-4 py-8 max-w-7xl">
          <h1 className="text-3xl font-bold mb-8 text-gray-900 dark:text-white">
            {isOneWay ? "Available Flights" : "Round Trip Flights"}
          </h1>
          
          <div className="space-y-8">
            {isOneWay ? (
              groupedFlights.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
                  <p className="text-gray-500 dark:text-gray-400 text-lg">No flights found for your search criteria.</p>
                </div>
              ) : (
                groupedFlights.map((group) => (
                  <div key={group.date.toISOString()} className="space-y-4">
                    <h2 className="text-lg font-semibold mb-4">
                      {format(group.date, "EEEE, MMMM d")}
                      {isAfter(group.date, new Date()) && (
                        <span className="text-sm font-normal text-gray-500 ml-2">
                          ({format(group.date, "PPP")})
                        </span>
                      )}
                    </h2>
                    <div className="grid gap-4">
                      {group.flights.map((flight) => (
                        <div
                          key={flight.id}
                          className="bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 p-6 border border-gray-100 dark:border-gray-700"
                        >
                          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                            <div className="flex-1 space-y-4">
                              <div className="flex items-center gap-3">
                                <h3 className="font-semibold text-lg text-gray-900 dark:text-white">{flight.fromCity}</h3>
                                <span className="px-2 py-1 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-xs font-medium rounded-full">
                                  Direct
                                </span>
                              </div>
                              <div className="flex items-center gap-4 text-gray-600 dark:text-gray-300">
                                <div className="flex flex-col">
                                  <span className="text-lg font-medium">{flight.fromCity}</span>
                                  <span className="text-sm text-gray-500 dark:text-gray-400">
                                    {format(parseISO(flight.departureDate), "h:mm a")}
                                  </span>
                                </div>
                                <ArrowLongRightIcon className="h-6 w-6 text-gray-400 dark:text-gray-500" />
                                <div className="flex flex-col">
                                  <span className="text-lg font-medium">{flight.toCity}</span>
                                  <span className="text-sm text-gray-500 dark:text-gray-400">
                                    {format(parseISO(flight.departureDate), "h:mm a")}
                                  </span>
                                </div>
                              </div>
                            </div>
                            <div className="flex flex-col items-end gap-3 min-w-[200px]">
                              <div className="text-right">
                                <p className="text-3xl font-bold text-gray-900 dark:text-white">
                                  ${flight.price}
                                </p>
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                  {flight.availableSeats} seats available
                                </p>
                              </div>
                              <Button 
                                onClick={() => handleBookFlight(flight)}
                                disabled={flight.availableSeats < 1}
                              >
                                {flight.availableSeats < 1 ? "Sold Out" : "Book Flight"}
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))
              )
            ) : (
              flights.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
                  <p className="text-gray-500 dark:text-gray-400 text-lg">No flights found for your search criteria.</p>
                </div>
              ) : (
                <div className="grid gap-4">
                  {flights.map((flight) => (
                    <div
                      key={flight.id}
                      className="bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 p-6 border border-gray-100 dark:border-gray-700"
                    >
                      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                        <div className="flex-1 space-y-4">
                          <div className="flex items-center gap-3">
                            <h3 className="font-semibold text-lg text-gray-900 dark:text-white">{flight.fromCity}</h3>
                            <span className="px-2 py-1 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-xs font-medium rounded-full">
                              Direct
                            </span>
                          </div>
                          <div className="flex items-center gap-4 text-gray-600 dark:text-gray-300">
                            <div className="flex flex-col">
                              <span className="text-lg font-medium">{flight.fromCity}</span>
                              <span className="text-sm text-gray-500 dark:text-gray-400">
                                {format(parseISO(flight.departureDate), "h:mm a")}
                              </span>
                            </div>
                            <ArrowLongRightIcon className="h-6 w-6 text-gray-400 dark:text-gray-500" />
                            <div className="flex flex-col">
                              <span className="text-lg font-medium">{flight.toCity}</span>
                              <span className="text-sm text-gray-500 dark:text-gray-400">
                                {format(parseISO(flight.departureDate), "h:mm a")}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="flex flex-col items-end gap-3 min-w-[200px]">
                          <div className="text-right">
                            <p className="text-3xl font-bold text-gray-900 dark:text-white">
                              ${flight.price}
                            </p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                              {flight.availableSeats} seats available
                            </p>
                          </div>
                          <Button 
                            onClick={() => handleBookFlight(flight)}
                            disabled={flight.availableSeats < 1}
                          >
                            {flight.availableSeats < 1 ? "Sold Out" : "Book Flight"}
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )
            )}
          </div>
        </div>
      </div>

      <Dialog open={isBookingModalOpen} onOpenChange={setIsBookingModalOpen}>
        <DialogContent className="sm:max-w-[600px] p-0 max-h-[90vh] overflow-hidden">
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-8 text-white">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold text-white">Book Flight</DialogTitle>
              <DialogDescription className="text-gray-100 mt-2">
                Complete your booking by selecting a payment method below.
              </DialogDescription>
            </DialogHeader>
          </div>

          {selectedFlight && (
            <div className="overflow-y-auto" style={{ maxHeight: "calc(90vh - 200px)" }}>
              <div className="p-8 space-y-6">
                <Accordion type="single" collapsible defaultValue="flight-details">
                  <AccordionItem value="flight-details">
                    <AccordionTrigger className="text-lg font-semibold">
                      Flight Details
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded-xl mt-2">
                        <div className="space-y-1">
                          <span className="text-gray-500 text-sm">From</span>
                          <p className="font-semibold text-lg">{selectedFlight.fromCity}</p>
                        </div>
                        <div className="space-y-1">
                          <span className="text-gray-500 text-sm">To</span>
                          <p className="font-semibold text-lg">{selectedFlight.toCity}</p>
                        </div>
                        <div className="space-y-1">
                          <span className="text-gray-500 text-sm">Departure Date</span>
                          <p className="font-semibold">
                            {format(parseISO(selectedFlight.departureDate), "MMM d, yyyy")}
                          </p>
                        </div>
                        <div className="space-y-1">
                          <span className="text-gray-500 text-sm">Return Date</span>
                          <p className="font-semibold">
                            {selectedFlight.returnDate ? format(parseISO(selectedFlight.returnDate), "MMM d, yyyy") : 'N/A'}
                          </p>
                        </div>
                        <div className="space-y-1">
                          <span className="text-gray-500 text-sm">Price</span>
                          <p className="font-semibold text-xl">${selectedFlight.price}</p>
                        </div>
                        <div className="space-y-1">
                          <span className="text-gray-500 text-sm">Airline</span>
                          <p className="font-semibold text-lg">{selectedFlight.airline}</p>
                        </div>
                        <div className="space-y-1">
                          <span className="text-gray-500 text-sm">Flight Number</span>
                          <p className="font-semibold text-lg">{selectedFlight.flightNumber}</p>
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="payment-method">
                    <AccordionTrigger className="text-lg font-semibold">
                      Payment Method
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-4 mt-2">
                        {paymentMethods.map((method) => (
                          <div
                            key={method.id}
                            className={`relative border-2 rounded-xl p-4 cursor-pointer transition-all duration-200 ${
                              selectedPaymentMethod === method.id
                                ? 'border-indigo-600 bg-indigo-50'
                                : 'border-gray-200 hover:border-indigo-200 hover:bg-gray-50'
                            }`}
                            onClick={() => setSelectedPaymentMethod(method.id)}
                          >
                            <div className="flex items-start gap-4">
                              <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center mt-1 ${
                                selectedPaymentMethod === method.id
                                  ? 'border-indigo-600'
                                  : 'border-gray-300'
                              }`}>
                                {selectedPaymentMethod === method.id && (
                                  <div className="w-3 h-3 rounded-full bg-indigo-600" />
                                )}
                              </div>
                              <div className="flex-1">
                                <div className="flex items-center justify-between">
                                  <h3 className="font-medium text-gray-900">{method.name}</h3>
                                  {method.description && (
                                    <span className="text-sm text-gray-500">{method.description}</span>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="contact-information">
                    <AccordionTrigger className="text-lg font-semibold">
                      Contact Information
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-4 mt-2">
                        <div className="space-y-3">
                          <Label className="flex items-center gap-1.5 text-gray-700 dark:text-gray-200 text-base">
                            Passenger Name
                            <span className="text-red-500 text-lg">*</span>
                          </Label>
                          <div className="relative">
                            <input
                              type="text"
                              value={passengerName}
                              onChange={(e) => setPassengerName(e.target.value)}
                              placeholder="Enter passenger's full name"
                              className="w-full p-4 pl-12 text-base bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:border-indigo-500 dark:focus:border-indigo-400 text-gray-800 dark:text-gray-200 transition-colors duration-200"
                              required
                            />
                            <span className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                              <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-indigo-500 dark:text-indigo-400" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                              </svg>
                            </span>
                          </div>
                        </div>

                        <div className="space-y-3">
                          <Label className="flex items-center gap-1.5 text-gray-700 dark:text-gray-200 text-base">
                            Email
                            <span className="text-red-500 text-lg">*</span>
                          </Label>
                          <div className="relative">
                            <input
                              type="email"
                              value={email}
                              onChange={(e) => setEmail(e.target.value)}
                              placeholder="Enter your email address"
                              className="w-full p-4 pl-12 text-base bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:border-indigo-500 dark:focus:border-indigo-400 text-gray-800 dark:text-gray-200 transition-colors duration-200"
                              required
                              pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$"
                            />
                            <span className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                              <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-indigo-500 dark:text-indigo-400" viewBox="0 0 20 20" fill="currentColor">
                                <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                                <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                              </svg>
                            </span>
                          </div>
                          <p className="text-sm text-gray-500 dark:text-gray-400 pl-1">
                            We&apos;ll send your booking confirmation and updates to this email
                          </p>
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>

                  {selectedPaymentMethod && (
                    <AccordionItem value="payment-instructions">
                      <AccordionTrigger className="text-lg font-semibold">
                        Payment Instructions
                      </AccordionTrigger>
                      <AccordionContent>
                        <div className="space-y-4 mt-2">
                          {(() => {
                            const selectedMethod = paymentMethods.find(m => m.id === selectedPaymentMethod);
                            if (!selectedMethod) return null;

                            return (
                              <>
                                <div className="bg-gray-50 p-4 rounded-xl space-y-4">
                                  <div className="prose prose-indigo">
                                    <p className="text-gray-700">{selectedMethod.instructions}</p>
                                  </div>

                                  {selectedMethod.type === "CRYPTOCURRENCY" && selectedMethod.walletAddress && (
                                    <div className="space-y-4">
                                      <div className="relative">
                                        <Label className="block text-sm font-medium text-gray-700 mb-1">
                                          Wallet Address
                                        </Label>
                                        <div className="flex items-center space-x-2">
                                          <input
                                            type="text"
                                            value={selectedMethod.walletAddress}
                                            readOnly
                                            className="w-full p-3 bg-white border border-gray-300 rounded-lg text-sm font-mono"
                                          />
                                          <Button
                                            type="button"
                                            variant="outline"
                                            onClick={() => {
                                              navigator.clipboard.writeText(selectedMethod.walletAddress!);
                                              toast.success("Wallet address copied to clipboard!");
                                            }}
                                          >
                                            Copy
                                          </Button>
                                        </div>
                                      </div>

                                      <div className="flex flex-col items-center justify-center p-4 bg-white rounded-xl border border-gray-200">
                                        <Label className="block text-sm font-medium text-gray-700 mb-3">
                                          Scan QR Code
                                        </Label>
                                        <QRCodeSVG
                                          value={selectedMethod.walletAddress}
                                          size={200}
                                          level="H"
                                          includeMargin={true}
                                          className="mb-2"
                                        />
                                        <p className="text-sm text-gray-500 text-center mt-2">
                                          Scan this QR code with your wallet app
                                        </p>
                                      </div>
                                    </div>
                                  )}

                                  {selectedMethod.accountInfo && (
                                    <div className="mt-4">
                                      <Label className="block text-sm font-medium text-gray-700 mb-1">
                                        Account Information
                                      </Label>
                                      <p className="text-gray-600">{selectedMethod.accountInfo}</p>
                                    </div>
                                  )}
                                </div>
                              </>
                            );
                          })()}
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  )}
                </Accordion>

                <div className="flex justify-end gap-3 pt-4 border-t">
                  <Button
                    variant="outline"
                    onClick={() => setIsBookingModalOpen(false)}
                    className="px-6"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleConfirmBooking}
                    disabled={!selectedPaymentMethod || !email || !passengerName}
                    className="px-6 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white"
                  >
                    Complete Booking
                  </Button>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}

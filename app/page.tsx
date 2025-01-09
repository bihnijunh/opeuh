"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { CalendarIcon, MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import Navbar from "./components/navigation/navbar";
import ImageSlider from "./components/hero/image-slider";
import TodaysOffers, { NewsAndOffers } from "./components/offers/todays-offers";
import Footer from "./components/footer/footer";
import { useRouter } from "next/navigation";
import { airports } from "@/lib/airports";
import { DateTimePicker } from "@/components/ui/date-time-picker";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { FlightStatusDisplay } from "@/components/flight-status-display";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";

const FlightSearchForm = () => {
  const router = useRouter();
  const [tripType, setTripType] = useState("roundTrip");
  const [fromQuery, setFromQuery] = useState("");
  const [toQuery, setToQuery] = useState("");
  const [fromSuggestions, setFromSuggestions] = useState<typeof airports>([]);
  const [toSuggestions, setToSuggestions] = useState<typeof airports>([]);
  const [selectedFrom, setSelectedFrom] = useState<(typeof airports)[0] | null>(null);
  const [selectedTo, setSelectedTo] = useState<(typeof airports)[0] | null>(null);
  const [departureDate, setDepartureDate] = useState<Date | undefined>();
  const [returnDate, setReturnDate] = useState<Date | undefined>();
  const [loading, setLoading] = useState(false);

  const handleFromSearch = (query: string) => {
    setFromQuery(query);
    setSelectedFrom(null);
    if (query.length > 0) {
      const filtered = airports.filter(
        airport =>
          airport.code.toLowerCase().includes(query.toLowerCase()) ||
          airport.city.toLowerCase().includes(query.toLowerCase()) ||
          airport.name.toLowerCase().includes(query.toLowerCase())
      );
      setFromSuggestions(filtered);
    } else {
      setFromSuggestions([]);
    }
  };

  const handleToSearch = (query: string) => {
    setToQuery(query);
    setSelectedTo(null);
    if (query.length > 0) {
      const filtered = airports.filter(
        airport =>
          airport.code.toLowerCase().includes(query.toLowerCase()) ||
          airport.city.toLowerCase().includes(query.toLowerCase()) ||
          airport.name.toLowerCase().includes(query.toLowerCase())
      );
      setToSuggestions(filtered);
    } else {
      setToSuggestions([]);
    }
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFrom || !selectedTo || !departureDate) return;

    setLoading(true);
    
    const searchParams = new URLSearchParams({
      from: selectedFrom.code,
      to: selectedTo.code,
      departureDate: departureDate.toISOString(),
      ...(tripType === "roundTrip" && returnDate ? { returnDate: returnDate.toISOString() } : {})
    });

    router.push(`/flights?${searchParams.toString()}`);
  };

  return (
    <motion.form 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      onSubmit={handleSearch} 
      className="w-full max-w-4xl mx-auto bg-white/95 dark:bg-gray-800/95 rounded-lg shadow-xl p-4 sm:p-6 lg:p-8 backdrop-blur-sm border border-gray-100 dark:border-gray-700 hover:shadow-2xl transition-shadow duration-300"
    >
      <div className="flex flex-col space-y-4 sm:space-y-6">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="flex flex-wrap items-center gap-3 sm:gap-6 bg-gray-50 dark:bg-gray-800/50 p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-colors duration-200"
        >
          {/* Trip Type Selection */}
          <div className="flex items-center space-x-2">
            <input
              type="radio"
              id="roundTrip"
              name="tripType"
              value="roundTrip"
              checked={tripType === "roundTrip"}
              onChange={(e) => setTripType(e.target.value)}
              className="form-radio h-4 w-4 text-blue-600 focus:ring-blue-500"
            />
            <label htmlFor="roundTrip" className="text-sm sm:text-base text-gray-700 dark:text-gray-200 whitespace-nowrap">
              Round trip
            </label>
          </div>
          <div className="flex items-center space-x-2">
            <input
              type="radio"
              id="oneWay"
              name="tripType"
              value="oneWay"
              checked={tripType === "oneWay"}
              onChange={(e) => setTripType(e.target.value)}
              className="form-radio h-4 w-4 text-blue-600 focus:ring-blue-500"
            />
            <label htmlFor="oneWay" className="text-sm sm:text-base text-gray-700 dark:text-gray-200 whitespace-nowrap">
              One way
            </label>
          </div>
        </motion.div>

        {/* From/To Fields */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="relative"
          >
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
              From
            </label>
            <div className="relative">
              <input
                type="text"
                value={fromQuery}
                onChange={(e) => handleFromSearch(e.target.value)}
                placeholder="Enter city or airport code"
                required
                className="w-full px-4 py-2.5 sm:py-3 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:border-blue-400 dark:hover:border-blue-500"
              />
              <MagnifyingGlassIcon className="h-5 w-5 text-gray-400 group-hover:text-blue-500 absolute right-3 top-1/2 -translate-y-1/2 transition-colors duration-200" />
              
              {/* From Airport Suggestions */}
              {fromSuggestions.length > 0 && !selectedFrom && (
                <motion.div 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute z-50 w-full mt-1 bg-white dark:bg-gray-800 rounded-md shadow-lg border border-gray-200 dark:border-gray-700 max-h-[300px] overflow-y-auto"
                >
                  {fromSuggestions.map((airport) => (
                    <button
                      key={airport.code}
                      type="button"
                      onClick={() => {
                        setSelectedFrom(airport);
                        setFromQuery(`${airport.city} (${airport.code})`);
                        setFromSuggestions([]);
                      }}
                      className="w-full px-4 py-3 text-left hover:bg-gray-100 dark:hover:bg-gray-700 border-b border-gray-100 dark:border-gray-700 last:border-0"
                    >
                      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1">
                        <div>
                          <div className="font-medium">{airport.city} ({airport.code})</div>
                          <div className="text-sm text-gray-500 dark:text-gray-400 truncate">{airport.name}</div>
                        </div>
                        <div className="text-xs text-gray-400">{airport.country}</div>
                      </div>
                    </button>
                  ))}
                </motion.div>
              )}
            </div>
          </motion.div>
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="relative"
          >
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
              To
            </label>
            <div className="relative">
              <input
                type="text"
                value={toQuery}
                onChange={(e) => handleToSearch(e.target.value)}
                placeholder="Enter city or airport code"
                required
                className="w-full px-4 py-2.5 sm:py-3 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:border-blue-400 dark:hover:border-blue-500"
              />
              <MagnifyingGlassIcon className="h-5 w-5 text-gray-400 group-hover:text-blue-500 absolute right-3 top-1/2 -translate-y-1/2 transition-colors duration-200" />
              
              {/* To Airport Suggestions */}
              {toSuggestions.length > 0 && !selectedTo && (
                <motion.div 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute z-50 w-full mt-1 bg-white dark:bg-gray-800 rounded-md shadow-lg border border-gray-200 dark:border-gray-700 max-h-[300px] overflow-y-auto"
                >
                  {toSuggestions.map((airport) => (
                    <button
                      key={airport.code}
                      type="button"
                      onClick={() => {
                        setSelectedTo(airport);
                        setToQuery(`${airport.city} (${airport.code})`);
                        setToSuggestions([]);
                      }}
                      className="w-full px-4 py-3 text-left hover:bg-gray-100 dark:hover:bg-gray-700 border-b border-gray-100 dark:border-gray-700 last:border-0"
                    >
                      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1">
                        <div>
                          <div className="font-medium">{airport.city} ({airport.code})</div>
                          <div className="text-sm text-gray-500 dark:text-gray-400 truncate">{airport.name}</div>
                        </div>
                        <div className="text-xs text-gray-400">{airport.country}</div>
                      </div>
                    </button>
                  ))}
                </motion.div>
              )}
            </div>
          </motion.div>
        </div>

        {/* Date Fields */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
              Depart
            </label>
            <DateTimePicker
              date={departureDate}
              setDate={setDepartureDate}
              label="Select departure date and time"
            />
          </div>
          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
              Return
            </label>
            <DateTimePicker
              date={returnDate}
              setDate={setReturnDate}
              disabled={tripType === "oneWay"}
              label="Select return date and time"
            />
          </div>
        </div>

        {/* Search Button */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="flex justify-end"
        >
          <Button 
            type="submit" 
            className="w-full sm:w-auto flex items-center justify-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-md transition-all duration-200 transform hover:scale-105"
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                <span>Searching...</span>
              </>
            ) : (
              <>
                <MagnifyingGlassIcon className="h-5 w-5" />
                <span>Search Flights</span>
              </>
            )}
          </Button>
        </motion.div>
      </div>
    </motion.form>
  );
};

const ManageTripsContent = () => {
  return (
    <div className="w-full max-w-4xl mx-auto bg-white/95 dark:bg-gray-800/95 rounded-lg shadow-xl p-4 sm:p-6 lg:p-8 backdrop-blur-sm border border-gray-100 dark:border-gray-700">
      <div className="flex flex-col space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
              Find your trip
            </label>
            <div className="relative group">
              <input
                type="text"
                placeholder="Confirmation code"
                className="w-full px-4 py-2.5 sm:py-3 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
              />
            </div>
            <p className="mt-1.5 text-xs text-gray-500 dark:text-gray-400">Enter the 6-letter confirmation code from your itinerary</p>
          </div>
          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
              Last name
            </label>
            <div className="relative group">
              <input
                type="text"
                placeholder="Enter last name"
                className="w-full px-4 py-2.5 sm:py-3 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
              />
            </div>
          </div>
        </div>
        <Button 
          className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white px-8 py-2.5 sm:py-3 rounded-md text-sm font-semibold transition-colors mx-auto"
        >
          Find reservation
        </Button>
        <div className="text-center text-sm text-gray-600 dark:text-gray-300">
          <a href="#" className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 underline transition-colors">Need help finding your trip?</a>
        </div>
      </div>
    </div>
  );
};

const FlightStatusContent = () => {
  const router = useRouter();
  const [flightData, setFlightData] = useState<any>(null);
  const [fromQuery, setFromQuery] = useState("");
  const [toQuery, setToQuery] = useState("");
  const [fromSuggestions, setFromSuggestions] = useState<typeof airports>([]);
  const [toSuggestions, setToSuggestions] = useState<typeof airports>([]);
  const [selectedFrom, setSelectedFrom] = useState<(typeof airports)[0] | null>(null);
  const [selectedTo, setSelectedTo] = useState<(typeof airports)[0] | null>(null);
  const [date, setDate] = useState<Date | undefined>();
  const [ticketNumber, setTicketNumber] = useState("");
  const [loading, setLoading] = useState(false);
  const [searchByTicket, setSearchByTicket] = useState(false);

  const handleFromSearch = (query: string) => {
    setFromQuery(query);
    setSelectedFrom(null);
    if (query.length > 0) {
      const filtered = airports.filter(
        airport =>
          airport.code.toLowerCase().includes(query.toLowerCase()) ||
          airport.city.toLowerCase().includes(query.toLowerCase()) ||
          airport.name.toLowerCase().includes(query.toLowerCase())
      );
      setFromSuggestions(filtered);
    } else {
      setFromSuggestions([]);
    }
  };

  const handleToSearch = (query: string) => {
    setToQuery(query);
    setSelectedTo(null);
    if (query.length > 0) {
      const filtered = airports.filter(
        airport =>
          airport.code.toLowerCase().includes(query.toLowerCase()) ||
          airport.city.toLowerCase().includes(query.toLowerCase()) ||
          airport.name.toLowerCase().includes(query.toLowerCase())
      );
      setToSuggestions(filtered);
    } else {
      setToSuggestions([]);
    }
  };

  const handleTicketNumberChange = (value: string) => {
    setTicketNumber(value);
    setSearchByTicket(value.length > 0);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValidSearch()) return;

    setLoading(true);
    
    const searchParams = new URLSearchParams();
    
    if (searchByTicket) {
      searchParams.append('ticketNumber', ticketNumber);
    } else {
      searchParams.append('from', selectedFrom!.code);
      searchParams.append('to', selectedTo!.code);
      searchParams.append('date', date!.toISOString());
    }

    router.push(`/flight-status?${searchParams.toString()}`);
  };

  const isValidSearch = () => {
    if (searchByTicket) {
      return ticketNumber.length > 0;
    }
    return selectedFrom && selectedTo && date;
  };

  return (
    <div className="w-full">
      <div className="max-w-4xl mx-auto p-4">
        {/* Search Form */}
        <form onSubmit={handleSubmit} className="space-y-6 mb-8">
          <div className="relative mb-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
              Ticket number
            </label>
            <div className="relative group">
              <input
                type="text"
                value={ticketNumber}
                onChange={(e) => handleTicketNumberChange(e.target.value)}
                placeholder="Enter ticket number (e.g., TKT074890)"
                className="w-full px-4 py-2.5 sm:py-3 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
              />
            </div>
            <div className="mt-2 text-sm text-gray-500">
              Enter your ticket number or use the search form below
            </div>
          </div>

          {!searchByTicket && (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                <div className="relative">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                    From
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={fromQuery}
                      onChange={(e) => handleFromSearch(e.target.value)}
                      placeholder="Enter city or airport code"
                      className="w-full px-4 py-2.5 sm:py-3 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                    />
                    <MagnifyingGlassIcon className="h-5 w-5 text-gray-400 group-hover:text-gray-500 absolute right-3 top-1/2 -translate-y-1/2 transition-colors" />
                    
                    {fromSuggestions.length > 0 && !selectedFrom && (
                      <div className="absolute z-50 w-full mt-1 bg-white dark:bg-gray-800 rounded-md shadow-lg border border-gray-200 dark:border-gray-700 max-h-[300px] overflow-y-auto">
                        {fromSuggestions.map((airport) => (
                          <button
                            key={airport.code}
                            type="button"
                            onClick={() => {
                              setSelectedFrom(airport);
                              setFromQuery(`${airport.city} (${airport.code})`);
                              setFromSuggestions([]);
                            }}
                            className="w-full px-4 py-3 text-left hover:bg-gray-100 dark:hover:bg-gray-700 border-b border-gray-100 dark:border-gray-700 last:border-0"
                          >
                            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1">
                              <div>
                                <div className="font-medium">{airport.city} ({airport.code})</div>
                                <div className="text-sm text-gray-500 dark:text-gray-400 truncate">{airport.name}</div>
                              </div>
                              <div className="text-xs text-gray-400">{airport.country}</div>
                            </div>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
                <div className="relative">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                    To
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={toQuery}
                      onChange={(e) => handleToSearch(e.target.value)}
                      placeholder="Enter city or airport code"
                      className="w-full px-4 py-2.5 sm:py-3 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                    />
                    <MagnifyingGlassIcon className="h-5 w-5 text-gray-400 group-hover:text-gray-500 absolute right-3 top-1/2 -translate-y-1/2 transition-colors" />
                    
                    {toSuggestions.length > 0 && !selectedTo && (
                      <div className="absolute z-50 w-full mt-1 bg-white dark:bg-gray-800 rounded-md shadow-lg border border-gray-200 dark:border-gray-700 max-h-[300px] overflow-y-auto">
                        {toSuggestions.map((airport) => (
                          <button
                            key={airport.code}
                            type="button"
                            onClick={() => {
                              setSelectedTo(airport);
                              setToQuery(`${airport.city} (${airport.code})`);
                              setToSuggestions([]);
                            }}
                            className="w-full px-4 py-3 text-left hover:bg-gray-100 dark:hover:bg-gray-700 border-b border-gray-100 dark:border-gray-700 last:border-0"
                          >
                            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1">
                              <div>
                                <div className="font-medium">{airport.city} ({airport.code})</div>
                                <div className="text-sm text-gray-500 dark:text-gray-400 truncate">{airport.name}</div>
                              </div>
                              <div className="text-xs text-gray-400">{airport.country}</div>
                            </div>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="relative">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                  Date
                </label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-full pl-3 text-left font-normal",
                        !date && "text-muted-foreground"
                      )}
                    >
                      {date ? format(date, "PPP") : <span>Pick a date</span>}
                      <CalendarIcon className="h-5 w-5 text-gray-400 group-hover:text-gray-500 ml-auto" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <DateTimePicker
                      date={date}
                      setDate={setDate}
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </>
          )}

          <Button 
            type="submit"
            disabled={loading || !isValidSearch()}
            className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white px-8 py-2.5 sm:py-3 rounded-md text-sm font-semibold transition-colors mx-auto"
          >
            {loading ? "Searching..." : "Search flight status"}
          </Button>
        </form>

        {/* Flight Status Display */}
        {flightData && (
          <FlightStatusDisplay
            flightNumber={flightData.flightNumber}
            airline={flightData.airline}
            departureTime={new Date(flightData.actualDepartureTime || flightData.departureDate)}
            arrivalTime={new Date(flightData.actualArrivalTime || flightData.arrivalTime)}
            scheduledDeparture={new Date(flightData.departureDate)}
            scheduledArrival={new Date(flightData.arrivalTime)}
            fromAirport={flightData.fromCity}
            toAirport={flightData.toCity}
            departureTerminal="8"
            departureGate="7"
            arrivalTerminal="4"
            arrivalGate="41"
            baggageClaim="T4B"
            aircraft="Airbus A321"
            status={flightData.status || "Delayed: In flight"}
          />
        )}
      </div>
    </div>
  );
};

const HomePage = () => {
  const [activeTab, setActiveTab] = useState("book");

  return (
    <div className="relative">
      {/* Navbar */}
      <Navbar />

      {/* Main Content */}
      <main className="pt-[64px]">
        {/* Hero Section */}
        <section className="relative">
          <div className="relative h-[500px] md:h-[600px]">
            <ImageSlider activeTab={activeTab} setActiveTab={setActiveTab} />
          </div>

          {/* Tabs Content Container */}
          <div className="relative max-w-[1400px] mx-auto -mt-16">
            <div className="relative z-10 px-4 sm:px-6 lg:px-8">
              <div>
                {activeTab === "book" && <FlightSearchForm />}
                {activeTab === "manage" && <ManageTripsContent />}
                {activeTab === "status" && <FlightStatusContent />}
              </div>
            </div>
          </div>
        </section>

        {/* Today's Offers Section */}
        <section className="py-16">
          <TodaysOffers />
        </section>

        {/* News and Offers Section */}
        <section className="py-16">
          <NewsAndOffers />
        </section>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default HomePage;

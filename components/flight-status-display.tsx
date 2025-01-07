import { format } from "date-fns";
import { motion } from "framer-motion";
import {
  PlaneTakeoffIcon,
  PlaneLandingIcon,
  ClockIcon,
  BuildingIcon,
  DoorOpenIcon,
  LuggageIcon,
  PlaneIcon,
  BellIcon,
  MapPinIcon,
  WifiIcon,
  BatteryChargingIcon,
  UsbIcon,
  TvIcon,
  ArrowLeftIcon
} from "lucide-react";
import { cn } from "@/lib/utils";

interface FlightStatusDisplayProps {
  flightNumber: string;
  airline: string;
  departureTime: Date;
  arrivalTime: Date;
  scheduledDeparture: Date;
  scheduledArrival: Date;
  fromAirport: string;
  toAirport: string;
  departureTerminal: string;
  departureGate: string;
  arrivalTerminal: string;
  arrivalGate: string;
  baggageClaim: string;
  aircraft: string;
  status: string;
}

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

const planeAnimation = {
  hidden: { x: -100, opacity: 0 },
  visible: { 
    x: 0, 
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 100
    }
  }
};

export function FlightStatusDisplay({
  flightNumber,
  airline,
  departureTime,
  arrivalTime,
  scheduledDeparture,
  scheduledArrival,
  fromAirport,
  toAirport,
  departureTerminal,
  departureGate,
  arrivalTerminal,
  arrivalGate,
  baggageClaim,
  aircraft,
  status
}: FlightStatusDisplayProps) {
  const isDelayed = departureTime > scheduledDeparture || arrivalTime > scheduledArrival;
  const amenities = [
    { icon: <WifiIcon className="h-5 w-5" />, label: "Wi-Fi" },
    { icon: <BatteryChargingIcon className="h-5 w-5" />, label: "Power Outlet" },
    { icon: <UsbIcon className="h-5 w-5" />, label: "USB Port" },
    { icon: <TvIcon className="h-5 w-5" />, label: "Entertainment" }
  ];

  return (
    <motion.div 
      initial="hidden"
      animate="visible"
      variants={fadeIn}
      className="w-full max-w-4xl mx-auto bg-gradient-to-br from-white to-gray-50 rounded-xl shadow-lg border border-gray-200 overflow-hidden"
    >
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6">
        <motion.div variants={fadeIn} className="space-y-3">
          <h1 className="text-3xl font-bold">{fromAirport} to {toAirport}</h1>
          <p className="text-blue-100">{format(departureTime, "EEEE, MMMM d, yyyy")}</p>
        </motion.div>
      </div>

      <div className="p-6 space-y-8">
        {/* Status Banner */}
        <motion.div
          variants={fadeIn}
          className={cn(
            "px-6 py-4 rounded-lg text-lg font-medium flex items-center space-x-3",
            isDelayed 
              ? "bg-red-50 text-red-700 border border-red-200" 
              : "bg-green-50 text-green-700 border border-green-200"
          )}
        >
          <div className="w-3 h-3 rounded-full animate-pulse bg-current" />
          <span>{status}</span>
        </motion.div>

        {/* Flight Info */}
        <motion.div variants={fadeIn} className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Flight Number & Amenities */}
          <div className="space-y-4">
            <div className="flex items-start space-x-4">
              <motion.div variants={planeAnimation}>
                <PlaneIcon className="h-8 w-8 text-blue-600" />
              </motion.div>
              <div>
                <h2 className="font-semibold text-xl">{flightNumber}</h2>
                <p className="text-gray-600">{airline}</p>
              </div>
            </div>
            <div className="border-t pt-4">
              <h3 className="text-sm font-medium text-gray-500 mb-3">Amenities</h3>
              <div className="grid grid-cols-2 gap-3">
                {amenities.map((item, index) => (
                  <motion.div
                    key={index}
                    variants={{
                      hidden: { opacity: 0, x: -20 },
                      visible: { 
                        opacity: 1, 
                        x: 0,
                        transition: { delay: index * 0.1 }
                      }
                    }}
                    className="flex items-center space-x-2 text-gray-600"
                  >
                    {item.icon}
                    <span className="text-sm">{item.label}</span>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>

          {/* Departure Info */}
          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <PlaneTakeoffIcon className="h-6 w-6 text-blue-600" />
              <div>
                <h2 className="font-semibold text-xl text-red-500">
                  {format(departureTime, "h:mm a")}
                </h2>
                <p className="text-lg font-medium">{fromAirport}</p>
              </div>
            </div>
            <div className="space-y-3 pl-9">
              <div className="flex items-center space-x-2 text-gray-600">
                <ClockIcon className="h-4 w-4" />
                <span>Scheduled: {format(scheduledDeparture, "h:mm a")}</span>
              </div>
              <div className="flex items-center space-x-2 text-gray-600">
                <BuildingIcon className="h-4 w-4" />
                <span>Terminal {departureTerminal}</span>
              </div>
              <div className="flex items-center space-x-2 text-gray-600">
                <DoorOpenIcon className="h-4 w-4" />
                <span>Gate {departureGate}</span>
              </div>
            </div>
          </div>

          {/* Arrival Info */}
          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <PlaneLandingIcon className="h-6 w-6 text-blue-600" />
              <div>
                <h2 className="font-semibold text-xl text-red-500">
                  {format(arrivalTime, "h:mm a")}
                </h2>
                <p className="text-lg font-medium">{toAirport}</p>
              </div>
            </div>
            <div className="space-y-3 pl-9">
              <div className="flex items-center space-x-2 text-gray-600">
                <ClockIcon className="h-4 w-4" />
                <span>Scheduled: {format(scheduledArrival, "h:mm a")}</span>
              </div>
              <div className="flex items-center space-x-2 text-gray-600">
                <BuildingIcon className="h-4 w-4" />
                <span>Terminal {arrivalTerminal}</span>
              </div>
              <div className="flex items-center space-x-2 text-gray-600">
                <DoorOpenIcon className="h-4 w-4" />
                <span>Gate {arrivalGate}</span>
              </div>
              <div className="flex items-center space-x-2 text-gray-600">
                <LuggageIcon className="h-4 w-4" />
                <span>Baggage Claim {baggageClaim}</span>
              </div>
            </div>
          </div>

          {/* Aircraft & Actions */}
          <div className="space-y-6">
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-2">Aircraft</h3>
              <div className="flex items-center space-x-3 text-gray-800">
                <PlaneIcon className="h-5 w-5" />
                <span className="font-medium">{aircraft}</span>
              </div>
            </div>
            <div className="space-y-3">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full flex items-center justify-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
              >
                <MapPinIcon className="h-5 w-5" />
                <span>Track flight</span>
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full flex items-center justify-center space-x-2 bg-white hover:bg-gray-50 text-blue-600 px-4 py-2 rounded-lg border-2 border-blue-600 transition-colors"
              >
                <BellIcon className="h-5 w-5" />
                <span>Get alerts</span>
              </motion.button>
            </div>
          </div>
        </motion.div>

        {/* Flight Path Visualization */}
        <motion.div 
          variants={fadeIn}
          className="relative h-20 mx-8 mt-8"
        >
          <div className="absolute inset-0 flex items-center">
            <div className="h-1 w-full bg-gray-200 rounded">
              <div 
                className="h-full bg-blue-600 rounded"
                style={{ 
                  width: "60%",
                  transition: "width 1.5s ease-in-out"
                }}
              />
            </div>
          </div>
          <motion.div
            className="absolute left-[60%] -translate-x-1/2 -translate-y-1/2"
            animate={{
              y: [0, -8, 0],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            <PlaneIcon className="h-8 w-8 text-blue-600 transform -rotate-90" />
          </motion.div>
        </motion.div>
      </div>
    </motion.div>
  );
}

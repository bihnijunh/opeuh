-- AlterTable
ALTER TABLE "Flight" ADD COLUMN "departureTerminal" TEXT,
                     ADD COLUMN "arrivalTerminal" TEXT,
                     ADD COLUMN "departureGate" TEXT,
                     ADD COLUMN "arrivalGate" TEXT,
                     ADD COLUMN "baggageClaim" TEXT,
                     ADD COLUMN "aircraftModel" TEXT,
                     ADD COLUMN "aircraftType" TEXT,
                     ADD COLUMN "actualDepartureTime" TIMESTAMP(3),
                     ADD COLUMN "estimatedArrivalTime" TIMESTAMP(3),
                     ADD COLUMN "scheduledDepartureTime" TIMESTAMP(3),
                     ADD COLUMN "scheduledArrivalTime" TIMESTAMP(3),
                     ALTER COLUMN "status" SET DEFAULT 'On Time';

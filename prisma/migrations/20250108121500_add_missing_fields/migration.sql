/*
  Warnings:

  - You are about to drop the column `btc` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `eth` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `usdt` on the `User` table. All the data in the column will be lost.
  - You are about to drop the `ReceivedTransaction` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Transaction` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "PaymentMethodType" AS ENUM ('BANK_TRANSFER', 'CREDIT_CARD', 'DEBIT_CARD');

-- DropForeignKey
ALTER TABLE "ReceivedTransaction" DROP CONSTRAINT "ReceivedTransaction_recipientId_fkey";

-- DropForeignKey
ALTER TABLE "Transaction" DROP CONSTRAINT "Transaction_recipientId_fkey";

-- DropForeignKey
ALTER TABLE "Transaction" DROP CONSTRAINT "Transaction_userId_fkey";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "btc",
DROP COLUMN "eth",
DROP COLUMN "usdt";

-- DropTable
DROP TABLE "ReceivedTransaction";

-- DropTable
DROP TABLE "Transaction";

-- CreateTable
CREATE TABLE "UserBankAccount" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "bankName" TEXT NOT NULL,
    "accountNumber" TEXT NOT NULL,
    "routingNumber" TEXT NOT NULL,
    "iban" TEXT,
    "swiftCode" TEXT,
    "accountHolderName" TEXT NOT NULL,

    CONSTRAINT "UserBankAccount_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DashboardData" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "totalBalance" DOUBLE PRECISION NOT NULL,
    "loanBalance" DOUBLE PRECISION NOT NULL,
    "wireTransfer" DOUBLE PRECISION NOT NULL,
    "domesticTransfer" DOUBLE PRECISION NOT NULL,
    "lastUpdated" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "DashboardData_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CardData" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "cardNumber" TEXT NOT NULL,
    "cardHolder" TEXT NOT NULL,
    "expiryDate" TEXT NOT NULL,
    "cvv" TEXT NOT NULL,
    "cardLimit" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "CardData_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AccountDetails" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "accountNumber" TEXT NOT NULL,
    "currency" TEXT NOT NULL,
    "accountType" TEXT NOT NULL,
    "accountLimit" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "status" TEXT NOT NULL DEFAULT 'active',

    CONSTRAINT "AccountDetails_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WireTransfer" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "beneficiaryName" TEXT NOT NULL,
    "beneficiaryBank" TEXT NOT NULL,
    "accountNumber" TEXT NOT NULL,
    "swiftCode" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "reference" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "WireTransfer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PaymentMethod" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" "PaymentMethodType" NOT NULL,
    "instructions" TEXT,
    "walletAddress" TEXT,
    "accountInfo" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PaymentMethod_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Flight" (
    "id" TEXT NOT NULL,
    "flightNumber" TEXT NOT NULL,
    "airline" TEXT NOT NULL,
    "fromCity" TEXT NOT NULL,
    "toCity" TEXT NOT NULL,
    "departureAirport" TEXT NOT NULL,
    "arrivalAirport" TEXT NOT NULL,
    "departureTime" TIMESTAMP(3) NOT NULL,
    "arrivalTime" TIMESTAMP(3) NOT NULL,
    "departureDate" TIMESTAMP(3) NOT NULL,
    "returnDate" TIMESTAMP(3),
    "price" DOUBLE PRECISION NOT NULL,
    "userId" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'scheduled',
    "availableSeats" INTEGER NOT NULL DEFAULT 100,
    "departureTerminal" TEXT,
    "arrivalTerminal" TEXT,
    "departureGate" TEXT,
    "arrivalGate" TEXT,
    "baggageClaim" TEXT,
    "aircraftModel" TEXT,
    "aircraftType" TEXT,
    "actualDepartureTime" TIMESTAMP(3),
    "estimatedArrivalTime" TIMESTAMP(3),
    "scheduledDepartureTime" TIMESTAMP(3),
    "scheduledArrivalTime" TIMESTAMP(3),

    CONSTRAINT "Flight_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FlightBooking" (
    "id" TEXT NOT NULL,
    "ticketNumber" TEXT NOT NULL DEFAULT ('TKT'::text || lpad((floor((random() * (100000)::double precision)))::text, 6, '0'::text)),
    "flightId" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "passengerName" TEXT,
    "email" TEXT,
    "amount" DOUBLE PRECISION NOT NULL,
    "paymentMethodId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "FlightBooking_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "UserBankAccount_userId_key" ON "UserBankAccount"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "DashboardData_userId_key" ON "DashboardData"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "CardData_userId_key" ON "CardData"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "AccountDetails_userId_key" ON "AccountDetails"("userId");

-- CreateIndex
CREATE INDEX "WireTransfer_userId_idx" ON "WireTransfer"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Flight_flightNumber_key" ON "Flight"("flightNumber");

-- CreateIndex
CREATE INDEX "Flight_userId_idx" ON "Flight"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "FlightBooking_ticketNumber_key" ON "FlightBooking"("ticketNumber");

-- CreateIndex
CREATE INDEX "FlightBooking_flightId_idx" ON "FlightBooking"("flightId");

-- CreateIndex
CREATE INDEX "FlightBooking_paymentMethodId_idx" ON "FlightBooking"("paymentMethodId");

-- AddForeignKey
ALTER TABLE "UserBankAccount" ADD CONSTRAINT "UserBankAccount_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DashboardData" ADD CONSTRAINT "DashboardData_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CardData" ADD CONSTRAINT "CardData_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AccountDetails" ADD CONSTRAINT "AccountDetails_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WireTransfer" ADD CONSTRAINT "WireTransfer_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Flight" ADD CONSTRAINT "Flight_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FlightBooking" ADD CONSTRAINT "FlightBooking_flightId_fkey" FOREIGN KEY ("flightId") REFERENCES "Flight"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FlightBooking" ADD CONSTRAINT "FlightBooking_paymentMethodId_fkey" FOREIGN KEY ("paymentMethodId") REFERENCES "PaymentMethod"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

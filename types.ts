import { UserRole } from "@prisma/client";

export type User = {
  id: string;
  name: string | null;
  email: string | null;
  role: UserRole;
};

export type Flight = {
  id: string;
  flightNumber: string;
  departure: string;
  arrival: string;
  date: Date;
  time: string;
  status: string;
  price: number;
};

export type BookedFlight = {
  id: string;
  ticketNumber: string;
  passengerName: string | null;
  passengerEmail: string | null;
  flightNumber: string;
  departure: string;
  arrival: string;
  departureTime: string;
  arrivalTime: string;
  status: string;
  amount: number;
  paymentMethod: string;
  createdAt: string;
};

export type Transaction = {
  id: string;
  userId: string;
  amount: number;
  type: string;
  status: string;
  createdAt: Date;
  date?: string;
  walletAddress?: string;
  transactionId?: string;
  recipientId?: string;
  senderAddress?: string;
  senderUsername?: string;
};

export interface UserWithTransactions extends User {
  btc: number;
  usdt: number;
  eth: number;
  transactions: Transaction[];
}

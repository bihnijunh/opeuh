import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


export function calculateTotal(btc: number, eth: number, usdt: number): number {
  return btc + eth + usdt;
}
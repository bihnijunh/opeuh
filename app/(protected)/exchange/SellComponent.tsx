"use client";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getExchangeRate } from "@/lib/fetExchange";

interface Currency {
  code: string;
  name: string;
}

interface SellComponentProps {
  SUPPORTED_CURRENCIES: Currency[];
}

export default function SellComponent({ SUPPORTED_CURRENCIES }: SellComponentProps) {
  const [sellAmount, setSellAmount] = useState("");
  const [receiveAmount, setReceiveAmount] = useState("");
  const [sellCurrency, setSellCurrency] = useState("BTC");
  const [receiveCurrency, setReceiveCurrency] = useState("USD");
  const [exchangeRate, setExchangeRate] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  const updateReceiveAmount = (sellValue: string) => {
    if (exchangeRate && sellValue) {
      const received = (parseFloat(sellValue) * exchangeRate).toFixed(2);
      setReceiveAmount(isNaN(parseFloat(received)) ? "" : received);
    } else {
      setReceiveAmount("");
    }
  };

  const handleSellAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSellAmount(value);
    updateReceiveAmount(value);
  };

  const handleReceiveAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setReceiveAmount(value);
    if (exchangeRate) {
      const sold = (parseFloat(value) / exchangeRate).toFixed(8);
      setSellAmount(isNaN(parseFloat(sold)) ? "" : sold);
    }
  };

  useEffect(() => {
    async function fetchRate() {
      try {
        const rate = await getExchangeRate(sellCurrency, receiveCurrency);
        console.log("Fetched rate:", rate);
        setExchangeRate(rate);
        setError(null);
        updateReceiveAmount(sellAmount);
      } catch (error) {
        console.error("Failed to fetch exchange rate:", error);
        setError(`Failed to fetch exchange rate. Please try again later.`);
        setExchangeRate(null);
      }
    }
    fetchRate();
  }, [sellCurrency, receiveCurrency]);

  useEffect(() => {
    updateReceiveAmount(sellAmount);
  }, [exchangeRate, sellAmount, sellCurrency, receiveCurrency]);

  return (
    <div className="space-y-4">
      <div>
        <p className="text-sm text-gray-500 mb-1">You Sell</p>
        <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-2">
          <Input
            type="text"
            placeholder="100-50000"
            value={sellAmount}
            onChange={handleSellAmountChange}
            className="w-full"
          />
          <Select value={sellCurrency} onValueChange={setSellCurrency}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
      {SUPPORTED_CURRENCIES.map((currency: Currency) => (
        <SelectItem key={currency.code} value={currency.code}>
          {currency.code} - {currency.name}
        </SelectItem>
      ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div>
        <p className="text-sm text-gray-500 mb-1">You Receive</p>
        <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-2">
          <Input
            type="text"
            placeholder="100-50000"
            value={receiveAmount}
            onChange={handleReceiveAmountChange}
            className="w-full"
          />
          <Select value={receiveCurrency} onValueChange={setReceiveCurrency}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {SUPPORTED_CURRENCIES.map((currency: Currency) => (
                <SelectItem key={currency.code} value={currency.code}>
                  {currency.code} - {currency.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {exchangeRate && (
        <p className="text-sm text-gray-500 break-words">
          Estimated price: 1 {sellCurrency} ≈ {exchangeRate.toFixed(6)} {receiveCurrency}
        </p>
      )}

      {error && <p className="text-sm text-red-500 mt-2">{error}</p>}

      <Button className="w-full">Sell {sellCurrency}</Button>
    </div>
  );
}
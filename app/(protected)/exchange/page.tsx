"use client";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getExchangeRate } from "@/lib/fetExchange";

type CurrencyPair = {
  [key: string]: number;
};

type StaticRates = {
  [key: string]: CurrencyPair;
};

const SUPPORTED_CURRENCIES = [
   "AED",  "ARS", "AUD", "BOB", "BRL",  "BZD", "CAD",  "CLP", "CNY", "COP", "CRC", "CUP",  "EUR",  "GBP", "HKD", "HNL", "KHR", "KID", "KMF", "KRW", "KWD", "KYD", "KZT", "LAK", "LBP", "LKR", "MXN",  "NGN",   "PHP","PYG", "QAR",  "USD", "UYU", "VES", "VND"
];

export default function P2PExchange() {
  const [payAmount, setPayAmount] = useState("");
  const [receiveAmount, setReceiveAmount] = useState("");
  const [payCurrency, setPayCurrency] = useState("HKD");
  const [receiveCurrency, setReceiveCurrency] = useState("USDT");
  const [exchangeRate, setExchangeRate] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  const updateReceiveAmount = (payValue: string) => {
    if (exchangeRate && payValue) {
      const received = (parseFloat(payValue) * exchangeRate).toFixed(8);
      setReceiveAmount(isNaN(parseFloat(received)) ? "" : received);
    } else {
      setReceiveAmount("");
    }
  };

  const handlePayAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setPayAmount(value);
    updateReceiveAmount(value);
  };

  const handleReceiveAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setReceiveAmount(value);
    if (exchangeRate) {
      const paid = (parseFloat(value) / exchangeRate).toFixed(2);
      setPayAmount(isNaN(parseFloat(paid)) ? "" : paid);
    }
  };

  useEffect(() => {
    async function fetchRate() {
      try {
        const rate = await getExchangeRate(payCurrency, receiveCurrency);
        console.log("Fetched rate:", rate);
        setExchangeRate(rate);
        setError(null);
        updateReceiveAmount(payAmount);
      } catch (error) {
        console.error("Failed to fetch exchange rate:", error);
        setError(`Failed to fetch exchange rate. Please try again later.`);
        setExchangeRate(null);
      }
    }
    fetchRate();
  }, [payCurrency, receiveCurrency]);

  useEffect(() => {
    updateReceiveAmount(payAmount);
  }, [exchangeRate, payAmount, payCurrency, receiveCurrency]);

  return (
    <div className="max-w-md mx-auto p-4">
      <Card>
        <CardContent className="p-6">
          <Tabs defaultValue="buy" className="w-full mb-6">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="buy">Buy</TabsTrigger>
              <TabsTrigger value="sell">Sell</TabsTrigger>
            </TabsList>
          </Tabs>
          
          <div className="space-y-4">
            <div>
              <p className="text-sm text-gray-500 mb-1">You Pay</p>
              <div className="flex items-center">
                <Input
                  type="text"
                  placeholder="78-300000"
                  value={payAmount}
                  onChange={handlePayAmountChange}
                  className="flex-grow"
                />
                <Select value={payCurrency} onValueChange={setPayCurrency}>
                  <SelectTrigger className="w-[100px] ml-2">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {SUPPORTED_CURRENCIES.map((currency) => (
                      <SelectItem key={currency} value={currency}>
                        {currency}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <p className="text-sm text-gray-500 mb-1">You Receive</p>
              <div className="flex items-center">
                <Input
                  type="text"
                  placeholder="10-5000"
                  value={receiveAmount}
                  onChange={handleReceiveAmountChange}
                  className="flex-grow"
                />
                <Select value={receiveCurrency} onValueChange={setReceiveCurrency}>
                  <SelectTrigger className="w-[100px] ml-2">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {SUPPORTED_CURRENCIES.map((currency) => (
                      <SelectItem key={currency} value={currency}>
                        {currency}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {exchangeRate && (
              <p className="text-sm text-gray-500">
                Estimated price: 1 {receiveCurrency} ≈ {(1 / exchangeRate).toFixed(6)} {payCurrency}
              </p>
            )}

            {error && (
              <p className="text-sm text-red-500 mt-2">
                {error}
              </p>
            )}

            <Button className="w-full">Buy {receiveCurrency}</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
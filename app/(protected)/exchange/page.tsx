"use client";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { getExchangeRate } from "@/lib/fetExchange";
import SellComponent from "./SellComponent";
import { BuyModal } from "@/components/buycrptoModal";

type CurrencyInfo = {
  code: string;
  name: string;
};

const SUPPORTED_CURRENCIES: CurrencyInfo[] = [
  { code: "BTC", name: "Bitcoin" },
  { code: "ETH", name: "Ethereum" },
  { code: "USDT", name: "Tether" },
  { code: "AED", name: "United Arab Emirates Dirham" },
  { code: "ARS", name: "Argentine Peso" },
  { code: "AUD", name: "Australian Dollar" },
  { code: "BOB", name: "Bolivian Boliviano" },
  { code: "BRL", name: "Brazilian Real" },
  { code: "BZD", name: "Belize Dollar" },
  { code: "CAD", name: "Canadian Dollar" },
  { code: "CLP", name: "Chilean Peso" },
  { code: "CNY", name: "Chinese Yuan" },
  { code: "COP", name: "Colombian Peso" },
  { code: "CRC", name: "Costa Rican Colón" },
  { code: "CUP", name: "Cuban Peso" },
  { code: "EUR", name: "Euro" },
  { code: "GBP", name: "British Pound Sterling" },
  { code: "HKD", name: "Hong Kong Dollar" },
  { code: "HNL", name: "Honduran Lempira" },
  { code: "KHR", name: "Cambodian Riel" },
  { code: "KRW", name: "South Korean Won" },
  { code: "MXN", name: "Mexican Peso" },
  { code: "NGN", name: "Nigerian Naira" },
  { code: "PHP", name: "Philippine Peso" },
  { code: "PYG", name: "Paraguayan Guaraní" },
  { code: "USD", name: "United States Dollar" },
  { code: "UYU", name: "Uruguayan Peso" },
  { code: "VES", name: "Venezuelan Bolívar" },
  { code: "VND", name: "Vietnamese Đồng" },
];

export default function P2PExchange() {
  const [payAmount, setPayAmount] = useState("");
  const [receiveAmount, setReceiveAmount] = useState("");
  const [payCurrency, setPayCurrency] = useState("USD");
  const [receiveCurrency, setReceiveCurrency] = useState("BTC");
  const [exchangeRate, setExchangeRate] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isBuyModalOpen, setIsBuyModalOpen] = useState(false);

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

  const handleOpenBuyModal = () => {
    setIsBuyModalOpen(true);
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
    <div className="max-w-md mx-auto p-4 w-full">
      <Card className="w-full">
        <CardContent className="p-6">
          <Tabs defaultValue="buy" className="w-full mb-6">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="buy">Buy</TabsTrigger>
              <TabsTrigger value="sell">Sell</TabsTrigger>
            </TabsList>
            <TabsContent value="buy">
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-500 mb-1">You Pay</p>
                  <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-2">
                    <Input
                      type="text"
                      placeholder="78-300000"
                      value={payAmount}
                      onChange={handlePayAmountChange}
                      className="w-full"
                    />
                    <Select value={payCurrency} onValueChange={setPayCurrency}>
                      <SelectTrigger className="w-full sm:w-[180px]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {SUPPORTED_CURRENCIES.map((currency) => (
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
                      placeholder="10-5000"
                      value={receiveAmount}
                      onChange={handleReceiveAmountChange}
                      className="w-full"
                    />
                    <Select value={receiveCurrency} onValueChange={setReceiveCurrency}>
                      <SelectTrigger className="w-full sm:w-[180px]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {SUPPORTED_CURRENCIES.map((currency) => (
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
                    Estimated price: 1 {receiveCurrency} ≈ {(1 / exchangeRate).toFixed(6)} {payCurrency}
                  </p>
                )}

                {error && (
                  <p className="text-sm text-red-500 mt-2">
                    {error}
                  </p>
                )}

                <Button className="w-full" onClick={handleOpenBuyModal}>Buy {receiveCurrency}</Button>
              </div>
            </TabsContent>
            <TabsContent value="sell">
              <SellComponent SUPPORTED_CURRENCIES={SUPPORTED_CURRENCIES} />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
      <BuyModal
        isOpen={isBuyModalOpen}
        onClose={() => setIsBuyModalOpen(false)}
        amount={parseFloat(payAmount) || 0}
        receiveCurrency={receiveCurrency}
        receiveAmount={parseFloat(receiveAmount) || 0}
        paymentMethods={[
          { method: "Instant Transfer", price: 9.28, isBestOffer: true },
          { method: "Bank Transfer", price: 9.34 },
        ]}
        onRefreshPrice={() => {
          // Implement refresh logic here
          console.log("Refreshing price");
        }}
      />
    </div>
  );
}
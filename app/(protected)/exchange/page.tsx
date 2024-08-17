"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SelectValue, SelectTrigger, SelectItem, SelectContent, Select } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RefreshCw, Filter } from "lucide-react";
import { VerifiedIcon } from "@/components/ui/verified-icon";
import { BuyModal } from "@/components/buycrptoModal";

export default function P2PExchange() {
  const [selectedCrypto, setSelectedCrypto] = useState("USDT");
  const [isBuyModalOpen, setIsBuyModalOpen] = useState(false);

  const openBuyModal = () => {
    setIsBuyModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-white p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <Tabs defaultValue="p2p" className="w-full mb-6">
          <TabsList className="grid w-full grid-cols-4 rounded-full bg-gray-100 p-1">
            <TabsTrigger value="express" className="rounded-full">Express</TabsTrigger>
            <TabsTrigger value="p2p" className="rounded-full">P2P</TabsTrigger>
            <TabsTrigger value="block" className="rounded-full">Block</TabsTrigger>
            <TabsTrigger value="cash" className="rounded-full">Cash</TabsTrigger>
          </TabsList>
        </Tabs>

        <Card className="rounded-2xl shadow-sm">
          <CardContent className="p-4">
            <Tabs defaultValue="buy" className="w-full mb-6">
              <TabsList className="grid w-full grid-cols-2 rounded-full bg-gray-100 p-1">
                <TabsTrigger value="buy" className="rounded-full">Buy</TabsTrigger>
                <TabsTrigger value="sell" className="rounded-full">Sell</TabsTrigger>
              </TabsList>
            </Tabs>
            
            <div className="flex items-center space-x-2 mb-4">
              <Select defaultValue="USDT">
                <SelectTrigger className="w-24 rounded-full">
                  <SelectValue placeholder="USDT" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="USDT">USDT</SelectItem>
                  <SelectItem value="BTC">BTC</SelectItem>
                  <SelectItem value="ETH">ETH</SelectItem>
                </SelectContent>
              </Select>
              <Input placeholder="Enter amount" className="flex-grow rounded-full" />
              <Select defaultValue="USD">
                <SelectTrigger className="w-24 rounded-full">
                  <SelectValue placeholder="USD" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="USD">USD</SelectItem>
                  <SelectItem value="EUR">EUR</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex justify-end space-x-2 mb-4">
              <Button variant="outline" size="icon" className="rounded-full">
                <RefreshCw className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon" className="rounded-full">
                <Filter className="h-4 w-4" />
              </Button>
            </div>

            <div className="space-y-4">
              {[1, 2].map((_, index) => (
                <Card key={index} className="rounded-2xl">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div>
                          <h3 className="font-semibold flex items-center">
                            {index === 0 ? "DGcoin" : "MoOLina"}
                            <VerifiedIcon />
                          </h3>
                          <div className="text-xs text-gray-500">
                            <span>{index === 0 ? "663" : "926"} orders</span>
                            <span className="mx-2">•</span>
                            <span>100.00% completion</span>
                            <span className="mx-2">•</span>
                            <span>15 min</span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right space-y-1">
                        <div className="font-semibold text-sm sm:text-base">{index === 0 ? "0.994" : "0.996"} USD</div>
                        <div className="text-xs sm:text-sm text-gray-500">
                          Available: <span className="font-medium">{index === 0 ? "2,224.01" : "7,585.39"} USDT</span>
                        </div>
                        <div className="text-xs sm:text-sm text-gray-500">
                          Order Limit: <span className="font-medium">${index === 0 ? "400 - $1,000" : "100 - $2,500"}</span>
                        </div>
                        <div className="text-xs sm:text-sm text-blue-600 truncate max-w-[150px] sm:max-w-none">
                          {index === 0 ? "Banco Guayaquil, Produbanco" : "Banco del pacifico, Banco Pichincha"}
                        </div>
                      </div>
                    </div>
                    <div className="mt-4 flex justify-center md:justify-end">
                      <Button 
                        className="rounded-full bg-green-500 hover:bg-green-600 text-white px-8 py-2"
                        onClick={openBuyModal}
                      >
                        Buy
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
      <BuyModal
        isOpen={isBuyModalOpen}
        onClose={() => setIsBuyModalOpen(false)}
        seller={{
          name: "inver-merlina-",
          orders: 412,
          completion: 100.00,
          verified: true,
        }}
        price={0.995}
        currency="USD"
        paymentTimeLimit="15 min"
        avgReleaseTime="18 Minutes"
        available="1,285.84 USDT"
        minAmount={999.00}
        maxAmount={1000.00}
        paymentMethod="Banco Pichincha"
        terms="solo titulares"
        onBuy={() => {
          setIsBuyModalOpen(false);
        }}
      />
    </div>
  );
}
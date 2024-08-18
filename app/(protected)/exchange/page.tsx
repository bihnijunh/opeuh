"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function P2PExchange() {
  const [payAmount, setPayAmount] = useState("");
  const [receiveAmount, setReceiveAmount] = useState("");

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
                  onChange={(e) => setPayAmount(e.target.value)}
                  className="flex-grow"
                />
                <Select defaultValue="HKD">
                  <SelectTrigger className="w-[100px] ml-2">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="HKD">HKD</SelectItem>
                    <SelectItem value="USD">USD</SelectItem>
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
                  onChange={(e) => setReceiveAmount(e.target.value)}
                  className="flex-grow"
                />
                <Select defaultValue="USDT">
                  <SelectTrigger className="w-[100px] ml-2">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="USDT">USDT</SelectItem>
                    <SelectItem value="BTC">BTC</SelectItem>
                    <SelectItem value="ETH">ETH</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <p className="text-sm text-gray-500">Estimated price: 1 USDT ≈ 7.78 HKD</p>

            <Button className="w-full">Buy USDT</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
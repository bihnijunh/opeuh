"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SelectValue, SelectTrigger, SelectItem, SelectContent, Select } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { NoticeModal } from "@/components/ui/noticeModal";
import { RefreshCw, Filter } from "lucide-react";
import { VerifiedIcon } from "@/components/ui/verified-icon";

export default function P2PExchange() {
  const [selectedCrypto, setSelectedCrypto] = useState("USDT");
  const [isNoticeModalOpen, setIsNoticeModalOpen] = useState(false);

  const openNoticeModal = () => {
    setIsNoticeModalOpen(true);
  };

  const handleNoticeConfirm = () => {
    setIsNoticeModalOpen(false);
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
                        <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
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
                      <div className="text-right">
                        <div className="font-semibold">{index === 0 ? "0.994" : "0.996"} USD</div>
                        <div className="text-xs text-gray-500">Available: {index === 0 ? "2,224.01" : "7,585.39"} USDT</div>
                        <div className="text-xs text-gray-500">Order Limit: ${index === 0 ? "400.00 - $1,000.00" : "100.00 - $2,500.00"}</div>
                        <div className="text-xs text-blue-600">
                          {index === 0 ? "Banco Guayaquil, Produbanco" : "Banco del pacifico, Banco Pichincha"}
                        </div>
                      </div>
                    </div>
                    <div className="mt-4 flex justify-center md:justify-end">
                      <Button 
                        className="rounded-full bg-green-500 hover:bg-green-600 text-white px-8 py-2"
                        onClick={openNoticeModal}
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
      <NoticeModal
        isOpen={isNoticeModalOpen}
        onClose={() => setIsNoticeModalOpen(false)}
        onConfirm={handleNoticeConfirm}
      />
    </div>
  );
}
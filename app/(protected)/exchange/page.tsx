"use client";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { SelectValue, SelectTrigger, SelectItem, SelectContent, Select } from "@/components/ui/select";

export default function Component() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-300 to-blue-200 p-4 md:p-8">
      <h1 className="text-2xl md:text-4xl text-center font-bold mb-6 md:mb-10">Exchange</h1>
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow p-4 md:p-6">
        <div className="flex flex-col md:flex-row justify-between items-start mb-4 md:mb-6">
          <div className="flex flex-col mb-4 md:mb-0">
            <span className="text-sm md:text-lg font-semibold">Exchange Crypto</span>
            <span className="text-xs md:text-sm text-gray-500">Check transaction status</span>
          </div>
          <div className="flex items-center">
            <Button className="md:mr-2" variant="outline">
             Trade
            </Button>
            <ChevronDownIcon  />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">You send</span>
              <Badge variant="secondary">1 BTC = 42865.537846 BUSD</Badge>
            </div>
            <div className="flex">
              <Input className="flex-grow mr-2" placeholder="1" />
              <Select>
                <SelectTrigger id="currency-from">
                  <SelectValue placeholder="BTC" />
                </SelectTrigger>
                <SelectContent position="popper">
                  <SelectItem value="btc">BTC</SelectItem>
                  <SelectItem value="eth">ETH</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="text-xs text-green-600">No extra fees</div>
          </div>
          <div className="space-y-4">
            <span className="text-sm font-medium">You get</span>
            <div className="flex">
              <Input className="flex-grow mr-2" placeholder="42865.5378461" />
              <Select>
                <SelectTrigger id="currency-to">
                  <SelectValue placeholder="BUSD" />
                </SelectTrigger>
                <SelectContent position="popper">
                  <SelectItem value="busd">BUSD</SelectItem>
                  <SelectItem value="usdt">USDT</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex justify-between items-center">
             
              <Button className="bg-green-600 hover:bg-green-700">Exchange</Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ChevronDownIcon(props: object) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}

"use client"
import React, { useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";

const itemsPerPage = 5; // You can adjust this value as needed

export default function RateChange() {
  const [currentPage, setCurrentPage] = useState(1);

  const data = [
    { name: 'iTunes', subname: 'iTunes', sub: '[1~2000]', nairaRate: '₦1198', trend: 'hot' },
    { name: 'Steam', subname: 'Steam-GBP', sub: 'GBP', nairaRate: '₦1371', trend: 'hot' },
    { name: 'Steam', subname: 'Steam-CHF', sub: 'CHF', nairaRate: '₦1371', trend: 'hot' },
    { name: 'Steam', subname: 'Steam-USD', sub: 'USD', nairaRate: '₦1371', trend: 'hot' },
    { name: 'Walmart Visa', subname: 'WA-4034/4358/511332/4912', sub: '[400~500]', nairaRate: '₦1177', trend: 'hot' },
    { name: 'Walmart Visa', subname: 'WA-4034/4358/511332/4912', sub: '[100~399]', nairaRate: '₦1177', trend: 'hot' },
    { name: 'Razer Gold ', subname: '', sub: '[25~500]', nairaRate: '₦1209', trend: 'hot' },
    { name: 'Footlocker', subname: 'Footlocker-pic', sub: '[100~500]', nairaRate: '₦1144', trend: 'hot' },
    { name: 'Macys', subname: '', sub: '[100~300]', nairaRate: '₦1047', trend: 'hot' },
    { name: 'Sephora', subname: '', sub: '[100~500]', nairaRate: '₦1026', trend: 'hot' },
    { name: 'Nordstrom', subname: '', sub: '[100~500]', nairaRate: '₦1026', trend: 'hot' },
    { name: 'American Express', subname: 'AMEX-3779', sub: '[500]', nairaRate: '₦1112', trend: 'hot' },
    { name: 'Walmart Visa', subname: 'WA-5181/4020/5273/4373/4143', sub: '[300~500]', nairaRate: '₦1177', trend: 'hot' },
    { name: 'Google Play', subname: 'Google Play-GBP', sub: '[Ask how much you can sell]', nairaRate: '₦1144', trend: 'hot' },
    { name: 'Ebay', subname: '', sub: '[100~200]', nairaRate: '₦1101', trend: 'hot' },
    {name: 'Nike', subname:'', sub:'[100~500]', nairaRate: '₦1026', trend: 'hot'},

  ];

  const pageCount = Math.ceil(data.length / itemsPerPage);
  const paginatedData = data.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  return (
    <div className="p-4">
              <h2 className="text-2xl font-bold mb-4">Sell Rate </h2>

      <div className="bg-gradient-to-r from-blue-100 to-purple-100 rounded-xl shadow-lg p-6">

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="font-bold text-2xl text-blue-800">Card Rate</TableHead>
              <TableHead className="text-right font-semibold text-lg text-green-700">Sub</TableHead>
              <TableHead className="text-right font-semibold text-lg text-indigo-700">Rate</TableHead>
              <TableHead className="text-right font-semibold text-lg text-red-600">Trend</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedData.map((item, index) => (
              <TableRow key={index}>
                <TableCell>
                  <div className="font-bold text-xl text-gray-800">{item.name}</div>
                  <div className="text-gray-600">{item.subname}</div>
                </TableCell>
                <TableCell className="text-right text-green-700 font-semibold">{item.sub}</TableCell>
                <TableCell className="text-right text-indigo-700 font-semibold">{item.nairaRate}</TableCell>
                <TableCell className="text-right text-red-600 font-semibold">
                  <div className="flex items-center justify-end">
                    <svg className="w-5 h-5 mr-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                      <path fillRule="evenodd" d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z" clipRule="evenodd" />
                    </svg>
                    {item.trend}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <div className="mt-6 flex justify-center space-x-2">
          <Button
            variant="outline"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === pageCount}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
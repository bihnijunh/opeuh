'use client';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { usePathname } from 'next/navigation';
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { FlightsTable } from "./FlightsTable";

const AdminTab = ({ href, isActive, children }: { href: string; isActive: boolean; children: React.ReactNode }) => (
  <Link
    href={href}
    className={cn(
      "inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
      isActive
        ? "bg-background text-foreground shadow-sm"
        : "text-muted-foreground hover:text-foreground"
    )}
  >
    {children}
  </Link>
);

export default function FlightsPage() {
  const pathname = usePathname();
  const router = useRouter();

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl md:text-3xl font-bold mb-6 md:mb-8">Flight Management Dashboard</h1>
      
      <div className="mb-6 md:mb-8 overflow-x-auto">
        <div className="inline-flex h-10 items-center justify-center rounded-md bg-muted p-1 text-muted-foreground">
          <AdminTab href="/admin" isActive={pathname === '/admin'}>
            Users
          </AdminTab>
         
          <AdminTab href="/admin/flights" isActive={false}>
            Create Flights
          </AdminTab>
          <AdminTab href="/admin/booked-flights" isActive={false}>
            Booked Flights
          </AdminTab>
          <AdminTab href="/admin/flight-status" isActive={false}>
            Flight Status
          </AdminTab>
          <AdminTab href="/admin/payment-methods" isActive={false}>
            Payment Methods
          </AdminTab>
        </div>
      </div>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>All Flights</CardTitle>
          <Button onClick={() => router.push("/admin/flights/new")}>
            <Plus className="mr-2 h-4 w-4" />
            Add Flight
          </Button>
        </CardHeader>
        <CardContent>
          <FlightsTable />
        </CardContent>
      </Card>
    </div>
  );
}

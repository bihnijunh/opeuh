import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function BookingNotFound() {
  return (
    <div className="container mx-auto py-10 px-4 text-center">
      <h1 className="text-2xl font-bold mb-4">Booking Not Found</h1>
      <p className="text-muted-foreground mb-6">
        We couldn&apos;t find the booking you&apos;re looking for. Please check the ticket number and try again.
      </p>
      <Link href="/flights">
        <Button>Return to Flights</Button>
      </Link>
    </div>
  );
}

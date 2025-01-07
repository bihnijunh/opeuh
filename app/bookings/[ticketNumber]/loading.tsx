import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function BookingLoading() {
  return (
    <div className="container mx-auto py-10 px-4">
      <Card className="max-w-2xl mx-auto p-6 space-y-6">
        <div className="text-center space-y-2">
          <Skeleton className="h-8 w-64 mx-auto" />
          <Skeleton className="h-4 w-48 mx-auto" />
        </div>

        <div className="space-y-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-muted p-4 rounded-lg">
              <Skeleton className="h-6 w-40 mb-2" />
              <div className="space-y-2">
                {[1, 2, 3].map((j) => (
                  <div key={j} className="flex justify-between">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-4 w-32" />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-center pt-4">
          <Skeleton className="h-10 w-32" />
        </div>
      </Card>
    </div>
  );
}

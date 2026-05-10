import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';

export function DashboardSkeleton() {
  return (
    <div className="space-y-12">
      {/* Welcome Panel Skeleton */}
      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-2 space-y-4 flex flex-col justify-center py-4">
          <Skeleton className="h-10 w-3/4" />
          <Skeleton className="h-6 w-2/3" />
        </div>
        <div className="flex flex-col gap-3">
          <Skeleton className="h-14 w-full" />
          <div className="grid grid-cols-2 gap-3">
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
          </div>
        </div>
      </div>

      {/* Grid Skeleton */}
      <div className="space-y-4">
        <Skeleton className="h-8 w-40" />
        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="h-full overflow-hidden flex flex-col">
              <Skeleton className="h-40 w-full rounded-none" />
              <CardHeader className="p-4 pb-2">
                <Skeleton className="h-6 w-3/4" />
              </CardHeader>
              <CardContent className="p-4 pt-0 flex-1">
                <Skeleton className="h-4 w-1/2" />
              </CardContent>
              <CardFooter className="p-4 pt-0 flex items-center justify-between border-t mt-auto pt-4">
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-4 w-24" />
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}

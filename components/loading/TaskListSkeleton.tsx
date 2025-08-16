import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent } from "@/components/ui/card"

export function TaskListSkeleton() {
  return (
    <div className="space-y-4">
      {/* Add task button skeleton */}
      <div className="flex gap-2">
        <Skeleton className="h-10 w-32" />
        <Skeleton className="h-10 w-24" />
      </div>

      {/* Task input skeleton */}
      <Card className="border-dashed">
        <CardContent className="p-4">
          <div className="flex gap-2">
            <Skeleton className="h-10 flex-1" />
            <Skeleton className="h-10 w-20" />
          </div>
        </CardContent>
      </Card>

      {/* Task items skeleton */}
      {Array.from({ length: 5 }).map((_, i) => (
        <Card key={i} className="hover:shadow-sm transition-shadow">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              {/* Checkbox */}
              <Skeleton className="h-4 w-4 rounded mt-1" />
              
              <div className="flex-1 min-w-0">
                {/* Task title */}
                <Skeleton className="h-5 w-full mb-2" />
                
                {/* Task details */}
                <div className="flex flex-wrap items-center gap-2">
                  <Skeleton className="h-4 w-16" />
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-4 w-12" />
                </div>
              </div>
              
              {/* Actions */}
              <div className="flex gap-1">
                <Skeleton className="h-8 w-8 rounded" />
                <Skeleton className="h-8 w-8 rounded" />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}

      {/* Empty state skeleton */}
      <div className="text-center py-8">
        <Skeleton className="h-12 w-12 rounded-full mx-auto mb-4" />
        <Skeleton className="h-6 w-48 mx-auto mb-2" />
        <Skeleton className="h-4 w-64 mx-auto" />
      </div>
    </div>
  )
}

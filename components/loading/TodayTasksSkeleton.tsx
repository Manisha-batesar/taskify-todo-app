import { Skeleton } from "@/components/ui/skeleton"
import { TaskListSkeleton } from "./TaskListSkeleton"

export function TodayTasksSkeleton() {
  return (
    <div className="min-h-screen bg-[var(--taskify-background)]">
      <div className="max-w-4xl mx-auto py-8 px-4">
        {/* Page title skeleton */}
        <div className="mb-6">
          <Skeleton className="h-8 w-48" />
        </div>
        
        {/* Task list skeleton */}
        <TaskListSkeleton />
      </div>
    </div>
  )
}

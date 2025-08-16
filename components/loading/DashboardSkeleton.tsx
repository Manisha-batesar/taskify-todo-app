import { SidebarSkeleton } from "./SidebarSkeleton"
import { HeaderSkeleton } from "./HeaderSkeleton"
import { TaskListSkeleton } from "./TaskListSkeleton"

export function DashboardSkeleton() {
  return (
    <div className="flex h-screen bg-[var(--taskify-background)]">
      {/* Sidebar skeleton */}
      <SidebarSkeleton />

      {/* Main content skeleton */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header skeleton */}
        <HeaderSkeleton />
        
        {/* Main content area */}
        <main className="flex-1 overflow-y-auto p-2 sm:p-4 lg:p-6">
          <div className="max-w-4xl mx-auto space-y-6">
            <TaskListSkeleton />
          </div>
        </main>
      </div>
    </div>
  )
}
